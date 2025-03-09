import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCreatorCourses,
  getLectureById,
  getPublishedCourse,
  searchcourse,
  togglePublishCourse,
  getCourseLecture,
  removeLecture,
} from "../controllers/course.controller.js";
const router = express.Router();
import upload from "../utils/multer.js";

router.post("/", isAuthenticated, createCourse);
router.get("/search", isAuthenticated, searchcourse);
router.get("/", isAuthenticated, getCreatorCourses);
router.get("/published-courses", getPublishedCourse);

router.put(
  "/:courseId",
  isAuthenticated,
  upload.single("courseThumbnail"),
  editCourse
);
router.get("/:courseId", isAuthenticated, getCourseById);
router.post("/:courseId/lecture", isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.put("/:courseId/lecture/:lectureId", isAuthenticated, editLecture);
router.get("/lecture/:lectureId", isAuthenticated, getLectureById);
router.patch("/:courseId", isAuthenticated, togglePublishCourse);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
export default router;
