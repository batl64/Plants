import db from "../db.js";

class Categories {
  async getCategories(req, res) {
    const {
      orderDirection,
      orederFild,
      pageSize,
      pageNumber,
      search,
      searchFields,
    } = req.query;
    let categor = {
      NameCategory: "C1.NameCategory",
      Level: "C1.Level",
      NameParentCategories: "C2.NameCategory",
    };

    let url = `SELECT C1.ID_Category as id, C2.ID_Category as IdParentCategories ,C1.NameCategory as NameCategory, C1.Level, C2.NameCategory as NameParentCategories FROM categories as C1  
    LEFT JOIN categories as C2 on C1.ID_ParentCategories = C2.ID_Category 
    WHERE 1 AND (`;
    const ser = searchFields.split(",");
    ser.map((dat, idx) => {
      url += `${categor[dat]} like '%${search}%' `;
      if (idx < ser.length - 1) {
        url += ` OR `;
      }
    });

    url += `) ORDER  BY ${categor[orederFild]} ${orderDirection} `;
    url += `Limit ${pageSize} `;
    url += `OFFSET ${pageSize * pageNumber}`;

    db.query(url, (err, result) => {
      res.send(result);
    });
  }

  async getCategoriesPage(req, res) {
    const { orderDirection, orederFild, search, searchFields } = req.query;
    let categor = {
      NameCategory: "C1.NameCategory",
      Level: "C1.Level",
      NameParentCategories: "C2.NameCategory",
    };
    let url = `SELECT Count(*) As pagesNumber FROM categories as C1  
    LEFT JOIN categories as C2 on C1.ID_ParentCategories = C2.ID_Category  
    WHERE 1 AND (`;
    const ser = searchFields.split(",");
    ser.map((dat, idx) => {
      url += `${categor[dat]} like '%${search}%' `;
      if (idx < ser.length - 1) {
        url += ` OR `;
      }
    });

    url += `) ORDER  BY ${categor[orederFild]} ${orderDirection} `;
    db.query(url, (err, result) => {
      res.json(result);
    });
  }

  async deleteCategories(req, res) {
    const { id } = req.body;
    db.query(
      `DELETE FROM categories WHERE ID_Category = ${id}`,
      (err, result) => {
        res.json(result);
      }
    );
  }

  async getCategoriesList(req, res) {
    let url = `SELECT ID_Category, NameCategory From categories`;

    db.query(url, (err, result) => {
      res.json(result);
    });
  }

  async createCategories(req, res) {
    const { NameCategory, IdParentCategories } = req.body;
    db.query(
      `INSERT INTO categories( NameCategory, Level, ID_ParentCategories) VALUES ('${NameCategory}',1,${IdParentCategories})`,
      (err, result) => {
        if (err && err.code == "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Duplicate" });
        }
        res.status(200).json({ message: "Creacte" });
      }
    );
  }

  async updateCategories(req, res) {
    const { id, NameCategory, Level, IdParentCategories } = req.body;

    db.query(
      `UPDATE categories SET NameCategory='${NameCategory}',Level=1, ID_ParentCategories =${IdParentCategories} WHERE ID_Category = ${id}`,
      (err, result) => {
        if (err && err.code == "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Duplicate" });
        }
        res.json(result);
      }
    );
  }
}

module.exports = new Categories();
