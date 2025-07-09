import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Button, TextField, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
  maxWidth: 400,
  margin: 'auto',
  mt: 4,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(1, 4),
  textTransform: 'none',
  fontWeight: 'bold',
  backgroundColor: '#1976d2',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
}));

const StudentProfileEdit = () => {
  const [profile, setProfile] = useState({ email: '', role: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not found. Please log in.');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/${userId}`);
        setProfile(response.data);
        setError('');
      } catch (error) {
        setError('Error fetching profile data');
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleUpdateProfile = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.put(`http://localhost:5000/api/auth/${userId}`, profile);
      setMessage(response.data.message || 'Profile updated successfully');
      setError('');
      navigate('/student-profile');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
      setMessage('');
    }
  };

  return (
    <StyledPaper elevation={3}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleInputChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Role"
          name="role"
          value={profile.role}
          onChange={handleInputChange}
          margin="normal"
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <StyledButton onClick={handleUpdateProfile}>Save Changes</StyledButton>
        <StyledButton color="error" onClick={() => navigate('/student-profile')}>Cancel</StyledButton>
      </Box>
    </StyledPaper>
  );
};

export default StudentProfileEdit;
