import express from "express"
import { getThumbnailById, getUersThumbnails } from "../controllers/UserController.js";

const UserRouter = express.Router();

UserRouter.get("/thumbnails",getUersThumbnails);
UserRouter.get("/thumbnail/:id",getThumbnailById);

export default UserRouter;