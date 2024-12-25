import db from "../db.js";

class Areaplants {
  async getAreaplants(req, res) {
    const {
      orderDirection,
      orederFild,
      pageSize,
      pageNumber,
      search,
      searchFields,
    } = req.query;
    let area = {
      NamePlant: "plants.Name",
      NameRegion: "regions.Name",
    };
    let url = `SELECT ID_AreaPlants as id, AreaSize, plants.Name as NamePlant, regions.Name as NameRegion, Date_LastUpdated, 
    areaplants.ID_Region as IDRegion, areaplants.ID_Plant as IDPlant
    FROM areaplants 
    LEFT JOIN regions on areaplants.ID_Region = regions.ID_Region 
    LEFT JOIN plants on areaplants.ID_Plant = plants.ID_Plant  
    WHERE 1 AND (`;
    const ser = searchFields.split(",");
    ser.map((dat, idx) => {
      url += `${area[dat] || dat} like '%${search}%' `;
      if (idx < ser.length - 1) {
        url += ` OR `;
      }
    });

    url += `) ORDER  BY ${area[orederFild] || orederFild} ${orderDirection} `;
    url += `Limit ${pageSize} `;
    url += `OFFSET ${pageSize * pageNumber}`;

    db.query(url, (err, result) => {
      res.send(result);
    });
  }

  async getAreaplantsPage(req, res) {
    const { orderDirection, orederFild, search, searchFields } = req.query;
    let area = {
      NamePlant: "plants.Name",
      NameRegion: "regions.Name",
    };
    let url = `SELECT Count(*) As pagesNumber FROM areaplants 
    LEFT JOIN regions on areaplants.ID_Region = regions.ID_Region 
    LEFT JOIN plants on areaplants.ID_Plant = plants.ID_Plant    
    WHERE 1 AND (`;
    const ser = searchFields.split(",");
    ser.map((dat, idx) => {
      url += `${area[dat] || dat} like '%${search}%' `;
      if (idx < ser.length - 1) {
        url += ` OR `;
      }
    });

    url += `) ORDER  BY ${area[orederFild] || orederFild} ${orderDirection} `;

    db.query(url, (err, result) => {
      res.json(result);
    });
  }

  async deleteAreaplants(req, res) {
    const { id } = req.body;
    db.query(
      `DELETE FROM areaplants WHERE ID_AreaPlants = ${id}`,
      (err, result) => {
        res.json(result);
      }
    );
  }

  async createAreaplants(req, res) {
    const { IDRegion, IDPlant, AreaSize } = req.body;

    db.query(
      `INSERT INTO areaplants( ID_Region, ID_Plant, AreaSize, Date_LastUpdated ) VALUES (${IDRegion},${IDPlant},${AreaSize},'${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}')`,
      (err, result) => {
        if (err && err.code == "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Duplicate" });
        }
        res.status(200).json({ message: "List creacte" });
      }
    );
  }

  async updateAreaplants(req, res) {
    const { id, IDRegion, IDPlant, AreaSize } = req.body;

    db.query(
      `UPDATE areaplants SET ID_Region=${IDRegion},ID_Plant=${IDPlant},AreaSize=${AreaSize},Date_LastUpdated='${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}'
      WHERE ID_AreaPlants = ${id}`,
      (err, result) => {
        if (err && err.code == "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Duplicate" });
        }
        res.json(result);
      }
    );
  }
}

module.exports = new Areaplants();
