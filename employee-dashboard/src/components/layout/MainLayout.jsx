import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";
import Header from "../header/HEADER.JSX";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50 ">
        <div className="mx-auto p-4  ">
          {/* <Navigation /> */}
          <Header/>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 mx-auto w-full p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
