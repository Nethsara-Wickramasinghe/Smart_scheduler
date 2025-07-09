const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/student-timetable', require('./routes/studentTimetableRoutes'));
app.use('/api/venues', require('./routes/venueRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); // Assuming from previous context
app.use('/api/batches', require('./routes/batchRoutes')); // Assuming from previous context

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));