import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import urlRoutes from "./routes/url.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  }),
);

app.use(express.json());

app.use("/", urlRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("success");
    app.listen(process.env.PORT, () => {
      console.log("server is runnig");
    });
  })
  .catch((err) => {
    console.error("error connecting to the server", err);
  });
