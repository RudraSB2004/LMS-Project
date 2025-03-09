import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
        {/* Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-md"></div>

        {/* Course Thumbnail */}
        <div className="relative">
          <img
            src={course.courseThumbnail}
            alt="course"
            className="w-full h-40 object-cover rounded-t-xl"
          />
        </div>

        {/* Card Content */}
        <CardContent className="px-5 py-4 space-y-3 relative z-10">
          <h2 className="hover:underline font-bold text-xl truncate text-gray-900 dark:text-gray-100">
            {course.courseTitle}
          </h2>

          {/* Creator & Course Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 shadow-md">
                <AvatarImage
                  src={
                    course.creator?.photoUrl || "https://github.com/shadcn.png"
                  }
                  alt={course.creator?.name || "Creator"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                {course.creator?.name}
              </h3>
            </div>

            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 text-xs rounded-full shadow-md">
              {course.courseLevel}
            </Badge>
          </div>

          {/* Course Price */}
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-md shadow-md">
              ₹{course.coursePrice}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
