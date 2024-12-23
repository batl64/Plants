import db from "../db.js";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.GOOGLEPASSWORD,
  },
});

const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" });
};

const validAccesToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.SECRET_KEY);
    return userData;
  } catch (e) {
    return null;
  }
};

class AuthrController {
  async login(req, res) {
    try {
      const { Password, Login } = req.body;
      db.query(
        `Select * FROM users WHERE Login="${Login}" OR Email="${Login}"`,
        (err, result) => {
          if (err) {
            return res.status(400).json({ message: "Login error" });
          } else if (typeof result !== "undefined" && result.length > 0) {
            const validPassword = bcrypt.compareSync(
              Password,
              result[0].Password
            );
            if (!validPassword) {
              return res.status(400).json({ message: "Login error" });
            }
            const token = generateAccessToken(result[0].ID_User);
            return res.json({
              token,
              userId: result[0].ID_User,
              email: result[0].Email,
              login: result[0].Login,
            });
          } else {
            res.status(400).json({ message: "Login error" });
          }
        }
      );
    } catch {
      res.status(400).json({ message: "login error" });
    }
  }

  async auth(req, res) {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "not auth" });
    }

    const userData = validAccesToken(token);

    if (!userData) {
      return res.status(401).json({ message: "not auth" });
    }

    db.query(
      `SELECT * FROM users Where ID_User='${userData.id}'`,
      (err, result) => {
        if (result.length == 0) {
          res.status(400).json({ message: "NotCorrectToken" });
        } else {
          return res.json({
            token,
            userId: result[0].ID_User,
            email: result[0].Email,
            login: result[0].Login,
          });
        }
      }
    );
  }

  async getUsers(req, res) {
    const {
      orderDirection,
      orederFild,
      pageSize,
      pageNumber,
      search,
      searchFields,
    } = req.query;
    let url = `SELECT ID_User,Login ,Email FROM users Where 1 and (`;
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

  async changePassword(req, res) {
    const { Password, oldPassword, userId } = req.body;

    db.query(
      `Select * From users WHERE ID_User = ${userId} `,
      (err, result) => {
        if (err) {
          return res.status(400).json({ message: "Registration error" });
        } else if (result.length == 0) {
          return res.status(302).json({ message: "user is login" });
        } else {
          const validPassword = bcrypt.compareSync(
            oldPassword,
            result[0].Password
          );
          if (!validPassword) {
            return res.status(400).json({ message: "Password error" });
          }
          const hashPassword = bcrypt.hashSync(Password, 7);
          db.query(
            `UPDATE users set  Password='${hashPassword}' WHERE ID_User = ${userId}`,
            (err, result) => {
              res.json(result);
            }
          );
        }
      }
    );
  }

  async getUsersPage(req, res) {
    const { orderDirection, orederFild, search, searchFields } = req.query;
    let url = `SELECT Count(*) As pagesNumber From users Where 1 and (`;
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
  async deleteUsers(req, res) {
    const { id } = req.body;
    db.query(`DELETE FROM users WHERE ID_User = ${id}`, (err, result) => {
      res.json(result);
    });
  }

  async putUsers(req, res) {
    const { Id, Email, ID_User, Login } = req.body;

    db.query(
      `Select * FROM users WHERE Login ='${Login}' AND ID_User <> ${ID_User}`,
      (err, result) => {
        if (err) {
          return res.status(400).json({ message: "Registration error" });
        } else if (typeof result !== "undefined" && result.length > 0) {
          return res.status(302).json({ message: "user is login" });
        } else {
          db.query(
            `Select * FROM users WHERE Email='${Email}' AND ID_User <> ${ID_User}`,
            (err, result) => {
              if (err) {
                res.status(400).json({ message: "Registration error" });
              } else if (typeof result !== "undefined" && result.length > 0) {
                return res.status(302).json({ message: "user is email" });
              } else {
                db.query(
                  `UPDATE users set  Email='${Email}',Login ='${Login}' WHERE ID_User = ${ID_User}`,
                  (err, result) => {
                    return res.status(200).json({ message: "registration ok" });
                  }
                );
              }
            }
          );
        }
      }
    );
  }

  async postUsers(req, res) {
    try {
      const { Email, Login, Password } = req.body;

      db.query(`Select * FROM users WHERE Login='${Login}'`, (err, result) => {
        if (err) {
          return res.status(400).json({ message: "Registration error" });
        } else if (typeof result !== "undefined" && result.length > 0) {
          return res.status(302).json({ message: "user is login" });
        } else {
          db.query(
            `Select * FROM users WHERE Email='${Email}'`,
            (err, result) => {
              if (err) {
                res.status(400).json({ message: "Registration error" });
              } else if (typeof result !== "undefined" && result.length > 0) {
                return res.status(302).json({ message: "user is email" });
              } else {
                const hashPassword = bcrypt.hashSync(Password, 7);
                db.query(
                  `INSERT INTO users(Login, Password,Email) VALUES ('${Login}','${hashPassword}','${Email}')`,
                  (err, result) => {
                    if (err) {
                      return res
                        .status(400)
                        .json({ message: "Registration error" });
                    } else {
                      const url = process.env.ADMIN;
                      const mailOption = {
                        from: process.env.EMAIL,
                        to: [Email],
                        subject: "New Account im BuildCompani Administrator",
                        html: `<h1><b>New account</b></h1>
                            <p>You are an employee of BuildCompani, if not, please ignore this file.</p>
                            <p>Otherwise, click on the link.</p>
                            <p>Your login:${Login}</p>
                            <p>Your password:${Password}</p>
                            <hr/>
                            <p><a href="${url}">Reset password</a></p>`,
                      };

                      transporter.sendMail(mailOption, (err, info) => {
                        if (err) console.log(err);
                      });
                      return res
                        .status(200)
                        .json({ message: "registration ok" });
                    }
                  }
                );
              }
            }
          );
        }
      });
    } catch {
      return res.status(400).json({ message: "Registration error" });
    }
  }
}

module.exports = new AuthrController();
