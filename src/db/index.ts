import mongoose from "mongoose";
import dotenv from "dotenv";
import devAdmin from "./seeders/devAdmin";

dotenv.config();

const MONGO_URI = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

const connect = async () => {
    try {
        await mongoose.connect(MONGO_URI as string);
        console.log('MongoDB connected');
        await devAdmin();

    } catch (error) {
        console.error(error);
    }
}

const closeConnection = async () => {
//   await mongoose.connection.close();
  await mongoose.disconnect();
}

export default {
    connect,
    closeConnection
}