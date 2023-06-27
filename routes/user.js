import express from "express";
import { getMyProfile, login, logout, register,getAllUsers } from "../controllers/user.js";
import { isAuthenticated,isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", register);
router.post("/login", login);

router.get("/logout", logout);

router.get("/me", isAuthenticated, getMyProfile);
router.get("/allusers",isAuthenticated,isAdmin,getAllUsers)
export default router;