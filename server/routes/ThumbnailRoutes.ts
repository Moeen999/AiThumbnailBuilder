import express from "express";
import { delThumbnail, generateThumbnail } from "../controllers/ThumbnailController.js";

const ThumbnailRouter = express.Router()

ThumbnailRouter.post("/generate",generateThumbnail);
ThumbnailRouter.delete("/delete/:id",delThumbnail);


export default ThumbnailRouter;