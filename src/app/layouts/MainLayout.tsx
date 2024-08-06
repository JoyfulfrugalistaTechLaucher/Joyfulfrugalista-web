import React from 'react';
import ThemeRegistry from '../themeRegistry';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeRegistry>
      <div className="layout-container">
        <header className="header">
          <nav className="nav-bar">
            <div className="logo">Joyful Savings Jar</div>
            <ul className="nav-links">
              <li>About</li>
              <li>Ledger</li>
              <li>Statistic</li>
              <li>Community</li>
            </ul>
          </nav>
        </header>
        <main className="content">{children}</main>
        <footer className="footer">
          <p>&copy; 2024 Joyful Savings Jar. All rights reserved.</p>
        </footer>
      </div>
    </ThemeRegistry>
  );
};

export default MainLayout;
