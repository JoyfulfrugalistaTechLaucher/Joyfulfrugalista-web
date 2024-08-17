import React from "react";
import ThemeRegistry from "../themeRegistry";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeRegistry>
      <div className="layout-container">
        <Navbar />
        <main className="flex content">{children}</main>
        <footer className="footer">
          &copy; 2024 Joyful Savings Jar. All rights reserved.
        </footer>
      </div>
    </ThemeRegistry>
  );
};

export default MainLayout;
