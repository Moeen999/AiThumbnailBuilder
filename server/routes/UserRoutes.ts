import express from "express"
import { getThumbnailById, getUersThumbnails } from "../controllers/UserController.js";
import authMiddleware from "../middlewares/auth.js";

const UserRouter = express.Router();

UserRouter.get("/thumbnails", authMiddleware, getUersThumbnails);
UserRouter.get("/thumbnail/:id", authMiddleware, getThumbnailById);

export default UserRouter;