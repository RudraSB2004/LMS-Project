import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden h-screen w-[250px] border-r border-gray-300 p-5 sticky top-0 space-y-8 dark:border-gray-700 sm:w-[300px] lg:block">
        <div className="space-y-4">
          {/* Dashboard Link */}
          <Link to="dashboard" className="flex items-center gap-2">
            <ChartNoAxesColumn size={22} />
            <hw>Dashboard</hw>
          </Link>

          {/* Courses Link */}
          <Link to="course" className="flex items-center gap-2">
            <SquareLibrary size={22} />
            <h2>Courses</h2>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
