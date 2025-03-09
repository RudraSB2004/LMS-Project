import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "../../features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import BuyCourseButton from "../../components/BuyCourseButton";
import { useState } from "react";
const CourseDetail = () => {
  const parms = useParams();
  const courseId = parms.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading)
    return (
      <h1 className="text-center text-2xl font-semibold mt-10">Loading...</h1>
    );
  if (isError)
    return (
      <h1 className="text-center text-2xl font-semibold mt-10 text-red-500">
        Error .... Failed to load course details
      </h1>
    );

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="text-white bg-gradient-to-r from-gray-900 to-gray-700 py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            {course?.courseTitle}
          </h1>
          <p className="text-lg text-center italic">Course Sub-title</p>
          <p className="text-center">
            Created by{" "}
            <span className="text-blue-300 underline italic">
              {course?.creator.name}
            </span>
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <p className="text-center">
            Students enrolled: {course?.enrolledStudents.length}
          </p>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-12">
        {/* Left Section: Course Description & Content */}
        <div className="w-full lg:w-2/3 space-y-6">
          <h1 className="text-2xl font-bold">Description</h1>
          <p
            className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />

          {/* Course Content Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Course Content
              </CardTitle>
              <CardDescription className="text-gray-500">
                Includes {course.lectures.length} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((lecture, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="text-blue-500">
                    {true ? <PlayCircle size={16} /> : <Lock size={16} />}
                  </span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Video & Purchase */}
        <div className="w-full lg:w-1/3">
          <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <CardContent className="p-5 flex flex-col gap-4">
              {/* Course Video */}
              <div className="w-full aspect-video rounded-md overflow-hidden shadow-md">
              <ReactPlayer
                width="100%"
                height="100%"
                url={course?.lectures?.[0]?.videoUrl || ""}
                controls={true}
              />

              </div>

              {/* Lecture Title */}
              <h1 className="text-lg font-semibold">Lecture title</h1>
              <Separator className="my-2" />

              {/* Course Price */}
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Course Price
              </h1>

              {/* Purchase Button */}
              <CardFooter className="flex justify-center p-4">
                {purchased ? (
                  <Button
                    onClick={handleContinueCourse}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all"
                  >
                    Continue Course
                  </Button>
                ) : (
                  <BuyCourseButton courseId={courseId} />
                )}
              </CardFooter>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
