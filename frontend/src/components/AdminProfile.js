import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Button, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Delete } from '@mui/icons-material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  background: 'linear-gradient(145deg, #f0f4f8 0%, #ffffff 100%)',
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 20% 20%, rgba(0, 123, 255, 0.1), transparent 60%)',
    opacity: 0.6,
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 'bold',
  color: '#ffffff',
  transition: 'transform 0.3s ease, opacity 0.3s ease',
  '&:hover': {
    opacity: 0.9,
    transform: 'scale(1.05)',
  },
}));

const ActionButton = styled(StyledButton)({
  backgroundColor: '#007bff', // Blue
  '&:hover': {
    backgroundColor: '#0056b3',
  },
});

const LogoutButton = styled(StyledButton)({
  backgroundColor: '#ff5722', // Red-Orange
  '&:hover': {
    backgroundColor: '#e64a19',
  },
});

const AdminProfile = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/');
        setUsers(response.data);
        setFilteredUsers(response.data); // Set the filtered users initially to all users
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setFilteredUsers(users); // Reset filtered users to all if the search is empty
    } else {
      setFilteredUsers(
        users.filter((user) =>
          user.email.toLowerCase().includes(query) || user.role.toLowerCase().includes(query)
        )
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId)); // Update filtered users after deletion
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data
    navigate('/Login'); // Navigate to login page
  };

  return (
    <Fade in timeout={800}>
      <Box>
        <HeaderContainer>
          <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#007bff', mr: 2 }} />
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: '#1976d2',
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            Admin Dashboard
          </Typography>
        </HeaderContainer>

        {success && <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}

        <StyledPaper elevation={3}>
          <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 'bold' }}>
            User Management
          </Typography>

          {/* Search Bar */}
          <TextField
            label="Search User"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
            InputProps={{ style: { backgroundColor: '#fff' } }}
          />

          <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#007bff', '& th': { color: '#fff', fontWeight: 'bold' } }}>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteUser(user._id)} sx={{ '&:hover': { transform: 'scale(1.1)' } }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: '0 auto' }}>
          <ActionButton onClick={() => navigate('/make-timetable')}>
            Create Student Timetable
          </ActionButton>
          <ActionButton onClick={() => navigate('/view-stdtimetable')}>
            View Student Timetable
          </ActionButton>
          <ActionButton onClick={() => navigate('/view-student-tickets')}>
            View Student Tickets
          </ActionButton>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </Box>
      </Box>
    </Fade>
  );
};

export default AdminProfile;