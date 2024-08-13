import mongoose from 'mongoose';
import dotenv from 'dotenv';
import devAdmin from './seeders/devAdmin';

dotenv.config();

const MONGO_URI =
    process.env.NODE_ENV === 'test'
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI;

const connect = async (retries = 5) => {
    try {
        await mongoose.connect(MONGO_URI as string);
        console.log('MongoDB connected');
        await devAdmin();
    } catch (error) {
        console.error('MongoDB connection error:', error);
        if (retries > 0) {
            console.log(`Retrying connection... (${retries} attempts left)`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return connect(retries - 1);
        }
        throw error;
    }
};

const closeConnection = async () => {
    //   await mongoose.connection.close();
    await mongoose.disconnect();
};

export default {
    connect,
    closeConnection,
};
