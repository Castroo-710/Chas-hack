require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database
initDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRouter = require('./routes/auth');

// Auth Routes
app.use('/api/auth', authRouter);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'CalSync API is running' });
});

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});