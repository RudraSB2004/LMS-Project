import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import userRouter from "./routes/user.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseRoute from "./routes/course.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import path from "path";
dotenv.config({});

const app = express();
connectDB();
const PORT = process.env.PORT;
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: [process.env.FRONTEND_PORT],
    credentials: true,
  })
);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/progress", courseProgressRoute);

app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`); //port:4000
});
