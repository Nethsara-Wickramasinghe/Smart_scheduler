import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(1, 4),
  textTransform: 'none',
  fontWeight: 'bold',
  backgroundColor: '#1976d2',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
}));

const CreateTimetable = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ day: '', time: '', activity: '' });
  const [timetable, setTimetable] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Options
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
  ];

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/timetable', {
          params: { userId },
        });
        setTimetable(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch timetable');
      }
    };

    if (userId) {
      fetchTimetable();
    } else {
      setError('Please log in to create a timetable');
    }
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { day, time, activity } = formData;

    if (day && time && activity && userId) {
      try {
        const response = await axios.post('http://localhost:5000/api/timetable', {
          userId,
          day,
          time,
          activity,
        });

        // Update local state with new entry
        setTimetable([...timetable, response.data]);

        setSuccess(true);
        setFormData({ day: '', time: '', activity: '' });
        setError('');

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/student-profile');
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to add timetable entry');
        setSuccess(false);
      }
    } else {
      setError('All fields are required, and you must be logged in');
    }
  };

  return (
    <div>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: '#1976d2', fontWeight: 'bold', textAlign: 'center', mb: 4 }}
      >
        Create Timetable
      </Typography>

      <StyledPaper elevation={3}>
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
            Timetable entry added successfully! Redirecting to your profile...
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto' }}>
          <Grid container spacing={3}>
            {/* Day Selection */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Day</InputLabel>
                <Select name="day" value={formData.day} onChange={handleChange} label="Day">
                  <MenuItem value="">Select Day</MenuItem>
                  {days.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Time Selection */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Time</InputLabel>
                <Select name="time" value={formData.time} onChange={handleChange} label="Time">
                  <MenuItem value="">Select Time</MenuItem>
                  {timeSlots.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Activity Input */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Activity"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 50 }}
                helperText={`${formData.activity.length}/50`}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <StyledButton
              type="submit"
              variant="contained"
              disabled={!formData.day || !formData.time || !formData.activity}
            >
              Add to Timetable
            </StyledButton>
          </Box>
        </Box>
      </StyledPaper>
    </div>
  );
};

export default CreateTimetable;
