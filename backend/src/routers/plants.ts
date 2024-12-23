import * as Router from "express";
const router = new Router();
const Controller = require("../controler/plants.js");
const FileController = require("../controler/file.js");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "file/",
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    const filename = `${new Date()
      .toISOString()
      .replace(/:/g, "-")}.${extension}`;
    cb(null, filename);
  },
});
const load = multer({ storage });

router.get("/plants", Controller.getPlants);
router.get("/plantsPage", Controller.getPlantsPage);
router.delete("/plants", Controller.deletePlants);
router.get("/plantsList", Controller.getPlantsList);
router.post("/plants", load.single("file"), Controller.createPlants);
router.put("/plants", load.single("file"), Controller.updatePlants);

module.exports = router;
