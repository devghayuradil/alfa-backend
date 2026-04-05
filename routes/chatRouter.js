import express from "express";
import { chatbotController } from "../controllers/chatController.js";

const chatRouter = express.Router();

// Define your chatbot routes here
chatRouter.post("/", chatbotController);

export default chatRouter;
