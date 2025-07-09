const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const User = require('../models/User');

// Create timetable entry
router.post('/', async (req, res) => {
  const { userId } = req.body; // From frontend login
  const { time, day, activity } = req.body; // Updated to exclude 'venue'

  try {
    // Check if the user exists and retrieve the user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new timetable entry
    const timetableEntry = new Timetable({ time, day, activity, userId });
    await timetableEntry.save();
    res.status(201).json(timetableEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get timetable entries
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch timetable entries for the given userId
    const timetable = await Timetable.find({ userId });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
