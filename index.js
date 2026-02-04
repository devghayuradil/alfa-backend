import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from 'cookie-parser'

dotenv.config();
const PORT = process.env.PORT || 5000;

// connnection for MongoDB
connectDB();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


// importing routes
import userRoutes from "./routes/userRoutes.js";
import collectionRouter from "./routes/collectionRoutes.js";
import productRouter from "./routes/productRoutes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/collections", collectionRouter);
app.use("/api/v1/Products", productRouter);

app.listen(PORT, () => {
  console.log(`Server is listening at PORT:${PORT}`);
});
