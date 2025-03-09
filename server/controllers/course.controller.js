import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};

export const searchcourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
      ],
    };
    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; //sort by price in ascending
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; // descending
    }

    let courses = await Course.find(searchCriteria).sort(sortOptions);

    return res.status(200).json({
      message: "Courses retrieved successfully",
      courses,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to search courses",
    });
  }
};

export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });
    if (!courses) {
      return res.status(404).json({
        message: "No courses found",
      });
    }
    return res.status(200).json({
      message: "Courses found",
      courses,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to get published courses",
    });
  }
};
export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Course not found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to get creator courses",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        // Extract publicId correctly
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      courseThumbnail = await uploadMedia(thumbnail.buffer); // Fix here
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url || course.courseThumbnail, // Preserve old thumbnail if not updated
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    return res
      .status(200)
      .json({ course, message: "Course updated successfully." });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({ message: "Failed to update course", error });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get course",
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Please provide lecture title and course id",
      });
    }
    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findById(courseId);

    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(201).json({
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create lecture",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      message: "Course lecture found",
      lectures: course.lectures,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get course lecture",
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, isPreviewFree, videoInfo } = req.body;
    const { courseId, lectureId } = req.params;

    // Find the lecture
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }

    // Update lecture details
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

    // Handle video upload
    if (videoInfo) {
      // Delete the old video from Cloudinary if it exists
      if (lecture.publicId) {
        await deleteMediaFromCloudinary(lecture.publicId, "video");
      }

      // Update the new video URL and public ID
      lecture.videoUrl = videoInfo.videoUrl;
      lecture.publicId = videoInfo.publicId;
    }

    // Save the updated lecture
    await lecture.save();

    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit lecture",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );

    return res.status(200).json({
      message: "Lecture removed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to remove lecture",
    });
  }
};
export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get lecture",
    });
  }
};

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      message: `Course ${statusMessage} successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to toggle course publish status",
    });
  }
};
