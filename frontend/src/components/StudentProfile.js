import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Button, Alert, Avatar, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  background: 'linear-gradient(145deg, #e6f0fa 0%, #ffffff 100%)',
  maxWidth: 450,
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

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  backgroundColor: '#2196f3',
  border: '4px solid #ffffff',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
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

const UpdateButton = styled(StyledButton)({
  backgroundColor: '#28a745', // Green
  '&:hover': {
    backgroundColor: '#218838',
  },
});

const DeleteButton = styled(StyledButton)({
  backgroundColor: '#dc3545', // Red
  '&:hover': {
    backgroundColor: '#c82333',
  },
});

const TimetableButton = styled(StyledButton)({
  backgroundColor: '#007bff', // Blue
  '&:hover': {
    backgroundColor: '#0056b3',
  },
});

const ViewTimetableButton = styled(StyledButton)({
  backgroundColor: '#6f42c1', // Purple
  '&:hover': {
    backgroundColor: '#5a3696',
  },
});

const CreateTicketButton = styled(StyledButton)({
  backgroundColor: '#17a2b8', // Cyan
  '&:hover': {
    backgroundColor: '#138496',
  },
});

const ViewTicketsButton = styled(StyledButton)({
  backgroundColor: '#ffc107', // Yellow
  '&:hover': {
    backgroundColor: '#e0a800',
  },
});

const LogoutButton = styled(StyledButton)({
  backgroundColor: '#ff9800', // Orange
  '&:hover': {
    backgroundColor: '#f57c00',
  },
});

const StudentProfile = () => {
  const [profile, setProfile] = useState({ email: '', role: '' });
  const [error, setError] = useState('');
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

  const handleDeleteProfile = async () => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.delete(`http://localhost:5000/api/auth/${userId}`);
      localStorage.clear(); // Clear localStorage after deletion
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting profile');
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data
    navigate('/Login'); // Navigate to login page
  };

  return (
    <Fade in timeout={800}>
      <div>
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
          Student Profile
        </Typography>

        <StyledPaper elevation={3}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <AvatarContainer>
            <StyledAvatar>
              <SchoolIcon sx={{ fontSize: 50 }} />
            </StyledAvatar>
          </AvatarContainer>

          <Typography
            variant="h6"
            sx={{ textAlign: 'center', color: '#2196f3', fontWeight: 'bold', mb: 1 }}
          >
            Welcome, {profile.email.split('@')[0]}!
          </Typography>

          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#555', fontSize: '1.1rem' }}>
              <strong>Email:</strong> {profile.email}
            </Typography>
            <Typography variant="body1" sx={{ color: '#555', fontSize: '1.1rem' }}>
              <strong>Role:</strong> {profile.role}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <UpdateButton onClick={() => navigate('/student-profile/edit')}>
              Update Profile
            </UpdateButton>
            <DeleteButton onClick={handleDeleteProfile}>Delete Profile</DeleteButton>
            <TimetableButton onClick={() => navigate('/create-timetable')}>
              Create Own Timetable
            </TimetableButton>
            <ViewTimetableButton onClick={() => navigate('/view-timetable')}>
              View My Timetable
            </ViewTimetableButton>
            <CreateTicketButton onClick={() => navigate('/create-ticket')}>
              Create Ticket
            </CreateTicketButton>
            <ViewTicketsButton onClick={() => navigate('/view-tickets')}>
              View My Tickets
            </ViewTicketsButton>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </Box>
        </StyledPaper>
      </div>
    </Fade>
  );
};

export default StudentProfile;