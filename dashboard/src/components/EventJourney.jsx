import { useState, useEffect } from 'react';
import { api } from '../lib/api';

import { formatTime } from '../lib/utils';

function EventIcon({ type }) {
  if (type === 'page_view') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
  );
}

export default function EventJourney({ sessionId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    api
      .getSession(sessionId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const clickCount = data?.events?.filter((e) => e.event_type === 'click').length || 0;
  const pageViewCount = data?.events?.filter((e) => e.event_type === 'page_view').length || 0;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="panel" role="dialog" aria-modal="true" aria-label="Session Journey">
        <div className="panel-header">
          <div>
            <h2>User Journey</h2>
            <div className="panel-sid">{sessionId}</div>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close panel">✕</button>
        </div>

        <div className="panel-body">
          {loading && (
            <div className="spinner-wrap"><div className="spinner" /></div>
          )}

          {error && <div className="error-banner">Error: {error}</div>}

          {!loading && data && (
            <>
              {/* Summary */}
              <div className="journey-meta">
                <div className="journey-stat">
                  Total Events: <strong>{data.events.length}</strong>
                </div>
                <div className="journey-stat">
                  Page Views: <strong>{pageViewCount}</strong>
                </div>
                <div className="journey-stat">
                  Clicks: <strong>{clickCount}</strong>
                </div>
              </div>

              {/* Timeline */}
              <div className="timeline">
                {data.events.map((evt, i) => (
                  <div
                    key={evt._id || i}
                    className={`timeline-item ${evt.event_type === 'click' ? 'click' : ''}`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className="event-card">
                      <div className="event-card-top">
                        <EventIcon type={evt.event_type} />
                        <span
                          className={`event-type-badge ${evt.event_type === 'page_view' ? 'badge-pageview' : 'badge-click'
                            }`}
                        >
                          {evt.event_type === 'page_view' ? 'Page View' : 'Click'}
                        </span>
                        <span className="event-time">{formatTime(evt.timestamp)}</span>
                      </div>
                      <div className="event-url" title={evt.page_url}>
                        {evt.page_url}
                      </div>
                      {evt.event_type === 'click' && evt.x != null && (
                        <div className="event-coords">
                          x: {Math.round(evt.x)}, y: {Math.round(evt.y)}
                          {evt.viewport_width && (
                            <span style={{ marginLeft: 10, opacity: 0.6 }}>
                              viewport {evt.viewport_width}×{evt.viewport_height}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
