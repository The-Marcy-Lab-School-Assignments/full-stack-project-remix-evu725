import { useState } from 'react';
import Sidebar from './Sidebar';
import ExpensePage from './ExpensePage';
import ReportPage from './ReportPage';
import SettingsPage from './SettingsPage';

function DashboardLayout({ currentUser, handleLogout, isDarkMode, toggleDarkMode }) {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="dashboard-layout">
      <Sidebar
        currentUser={currentUser}
        handleLogout={handleLogout}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <div className="dashboard-main">
        {activePage === 'dashboard' && <ExpensePage currentUser={currentUser} />}
        {activePage === 'reports' && <ReportPage />}
        {activePage === 'settings' && <SettingsPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
      </div>
    </div>
  );
}

export default DashboardLayout;
