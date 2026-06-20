require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/causalfunnel';

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes 
app.use('/api', eventRoutes);
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Start server 
function startServer() {
  const server = app.listen(PORT);

  server.on('listening', () => {
    console.log(`🚀  CausalFunnel API running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `\n❌  Port ${PORT} is already in use!\n` +
        `    Run this to fix it:  npx kill-port ${PORT}\n` +
        `    Then restart:        npm run dev\n`
      );
    } else {
      console.error('❌  Server error:', err.message);
    }
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑  Shutting down…');
    server.close(() => {
      mongoose.connection.close();
      process.exit(0);
    });
  });
}

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    startServer();
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });
