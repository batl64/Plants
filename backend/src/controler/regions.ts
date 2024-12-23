import db from "../db.js";

class Regions {
  async getRegions(req, res) {
    const {
      orderDirection,
      orederFild,
      pageSize,
      pageNumber,
      search,
      searchFields,
    } = req.query;
    const reg = {
      NameRegion: "Reg2.Name",
      regionType: "Reg2.RegionType",
      NameParentRegion: "Reg.Name",
      IdParentRegion: "Reg.ID_Region",
    };
    let url = `SELECT Reg2.ID_Region as id, Reg2.Name as NameRegion, Reg2.RegionType as regionType, 
    Reg.Name as NameParentRegion, Reg.ID_Region as IdParentRegion
    FROM regions as Reg2  
    LEFT JOIN regions as Reg on Reg2.ID_ParentRegion = Reg.ID_Region 
    WHERE 1 AND (`;
    const ser = searchFields.split(",");
    ser.map((dat, idx) => {
      url += `${reg[dat]} like '%${search}%' `;
      if (idx < ser.length - 1) {
        url += ` OR `;
      }
    });

    url += `) ORDER  BY ${reg[orederFild]} ${orderDirection} `;
    url += `Limit ${pageSize} `;
    url += `OFFSET ${pageSize * pageNumber}`;

    db.query(url, (err, result) => {
      res.send(result);
    });
  }

  async getRegionsPage(req, res) {
    const { orderDirection, orederFild, search, searchFields } = req.query;
    const reg = {
      NameRegion: "Reg2.Name",
      regionType: "Reg2.RegionType",
      NameParentRegion: "Reg.Name",
      IdParentRegion: "Reg.ID_Region",
    };
    let url = `SELECT Count(*) As pagesNumber From regions as Reg2  
    LEFT JOIN regions as Reg on Reg2.ID_ParentRegion = Reg.ID_Region 
    WHERE 1 AND (`;
    const ser = searchFields.split(",");
    ser.map((dat, idx) => {
      url += `${reg[dat]} like '%${search}%' `;
      if (idx < ser.length - 1) {
        url += ` OR `;
      }
    });

    url += `) ORDER  BY ${reg[orederFild]} ${orderDirection} `;

    db.query(url, (err, result) => {
      res.json(result);
    });
  }

  async deleteRegions(req, res) {
    const { id } = req.body;
    db.query(`DELETE FROM regions WHERE ID_Region = ${id}`, (err, result) => {
      res.json(result);
    });
  }

  async getRegionsList(req, res) {
    let url = `SELECT ID_Region, Name From regions`;

    db.query(url, (err, result) => {
      res.json(result);
    });
  }

  async createRegion(req, res) {
    const { NameRegion, regionType, IdParentRegion } = req.body;
    db.query(
      `INSERT INTO regions( Name, RegionType, ID_ParentRegion) VALUES ('${NameRegion}','${regionType}',${IdParentRegion})`,
      (err, result) => {
        res.status(200).json({ message: "List creacte" });
      }
    );
  }

  async updateRegion(req, res) {
    const { id, NameRegion, regionType, IdParentRegion } = req.body;

    db.query(
      `UPDATE regions SET Name='${NameRegion}',RegionType='${regionType}', ID_ParentRegion =${IdParentRegion} WHERE ID_Region = ${id}`,
      (err, result) => {
        res.json(result);
      }
    );
  }
}

module.exports = new Regions();
