import express from "express";
import { delThumbnail, generateThumbnail } from "../controllers/ThumbnailController.js";
import authMiddleware from "../middlewares/auth.js";

const ThumbnailRouter = express.Router()

ThumbnailRouter.post("/generate", authMiddleware, generateThumbnail);
ThumbnailRouter.delete("/delete/:id", authMiddleware, delThumbnail);


export default ThumbnailRouter;