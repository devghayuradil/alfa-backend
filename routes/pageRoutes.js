import express from "express";
import { isAdmin, isAuthorized } from "../middlewares/authMiddleware.js";

import {
  createPageController,
  getPagesController,
  getSinglePageController,
  deletePageController,
} from "../controllers/pageController.js";

const pageRouter = express.Router();

//localhost:8000/api/v1/pages/ - GET
pageRouter.get("/get-pages", getPagesController);
pageRouter.get("/get-page/:slug", getSinglePageController);

// Admin Routes
//localhost:8000/api/v1/pages/ - POST
pageRouter.post("/create", isAuthorized, isAdmin, createPageController);
pageRouter.delete(
  "/delete/:slug",
  isAuthorized,
  isAdmin,
  deletePageController,
);

export default pageRouter;
