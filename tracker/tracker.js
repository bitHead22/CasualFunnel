/**
 * CausalFunnel Tracker v1.0.0
 * Drop this script into any webpage to track page_view and click events.
 *
 * Configuration (set before loading script):
 *   window.TRACKER_API = 'http://your-backend-url';   // default: http://localhost:5000
 */
(function (window, document) {
  'use strict';

  var API_BASE = (window.TRACKER_API || 'http://localhost:5000').replace(/\/$/, '');

  // ── Session ID ─────────────────────────────────────────────────────────────
  function getSessionId() {
    var KEY = 'cf_session_id';
    var sid = localStorage.getItem(KEY);
    if (!sid) {
      sid =
        'sess_' +
        Math.random().toString(36).substring(2, 11) +
        '_' +
        Date.now().toString(36);
      localStorage.setItem(KEY, sid);
    }
    return sid;
  }

  // ── Send Event ─────────────────────────────────────────────────────────────
  function sendEvent(payload) {
    var body = JSON.stringify(payload);
    // Use fetch() — sendBeacon with application/json triggers CORS preflight
    // issues in many browsers and fails silently. fetch() gives proper errors.
    fetch(API_BASE + '/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      keepalive: true,
    }).catch(function (err) {
      console.warn('[CausalFunnel] Event send failed:', err);
    });
  }

  // ── Beacon fallback on page unload only ────────────────────────────────────
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden' && navigator.sendBeacon) {
      var blob = new Blob(
        [JSON.stringify({
          session_id: getSessionId(),
          event_type: 'page_view',
          page_url: window.location.href,
          timestamp: new Date().toISOString(),
        })],
        { type: 'application/json' }
      );
      navigator.sendBeacon(API_BASE + '/api/events', blob);
    }
  });

  // ── Page View ─────────────────────────────────────────────────────────────
  function trackPageView() {
    sendEvent({
      session_id: getSessionId(),
      event_type: 'page_view',
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
    });
  }

  // ── Click Logic & Variables ───────────────────────────────────────────────
  function trackClick(e) {
    var x = e.clientX;
    var y = e.clientY;

    // Target context extraction
    var target = e.target;
    var targetTag = target.tagName ? target.tagName.toLowerCase() : null;
    var targetId = target.id || null;
    var targetClass = target.className || null;
    if (typeof targetClass !== 'string') targetClass = null;
    var targetText = target.innerText || target.value || null;
    if (targetText && targetText.length > 50) {
      targetText = targetText.substring(0, 50) + '...';
    }

    sendEvent({
      session_id: getSessionId(),
      event_type: 'click',
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      x: x + window.scrollX,
      y: y + window.scrollY,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      target_tag: targetTag,
      target_id: targetId,
      target_class: targetClass,
      target_text: targetText,
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    trackPageView();
    document.addEventListener('click', trackClick, true);
    console.log(
      '[CausalFunnel] Tracker active | session:',
      getSessionId(),
      '| api:',
      API_BASE
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.CausalFunnel = {
    getSessionId: getSessionId,
    track: sendEvent,
  };
})(window, document);
