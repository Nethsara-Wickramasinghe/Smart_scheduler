const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  universityId: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  department: { type: String, required: true },
  message: { type: String, required: true },
  attachment: { type: String }, // Store filename or path
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);