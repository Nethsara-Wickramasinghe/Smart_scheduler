// routes/timetable.js
const express = require('express');
const router = express.Router();
const StudentTimetable = require('../models/StudentTimetable');
const User = require('../models/User');

// Create Student Timetable Entry
router.post('/', async (req, res) => {
  const { userId, time, day, teacher, subject, venue, grade, batch, course } = req.body;
  console.log('Received userId:', userId);  // Log the received userId to debug
  
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    // Create a new timetable entry
    const timetableEntry = new StudentTimetable({
      userId,
      time,
      day,
      teacher,
      subject,
      venue,
      grade,
      batch,
      course,
    });

    await timetableEntry.save();
    res.status(201).json(timetableEntry);
  } catch (error) {
    console.error('Error creating timetable entry:', error);
    res.status(500).json({ message: 'Failed to create timetable entry' });
  }
});

// Get Student Timetable Entries
router.get('/', async (req, res) => {
  const { userId, grade, batch, course } = req.query;
  try {
    // Validate the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    // Fetch the timetable based on filters
    const query = { userId };
    if (grade) query.grade = grade;
    if (batch) query.batch = batch;
    if (course) query.course = course;

    const timetable = await StudentTimetable.find(query);
    res.json(timetable);
  } catch (error) {
    console.error('Error fetching timetable entries:', error);
    res.status(500).json({ message: 'Failed to fetch timetable entries' });
  }
});

// Update Student Timetable Entry
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEntry = await StudentTimetable.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }
    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating timetable entry:', error);
    res.status(500).json({ message: 'Failed to update timetable entry' });
  }
});


// Delete Student Timetable Entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await StudentTimetable.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }
    res.json({ message: 'Timetable entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting timetable entry:', error);
    res.status(500).json({ message: 'Failed to delete timetable entry' });
  }
});

module.exports = router;
