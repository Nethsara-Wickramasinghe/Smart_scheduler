const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  time: { type: String, required: true },
  day: { type: String, required: true },
  activity: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Timetable', timetableSchema);
