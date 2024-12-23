import * as Router from "express";
const router = new Router();
const Controller = require("../controler/areaplants");

router.get("/areaplants", Controller.getAreaplants);
router.get("/areaplantsPage", Controller.getAreaplantsPage);
router.delete("/areaplants", Controller.deleteAreaplants);
router.post("/areaplants", Controller.createAreaplants);
router.put("/areaplants", Controller.updateAreaplants);

module.exports = router;
