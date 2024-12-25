import db from "../db.js";
import path = require("path");
const fs = require("fs");

class Plants {
  async getPlants(req, res) {
    const {
      orderDirection,
      orederFild,
      pageSize,
      pageNumber,
      search,
      searchFields,
    } = req.query;

    let url = `SELECT PhotoURL, plants.ID_Category as IDCategory, plants.ID_Plant as id, Name, Area, PhotoURL,NameCategory, Description FROM plants 
    LEFT JOIN categories on plants.ID_Category = categories.ID_Category  
    WHERE 1 AND (`;
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

  async getPlantsPage(req, res) {
    const { orderDirection, orederFild, search, searchFields } = req.query;

    let url = `SELECT Count(*) As pagesNumber From plants 
        LEFT JOIN categories on plants.ID_Category = categories.ID_Category  
    WHERE 1 AND (`;
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
  async deletePlants(req, res) {
    let { id, PhotoURL } = req.body;
    PhotoURL =
      PhotoURL == "null"
        ? undefined
        : PhotoURL == "undefined"
        ? undefined
        : PhotoURL;

    if (PhotoURL) {
      const filePath = path.join(
        path.resolve(__dirname, "../../../") + "/file",
        PhotoURL
      );
      fs.unlink(filePath, (error) => {
        if (error) {
          console.error("Error while deleting file:", error.message);
        }
      });
    }

    db.query(`DELETE FROM plants WHERE ID_Plant = ${id}`, (err, result) => {
      res.json(result);
    });
  }

  async getPlantsList(req, res) {
    let url = `SELECT ID_Plant, Name From plants`;

    db.query(url, (err, result) => {
      res.json(result);
    });
  }

  async createPlants(req, res) {
    const { Name, PhotoURL, Area, IDCategory, Description } = req.query;
    let photo = undefined;
    if (req?.file) {
      photo = req?.file?.filename;
    }

    db.query(
      `INSERT INTO plants( Name, PhotoURL, Area, ID_Category,Description ) VALUES ('${Name}','${
        photo || PhotoURL || null
      }',${Area},${IDCategory},'${Description}')`,
      (err, result) => {
        res.status(200).json({ message: "List creacte" });
      }
    );
  }

  async updatePlants(req, res) {
    let { id, Name, PhotoURL, Area, IDCategory, Description } = req.query;
    let photo = undefined;
    PhotoURL =
      PhotoURL == "null"
        ? undefined
        : PhotoURL == "undefined"
        ? undefined
        : PhotoURL;
    if (req?.file) {
      photo = req?.file?.filename;
    }

    db.query(
      `UPDATE plants SET Name='${Name}',PhotoURL='${
        photo || PhotoURL || null
      }', Area =${Area}, ID_Category=${IDCategory},Description='${Description}' WHERE ID_Plant = ${id}`,
      (err, result) => {
        res.json(result);
      }
    );

    if (photo && PhotoURL) {
      const filePath = path.join(
        path.resolve(__dirname, "../../../") + "/file",
        PhotoURL
      );
      fs.unlink(filePath, (error) => {
        if (error) {
          console.error("Error while deleting file:", error.message);
        }
      });
    }
  }
}

module.exports = new Plants();
