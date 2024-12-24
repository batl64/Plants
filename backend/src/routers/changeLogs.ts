import * as Router from "express";
const router = new Router();
const Controller = require("../controler/changeLogs.js");

router.get("/changeLogs", Controller.getchangeLogs);
router.get("/changeLogsPage", Controller.getchangeLogsPage);
router.get("/changeLogsList", Controller.getchangeList);

module.exports = router;
