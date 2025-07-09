import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Fade,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import LockIcon from '@mui/icons-material/Lock';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  background: 'linear-gradient(145deg, #e6f0fa 0%, #ffffff 100%)',
  maxWidth: 400,
  margin: 'auto',
  marginTop: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 10% 20%, rgba(33, 150, 243, 0.1), transparent 50%)',
    opacity: 0.5,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 'bold',
  backgroundColor: '#1976d2',
  color: '#ffffff',
  transition: 'transform 0.3s ease, opacity 0.3s ease',
  '&:hover': {
    backgroundColor: '#1565c0',
    transform: 'scale(1.05)',
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: '#2196f3',
  fontWeight: 'bold',
  textDecoration: 'none',
  transition: 'color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    color: '#1565c0',
    transform: 'scale(1.05)',
    textDecoration: 'underline',
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const { userId, role } = response.data;
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);

      setSuccess(true);
      setError('');
      setFormData({ email: '', password: '' });

      // Redirect based on role after 2 seconds
      setTimeout(() => {
        if (role === 'student') {
          window.location.href = '/student-profile'; // Redirect to student profile page
        } else if (role === 'admin') {
          window.location.href = '/admin-profile'; // Redirect to admin profile
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setSuccess(false);
    }
  };

  return (
    <Fade in timeout={800}>
      <div>
        <HeaderContainer>
          <LockIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: '#1976d2',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4,
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            Login
          </Typography>
        </HeaderContainer>

        <StyledPaper elevation={3}>
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
              Login successful! Redirecting...
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px', backgroundColor: '#fff' } }}
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px', backgroundColor: '#fff' } }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <StyledButton type="submit" variant="contained">
                Login
              </StyledButton>
            </Box>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#555' }}>
                Don’t have an account?{' '}
                <StyledLink
                  component="button"
                  onClick={() => navigate('/')}
                >
                  Create New Account
                </StyledLink>
              </Typography>
            </Box>
          </Box>
        </StyledPaper>
      </div>
    </Fade>
  );
};

export default Login;