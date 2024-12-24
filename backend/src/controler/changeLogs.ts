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
    let url = `SELECT * FROM changeLogs WHERE 1 AND (`;
    const ser = searchFields.split(",");
    ser.map((dat, idx) => {
      url += `${dat} like '%${search}%' `;
      if (idx < ser.length - 1) {
        url += ` OR `;
      }
    });

    url += `) ORDER  BY ${orederFild} ${orderDirection} `;
    url += `Limit ${pageSize} `;
    url += `OFFSET ${pageSize * pageNumber}`;

    db.query(url, (err, result) => {
      res.send(result);
    });
  }

  async getchangeLogsPage(req, res) {
    const { orderDirection, orederFild, search, searchFields } = req.query;

    let url = `SELECT Count(*) As pagesNumber From changeLogs WHERE 1 AND (`;
    const ser = searchFields.split(",");
    ser.map((dat, idx) => {
      url += `${dat} like '%${search}%' `;
      if (idx < ser.length - 1) {
        url += ` OR `;
      }
    });

    url += `) ORDER  BY ${orederFild} ${orderDirection} `;
    db.query(url, (err, result) => {
      res.json(result);
    });
  }

  async getchangeList(req, res) {
    const { id } = req.query;

    let url = `SELECT areaplants.ID_AreaPlants, changeLogs.ChangeDate, changeLogs.AreaSize, regions.Name as RegionName,regions.RegionType as regType, plants.Name, plants.PhotoURL
    From changeLogs
    LEFT JOIN areaplants on changeLogs.ID_AreaPlants = areaplants.ID_AreaPlants
    LEFT JOIN regions on areaplants.ID_Region = regions.ID_Region
    LEFT JOIN plants on areaplants.ID_Plant   = plants.ID_Plant  
    Where areaplants.ID_Plant =${id}
    `;

    db.query(url, (err, result) => {
      res.json(result);
    });
  }
}

module.exports = new ChangeLogs();
