import { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/api';
import HeatmapCanvas from '../components/HeatmapCanvas';
import TopElementsList from '../components/TopElementsList';

export default function Heatmap() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all'); // all, desktop, tablet, mobile
  const [clicks, setClicks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load available page URLs on mount
  useEffect(() => {
    setPagesLoading(true);
    api
      .getPages()
      .then((data) => {
        setPages(data);
        if (data.length > 0) setSelectedPage(data[0]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setPagesLoading(false));
  }, []);

  const loadHeatmap = async () => {
    if (!selectedPage) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHeatmap(selectedPage);
      setClicks(data.clicks);
    } catch (e) {
      setError(e.message);
      setClicks([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load when page changes
  useEffect(() => {
    if (selectedPage) loadHeatmap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  // Filter clicks by viewport width
  const filteredClicks = useMemo(() => {
    if (!clicks) return null;
    return clicks.filter((c) => {
      const w = c.viewport_width || 1280;
      if (deviceFilter === 'desktop') return w > 1024;
      if (deviceFilter === 'tablet') return w > 768 && w <= 1024;
      if (deviceFilter === 'mobile') return w <= 768;
      return true; // 'all'
    });
  }, [clicks, deviceFilter]);

  const uniquePositions = filteredClicks
    ? new Set(filteredClicks.map((c) => `${Math.round(c.x)},${Math.round(c.y)}`)).size
    : 0;

  const rageClicks = filteredClicks ? filteredClicks.filter(c => c.is_rage_click).length : 0;
  const deadClicks = filteredClicks ? filteredClicks.filter(c => c.is_dead_click).length : 0;

  return (
    <>
      <div className="page-header">
        <h1>Click Heatmap</h1>
        <p>Visualise where users click on any tracked page.</p>
      </div>

      {error && <div className="error-banner">Error: {error}</div>}

      {/* Controls */}
      <div className="heatmap-controls">
        <div className="select-wrap" style={{ flex: 2 }}>
          <select
            id="page-url-select"
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            disabled={pagesLoading}
          >
            {pagesLoading && <option>Loading pages…</option>}
            {!pagesLoading && pages.length === 0 && (
              <option value="">No tracked pages yet</option>
            )}
            {pages.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="select-wrap" style={{ flex: 1 }}>
          <select value={deviceFilter} onChange={(e) => setDeviceFilter(e.target.value)}>
            <option value="all">All Devices</option>
            <option value="desktop">Desktop (&gt;1024px)</option>
            <option value="tablet">Tablet (768px - 1024px)</option>
            <option value="mobile">Mobile (&lt;=768px)</option>
          </select>
        </div>

        <button
          className="btn-load"
          id="btn-load-heatmap"
          onClick={loadHeatmap}
          disabled={!selectedPage || loading}
        >
          {loading ? 'Loading…' : 'Load Heatmap'}
        </button>
      </div>

      {/* Heatmap Area */}
      <div className="heatmap-layout" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="heatmap-card">
          {/* Stats bar */}
          {filteredClicks !== null && !loading && (
            <div className="heatmap-stats-bar">
              <div className="hm-stat">Total Clicks <strong>{filteredClicks.length}</strong></div>
              <div className="hm-stat">Unique Pos <strong>{uniquePositions}</strong></div>
              {rageClicks > 0 && <div className="hm-stat" style={{color: '#ff4444'}}>Rage Clicks <strong>{rageClicks}</strong></div>}
              {deadClicks > 0 && <div className="hm-stat" style={{color: '#aa44ff'}}>Dead Clicks <strong>{deadClicks}</strong></div>}
            </div>
          )}

          <div className="heatmap-canvas-wrap">
            {loading ? (
              <div className="spinner-wrap" style={{ padding: '80px' }}>
                <div className="spinner" />
              </div>
            ) : filteredClicks === null ? (
              <div className="empty-state">
                <div className="empty-title">Select a page to view its heatmap</div>
                <div>Click data will appear here once the tracker is active.</div>
              </div>
            ) : (
              <div className="overlay-container">
                <div className="heatmap-scroll-wrapper">
                  {/* Iframe of the target page */}
                  <iframe src={selectedPage} className="heatmap-iframe" title="Target Page" />
                  {/* Canvas perfectly overlaid */}
                  <HeatmapCanvas clicks={filteredClicks} height={2500} />
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          {filteredClicks !== null && !loading && (
            <div className="heatmap-legend">
              <span>Low density</span>
              <div className="legend-gradient" />
              <span>High density</span>
            </div>
          )}
        </div>

        {/* Sidebar for Top Elements */}
        {filteredClicks !== null && !loading && (
          <div className="heatmap-sidebar">
            <TopElementsList clicks={filteredClicks} />
          </div>
        )}
      </div>
    </>
  );
}
