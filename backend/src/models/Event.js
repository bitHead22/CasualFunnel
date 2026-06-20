const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    session_id: { type: String, required: true, index: true },
    event_type: {
      type: String,
      required: true,
      enum: ['page_view', 'click'],
    },
    page_url: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true },
    // click-only fields
    x: { type: Number, default: null },
    y: { type: Number, default: null },
    viewport_width: { type: Number, default: null },
    viewport_height: { type: Number, default: null },
    target_tag: { type: String, default: null },
    target_id: { type: String, default: null },
    target_class: { type: String, default: null },
    target_text: { type: String, default: null },
  },
  { timestamps: false }
);

// compound index for heatmap queries
eventSchema.index({ page_url: 1, event_type: 1 });

module.exports = mongoose.model('Event', eventSchema);
