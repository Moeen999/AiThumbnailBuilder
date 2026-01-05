import express from "express";
import { loginUser, logoutUser, registerUser, verifyUser } from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/auth.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", loginUser);
AuthRouter.get("/verify", authMiddleware, verifyUser);
AuthRouter.post("/logout", authMiddleware, logoutUser);


export default AuthRouter;