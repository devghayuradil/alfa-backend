import express from "express";
import { allUsersController, loginController, logoutController, registerController } from "../controllers/userController.js";
import { isAdmin, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);

// Admin Routes
router.get("/all-users", isAuthorized, isAdmin, allUsersController)

export default router;
