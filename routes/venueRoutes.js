const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');

router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;