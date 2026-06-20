import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">CF</div>
        <span className="sidebar-logo-text">CausalFunnel</span>
      </div>

      <span className="sidebar-label">Analytics</span>

      <NavLink
        to="/"
        end
        id="nav-sessions"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        </span>
        Sessions
      </NavLink>

      <NavLink
        to="/heatmap"
        id="nav-heatmap"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </span>
        Heatmap
      </NavLink>

      <div className="sidebar-bottom">
        <div className="status-dot">
          <div className="dot" />
          Backend connected
        </div>
      </div>
    </aside>
  );
}
