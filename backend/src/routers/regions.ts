import * as Router from "express";
const router = new Router();
const Controller = require("../controler/regions.js");

router.get("/regions", Controller.getRegions);
router.get("/regionsPage", Controller.getRegionsPage);
router.get("/regionList", Controller.getRegionsList);
router.delete("/regions", Controller.deleteRegions);
router.post("/regions", Controller.createRegion);
router.put("/regions", Controller.updateRegion);

module.exports = router;
