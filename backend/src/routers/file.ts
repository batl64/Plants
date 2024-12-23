import * as Router from "express";
const router = new Router();
const FileController = require("../controler/file.js");

router.get("/file/:fileName", FileController.getFile);

module.exports = router;
