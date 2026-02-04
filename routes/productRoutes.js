import express from "express";
import { isAdmin, isAuthorized } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  updateSingleProductController,
  
} from "../controllers/productController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const productRouter = express.Router();

//localhost:8000/api/v1/products/ - GET
productRouter.get("/", getProductController);

//localhost:8000/api/v1/products/:slug - GET
productRouter.get("/:slug", getSingleProductController);

// Admin Routes
//localhost:8000/api/v1/products/ - POST
productRouter.post("/", upload.single("picture"), isAuthorized, isAdmin, createProductController);

//localhost:8000/api/v1/products/:slug - PUT
productRouter.put("/:slug", upload.single("picture"), isAuthorized, isAdmin, updateSingleProductController);

//localhost:8000/api/v1/products/:slug - DELETE
productRouter.delete("/:slug", isAuthorized, isAdmin, deleteProductController);

export default productRouter;
