import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

const connectPrimaryDatabase = async (mongoURI) => {
  await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 3000,
  });

  return {
    uri: mongoURI,
    mode: "external",
  };
};

const connectMemoryDatabase = async () => {
  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: "inventory_soft_stock",
    },
  });

  const memoryURI = memoryServer.getUri();
  await mongoose.connect(memoryURI);

  return {
    uri: memoryURI,
    mode: "memory",
  };
};

const connectDB = async () => {
  const mongoURI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/inventory_soft_stock";

  try {
    const connection = await connectPrimaryDatabase(mongoURI);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return connection;
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn("Falling back to an in-memory MongoDB instance for local preview.");

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const connection = await connectMemoryDatabase();
    console.log("In-memory MongoDB started for this session.");
    return connection;
  }
};

process.on("exit", async () => {
  if (memoryServer) {
    await memoryServer.stop();
  }
});

export default connectDB;
