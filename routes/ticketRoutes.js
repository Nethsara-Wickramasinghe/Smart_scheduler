const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'), false);
  }
});

// ** Create Ticket **
router.post('/', upload.single('attachment'), async (req, res) => {
  const { name, universityId, email, contactNumber, department, message } = req.body;
  const attachment = req.file ? req.file.filename : null;
  try {
    const ticket = new Ticket({ name, universityId, email, contactNumber, department, message, attachment });
    await ticket.save();
    res.status(201).json({ message: 'Ticket submitted successfully', ticket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(400).json({ message: error.message });
  }
});

// ** Get All Tickets **
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});

// ** Get Single Ticket by ID **
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Failed to fetch ticket' });
  }
});

// ** Update Ticket **
router.put('/:id', upload.single('attachment'), async (req, res) => {
  const { name, universityId, email, contactNumber, department, message } = req.body;
  const updateData = { name, universityId, email, contactNumber, department, message };

  // Update attachment if a new file is uploaded
  if (req.file) {
    updateData.attachment = req.file.filename;
  }

  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ message: 'Failed to update ticket' });
  }
});

// ** Delete Ticket **
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Remove the attachment if it exists
    if (ticket.attachment) {
      const filePath = path.join(__dirname, '../uploads', ticket.attachment);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ message: 'Failed to delete ticket' });
  }
});

module.exports = router;
