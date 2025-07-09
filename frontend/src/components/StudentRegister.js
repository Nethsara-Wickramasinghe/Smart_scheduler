import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Box, Paper, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
  maxWidth: 400,
  margin: 'auto',
  marginTop: theme.spacing(4),
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

const StudentRegister = () => {
  const navigate = useNavigate(); // Use useNavigate for redirect
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student', // Default to student
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;

    try {
      // Send registration request to the server
      await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        role, // Use the selected role
      });

      setSuccess(true);
      setError('');
      setFormData({ email: '', password: '', role: 'student' });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/Login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        User Registration
      </Typography>

      {success && <Alert severity="success">Registration successful! Redirecting to login...</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          type="email"
          required
        />
        <TextField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          type="password"
          required
        />
        
        {/* Role Selection */}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <StyledButton type="submit" variant="contained">
            Register
          </StyledButton>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default StudentRegister;
