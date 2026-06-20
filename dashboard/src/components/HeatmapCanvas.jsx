import { useEffect, useRef } from 'react';

export default function HeatmapCanvas({ clicks, width = 1200, height = 800 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    if (!clicks || clicks.length === 0) return;

    const vpWidths = clicks.map(c => c.viewport_width).filter(Boolean);
    const refW = vpWidths.length
      ? vpWidths.sort((a, b) => a - b)[Math.floor(vpWidths.length / 2)]
      : width;

    const scaleX = width / refW;
    const scaleY = scaleX;

    ctx.globalCompositeOperation = 'lighter';

    clicks.forEach((c) => {
      const cx = c.x * scaleX;
      const cy = c.y * scaleY;
      const radius = 30;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    // ── Draw Markers ──────────────────────────────────────────────
    ctx.globalCompositeOperation = 'source-over';

    clicks.forEach((c) => {
      const cx = c.x * scaleX;
      const cy = c.y * scaleY;

      // Normal click center
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    });
  }, [clicks, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="heatmap-canvas-overlay"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
