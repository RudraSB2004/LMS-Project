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
const PORT = process.env.PORT || 3000;
const _dirname = path.resolve();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/progress", courseProgressRoute);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`); //port:4000
});
