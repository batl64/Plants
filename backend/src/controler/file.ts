import path = require("path");
import db from "../db.js";

class MessageController {
  async getFile(req, res) {
    const fileName = req?.params?.fileName;
    const filePath = path.join(
      path.resolve(__dirname, "../../../"),
      "file",
      fileName
    );

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send("File not found!");
      }
    });
  }
}

module.exports = new MessageController();
