import { useState, useEffect } from 'react';
import { api } from '../lib/api';

import { formatTime, timeAgo } from '../lib/utils';

export default function SessionsTable({ onSelectSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSessions();
      setSessions(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalEvents = sessions.reduce((s, r) => s + r.event_count, 0);
  const uniquePages = new Set(sessions.flatMap(s => s.pages || [])).size;

  const handleRowClick = (session) => {
    setSelected(session.session_id);
    onSelectSession(session.session_id);
  };

  return (
    <>
      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value accent">{loading ? '—' : sessions.length}</div>
          <div className="stat-sub">unique visitors</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Events</div>
          <div className="stat-value cyan">{loading ? '—' : totalEvents.toLocaleString()}</div>
          <div className="stat-sub">tracked interactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Unique Pages</div>
          <div className="stat-value green">{loading ? '—' : uniquePages}</div>
          <div className="stat-sub">URLs visited</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Events / Session</div>
          <div className="stat-value yellow">
            {loading || !sessions.length ? '—' : (totalEvents / sessions.length).toFixed(1)}
          </div>
          <div className="stat-sub">per session</div>
        </div>
      </div>

      {/* Error */}
      {error && <div className="error-banner">Error: {error}</div>}

      {/* Table Card */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Sessions</span>
          <button className="btn-icon" onClick={load} title="Refresh">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.63-6.37L2 11"/></svg>
            Refresh
          </button>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : sessions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-title">No sessions yet</div>
              <div>Open the demo page and interact to generate data.</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Events</th>
                  <th>Pages</th>
                  <th>First Seen</th>
                  <th>Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr
                    key={s.session_id}
                    id={`row-${s.session_id}`}
                    onClick={() => handleRowClick(s)}
                    style={selected === s.session_id ? { background: 'rgba(124,58,237,0.08)' } : {}}
                  >
                    <td>
                      <span className="session-id" title={s.session_id}>
                        {s.session_id}
                      </span>
                    </td>
                    <td>
                      <span className="event-count-pill">
                        <span>{s.event_count}</span> events
                      </span>
                    </td>
                    <td>
                      <div className="pages-list">
                        {(s.pages || []).slice(0, 2).map((p) => (
                          <span className="page-chip" key={p} title={p}>
                            {p.replace(/https?:\/\//, '').replace(/\/$/, '')}
                          </span>
                        ))}
                        {s.pages?.length > 2 && (
                          <span className="page-chip">+{s.pages.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="time-text">{formatTime(s.first_seen)}</span>
                    </td>
                    <td>
                      <span className="time-text">{timeAgo(s.last_seen)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
