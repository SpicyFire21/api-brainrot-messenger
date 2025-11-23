import express from 'express'
import * as userController from "../controller/user.controller.js";


var router = express.Router();

router.get("/",userController.getUsers);                                                                    //
router.post("/login",userController.loginUser);
router.post("/register",userController.addUser);




router.get("/:id",userController.getUserById);                                                              //
router.delete("/:id", userController.deleteUserById);                                                       //

export default router;
