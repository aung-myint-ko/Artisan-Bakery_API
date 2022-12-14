import express from "express";
import mongoose from "mongoose";
import dotenv, { config } from "dotenv";
import cookieParser from "cookie-parser";
import RecipesRoute from "./routes/recipes.js";
import SignUp from "./routes/auth.js";
import cors from "cors";
const app = express();
dotenv.config();

//Middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://artisan-bakery.vercel.app",
    credentials: true,
  })
);

const DB_connection = () => {
  mongoose
    .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
    .then(() => {
      console.log("DB is successfully connected");
    })
    .catch((err) => {
      throw err;
    });
};

//Routes
app.use("/api/recipes", RecipesRoute);
app.use("/api/auth", SignUp);

//Error Handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "something went wrong";
  console.error(err.stack);
  return res.status(status).json({
    success: false,
    status,
    message,
    timestamp: Date.now(),
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  DB_connection();
  console.log("server is connected");
});
