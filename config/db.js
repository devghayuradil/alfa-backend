import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to MongoDB ${res.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Connection Error: ${error}`);
  }
};

export default connectDB;
