import React from 'react';

export default function TopElementsList({ clicks }) {
  if (!clicks || clicks.length === 0) return null;

  // Group by target
  const counts = {};
  clicks.forEach(c => {
    // Determine best label
    let label = c.target_text || c.target_id || c.target_class || c.target_tag || 'Unknown';
    if (label.length > 30) label = label.substring(0, 30) + '...';
    counts[label] = (counts[label] || 0) + 1;
  });

  const sorted = Object.entries(counts)
    .filter(([label]) => label !== 'Unknown')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sorted.length === 0) return null;

  return (
    <div className="top-elements-card">
      <h3 className="top-elements-title">Top Clicked Elements</h3>
      <ul className="top-elements-list">
        {sorted.map(([label, count], i) => (
          <li key={i} className="top-element-item">
            <span className="element-label" title={label}>{label}</span>
            <span className="element-count">{count} clicks</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
