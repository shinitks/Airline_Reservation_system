import express from "express";
import { registerUser, loginUser,getUserDetails } from "../Controllers/userController.js";
import { authenticate, restrictToUser } from "../config/authmiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser",authenticate, getUserDetails);


export default router;
