import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


mongoose.connect(process.env.MONGO_URL)

const db = mongoose.connection;

export default db;