import Navbar from "../components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen min-w-screen">
      <Navbar />
      <main className="mt-16 container mx-auto px-4 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
