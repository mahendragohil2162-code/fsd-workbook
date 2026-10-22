const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 5000;

// Enable CORS so the React frontend on port 5173 can call port 5000
app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb://127.0.0.1:27017/fsd_workbook_db')
  .then(() => console.log('MongoDB connected for Full Stack Integration.'))
  .catch((err) => console.error('MongoDB error:', err.message));

app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});