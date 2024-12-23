import * as Router from "express";
const router = new Router();
const AuthrController = require("../controler/userAuth.js");

router.post("/login", AuthrController.login);
router.post("/auth", AuthrController.auth);
router.get("/users", AuthrController.getUsers);
router.post("/changePassword", AuthrController.changePassword);
router.get("/usersPage", AuthrController.getUsersPage);
router.delete("/users", AuthrController.deleteUsers);
router.put("/users", AuthrController.putUsers);
router.post("/users", AuthrController.postUsers);
module.exports = router;
