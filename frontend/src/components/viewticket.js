import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Button, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
  marginBottom: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(1, 4),
  textTransform: 'none',
  fontWeight: 'bold',
  backgroundColor: '#007bff',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
}));

const ViewMyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tickets/`);
        setTickets(response.data);
      } catch (err) {
        setError('Error fetching tickets');
      }
    };

    fetchTickets();
  }, [userId]);

  const handleDeleteTicket = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`);
      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
    } catch (err) {
      setError('Error deleting ticket');
    }
  };

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const handleUpdateTicket = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tickets/${selectedTicket._id}`, selectedTicket);
      setTickets(tickets.map(t => t._id === selectedTicket._id ? selectedTicket : t));
      setOpenDialog(false);
    } catch (err) {
      setError('Error updating ticket');
    }
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    setSelectedTicket({ ...selectedTicket, [name]: value });
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.universityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom>My Tickets</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Search Tickets"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>University ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map(ticket => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.name}</TableCell>
                <TableCell>{ticket.universityId}</TableCell>
                <TableCell>{ticket.email}</TableCell>
                <TableCell>{ticket.department}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditTicket(ticket)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteTicket(ticket._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <StyledButton onClick={() => navigate('/student-profile')} sx={{ mt: 3 }}>Return to Profile</StyledButton>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Ticket</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" value={selectedTicket?.name || ''} fullWidth margin="normal" onChange={handleDialogChange} />
          <TextField label="Department" name="department" value={selectedTicket?.department || ''} fullWidth margin="normal" onChange={handleDialogChange} />
          <TextField label="Message" name="message" value={selectedTicket?.message || ''} fullWidth margin="normal" multiline onChange={handleDialogChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleUpdateTicket}>Update</Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
};

export default ViewMyTickets;
