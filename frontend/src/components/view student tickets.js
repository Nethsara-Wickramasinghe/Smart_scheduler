import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Button, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Delete } from '@mui/icons-material';

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

const ViewStudentTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
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
  }, []);

  const handleDeleteTicket = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`);
      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
    } catch (err) {
      setError('Error deleting ticket');
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom>Student Tickets</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
            {tickets.map(ticket => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.name}</TableCell>
                <TableCell>{ticket.universityId}</TableCell>
                <TableCell>{ticket.email}</TableCell>
                <TableCell>{ticket.department}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDeleteTicket(ticket._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <StyledButton onClick={() => navigate('/admin-profile')} sx={{ mt: 3 }}>Return to Admin Profile</StyledButton>
    </StyledPaper>
  );
};

export default ViewStudentTickets;
