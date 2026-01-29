require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// TODO: app.use('/api/events', require('./routes/events'));
// TODO: app.use('/api/channels', require('./routes/channels'));

app.get('/', (req, res) => {
  res.json({ message: 'CalSync API is running' });
});

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});
