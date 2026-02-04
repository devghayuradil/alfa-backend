import express from "express";
import { isAdmin, isAuthorized } from "../middlewares/authMiddleware.js";
import {
  createCollectionController,
  deleteCollectionController,
  getCollectionsController,
  updateCollectionController,
} from "../controllers/collectionController.js";

const collectionRouter = express.Router();

collectionRouter.get("/all", getCollectionsController);

// Admin Routes
//localhost:8000/api/v1/collections/ - POST
collectionRouter.post(
  "/",
  isAuthorized,
  isAdmin,
  createCollectionController
);
//localhost:8000/api/v1/collections/:slug - DELETE
collectionRouter.delete(
  "/:slug",
  isAuthorized,
  isAdmin,
  deleteCollectionController
);
//localhost:8000/api/v1/collections/:slug - UPDATE
collectionRouter.put(
  "/:slug",
  isAuthorized,
  isAdmin,
  updateCollectionController
);

export default collectionRouter;
