function Sidebar({ currentUser, handleLogout, activePage, setActivePage }) {
  const navLink = (page, label) => (
    <a
      href="#"
      className={activePage === page ? 'active' : ''}
      onClick={(e) => { e.preventDefault(); setActivePage(page); }}
    >
      {label}
    </a>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Budget Buddy</h2>
        <p>Personal Finance</p>
      </div>
      <nav>
        {navLink('dashboard', 'Dashboard')}
        {navLink('reports', 'Reports')}
        <a href="#">Budget</a>
        {navLink('settings', 'Settings')}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-username">{currentUser?.username}</span>
          <button className="btn-logout" onClick={handleLogout}>Log out</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
