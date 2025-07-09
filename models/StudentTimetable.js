const mongoose = require('mongoose');

const studentTimetableSchema = new mongoose.Schema({
  time: { type: String, required: true },
  day: { type: String, required: true },
  teacher: { type: String, required: true },
  subject: { type: String, required: true },
  venue: { type: String, required: true },
  grade: { type: String, required: true },
  batch: { type: String, required: true },
  course: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('StudentTimetable', studentTimetableSchema);