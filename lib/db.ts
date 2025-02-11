// import { MongooseGlobal } from "@/types";
// import mongoose from "mongoose";

// const MONGO_URL = process.env.MONGO_URL!;

// if (!MONGO_URL) {
//     throw new Error("MONGO_URL is not defined");
// }

// let cached: MongooseGlobal = {
//     connection: null,
//     promise: null,
// }

// if (!cached) {
//     cached = { connection: null, promise: null };
// }

// export async function connectionToDatabase() {
//     if (cached.connection) {
//         return cached.connection;
//     }

//     if (!cached.promise) {
//         const opts = {
//             bufferCommands: true,
//             maxPoolSize: 10,
//         }

//         cached.promise = mongoose
//             .connect(MONGO_URL, opts)
//             .then(() => mongoose.connection)
//     }

//     try {
//         cached.connection = await cached.promise;
//     } catch (e) {
//         cached.promise = null;
//         throw e;
//     }

//     return cached.connection;
// }

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URL!;

if (!MONGO_URI) {
    throw new Error('MongoDB URI not defined');
}

interface Connection {
    isConnected?: number;
}

const connection: Connection = {};

export async function connectionToDatabase() {
    if (connection.isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(MONGO_URI, {
            bufferCommands: true,
            maxPoolSize: 10,
        });

        connection.isConnected = db.connections[0].readyState;
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
}

// export {connectionToDatabase};