import db from "../db.js";

class ChangeLogs {
  async getchangeLogs(req, res) {
    const {
      orderDirection,
      orederFild,
      pageSize,
      pageNumber,
      search,
      searchFields,
    } = req.query;

    const log = {
      NameRegion: "regions.Name",
      NamePlant: "plants.Name",
      ChangeDate: "changeLogs.ChangeDate",
      AreaSizes: "changeLogs.AreaSize",
      description: "changeLogs.Description",
      AreaSize: "changeLogs.AreaSize",
    };

    let url = `SELECT areaplants.ID_AreaPlants, changeLogs.ChangeDate as ChangeDate, changeLogs.AreaSize as AreaSize, 
    changeLogs.Description as description,
    regions.Name as NameRegion,regions.RegionType as regType, plants.Name as NamePlant, plants.PhotoURL as fileName 
    FROM changeLogs 
    LEFT JOIN areaplants on changeLogs.ID_AreaPlants = areaplants.ID_AreaPlants
    LEFT JOIN regions on areaplants.ID_Region = regions.ID_Region
    LEFT JOIN plants on areaplants.ID_Plant   = plants.ID_Plant  
    WHERE 1 AND (`;
    const ser = searchFields.split(",");
    ser.map((dat, idx) => {
      url += `${log[dat]} like '%${search}%' `;
      if (idx < ser.length - 1) {
        url += ` OR `;
      }
    });

    url += `) ORDER  BY ${log[orederFild]} ${orderDirection} `;
    url += `Limit ${pageSize} `;
    url += `OFFSET ${pageSize * pageNumber}`;

    db.query(url, (err, result) => {
      res.send(result);
    });
  }

  async getchangeLogsPage(req, res) {
    const { orderDirection, orederFild, search, searchFields } = req.query;

    const log = {
      NameRegion: "regions.Name",
      NamePlant: "plants.Name",
      ChangeDate: "changeLogs.ChangeDate",
      AreaSizes: "changeLogs.AreaSize",
      description: "changeLogs.Description",
      AreaSize: "changeLogs.AreaSize",
    };

    let url = `SELECT Count(*) As pagesNumber 
    From changeLogs 
    LEFT JOIN areaplants on changeLogs.ID_AreaPlants = areaplants.ID_AreaPlants
    LEFT JOIN regions on areaplants.ID_Region = regions.ID_Region
    LEFT JOIN plants on areaplants.ID_Plant   = plants.ID_Plant  
    WHERE 1 AND (`;
    const ser = searchFields.split(",");
    ser.map((dat, idx) => {
      url += `${log[dat] || dat} like '%${search}%' `;
      if (idx < ser.length - 1) {
        url += ` OR `;
      }
    });

    url += `) ORDER  BY ${log[orederFild] || orederFild} ${orderDirection} `;

    db.query(url, (err, result) => {
      res.json(result);
    });
  }

  async getchangeList(req, res) {
    const { id, date } = req.query;

    let url =
      `SELECT areaplants.ID_AreaPlants, changeLogs.ChangeDate, changeLogs.AreaSize, regions.Name as RegionName,regions.RegionType as regType, plants.Name, plants.PhotoURL
    From changeLogs
    LEFT JOIN areaplants on changeLogs.ID_AreaPlants = areaplants.ID_AreaPlants
    LEFT JOIN regions on areaplants.ID_Region = regions.ID_Region
    LEFT JOIN plants on areaplants.ID_Plant   = plants.ID_Plant  
    Where areaplants.ID_Plant =${id} and changeLogs.ChangeDate = (
    SELECT MAX(t2.ChangeDate)
    FROM changeLogs t2
    WHERE t2.ID_AreaPlants = changeLogs.ID_AreaPlants
` +
      (date && date != "null"
        ? ` AND t2.ChangeDate < "${date}" 
    `
        : "") +
      `);`;

    db.query(url, (err, result) => {
      res.json(result);
    });
  }
}

module.exports = new ChangeLogs();
