import * as Router from "express";
const router = new Router();
const Controller = require("../controler/categories.js");

router.get("/categories", Controller.getCategories);
router.get("/categoriesPage", Controller.getCategoriesPage);
router.get("/categoriesList", Controller.getCategoriesList);
router.delete("/categories", Controller.deleteCategories);
router.post("/categories", Controller.createCategories);
router.put("/categories", Controller.updateCategories);
module.exports = router;
