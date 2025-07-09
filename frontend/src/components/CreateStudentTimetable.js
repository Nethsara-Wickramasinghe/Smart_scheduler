import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateTimetable = () => {
  const [formData, setFormData] = useState({
    time: '',
    day: '',
    teacher: '',
    subject: '',
    venue: '',
    grade: '',
    batch: '',
    course: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    time: '',
    day: '',
    teacher: '',
    subject: '',
    venue: '',
    grade: '',
    batch: '',
    course: '',
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    // Real-time validation
    switch (name) {
      case 'time':
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] ?[AP]M\s*-\s*(0?[1-9]|1[0-2]):[0-5][0-9] ?[AP]M$/i;
  setValidationErrors((prev) => ({
    ...prev,
    time: timeRegex.test(value) ? '' : 'Time must be in 12-hour range format (HH:MM AM/PM - HH:MM AM/PM, e.g., 10:00 AM - 11:00 AM)',
  }));
  break;
      case 'day':
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        setValidationErrors((prev) => ({
          ...prev,
          day: days.includes(value.toLowerCase()) ? '' : 'Please enter a valid day (e.g., Monday)',
        }));
        break;
      case 'teacher':
        const teacherRegex = /^[A-Za-z\s]{2,}$/;
        setValidationErrors((prev) => ({
          ...prev,
          teacher: teacherRegex.test(value) ? '' : 'Teacher name must be at least 2 characters and contain only letters and spaces',
        }));
        break;
      case 'subject':
        const subjectRegex = /^[A-Za-z0-9\s]{2,}$/;
        setValidationErrors((prev) => ({
          ...prev,
          subject: subjectRegex.test(value) ? '' : 'Subject must be at least 2 characters and contain letters, numbers, and spaces',
        }));
        break;
      case 'venue':
        const venueRegex = /^[A-Za-z0-9\s]{2,}$/;
        setValidationErrors((prev) => ({
          ...prev,
          venue: venueRegex.test(value) ? '' : 'Venue must be at least 2 characters and contain letters, numbers, and spaces',
        }));
        break;
        case 'grade':
  const gradeRegex = /^year\s[1-4]\ssemester\s[1-2]$/;
  setValidationErrors((prev) => ({
    ...prev,
    grade: gradeRegex.test(value) ? '' : 'Grade must be in format "year Y semester S" (e.g., year 1 semester 1, year 4 semester 2)',
  }));
  break;
          break;
        case 'batch':
          const batchRegex = /^batch\s+[0-9]+(\.[0-9]+)?$/;
          setValidationErrors((prev) => ({
            ...prev,
            batch: batchRegex.test(value) ? '' : 'Batch must be in the format "batch" followed by a space and a number (e.g., batch 1, batch 2, batch 1.1)',
          }));
          break;
      case 'course':
        const courseRegex = /^[A-Za-z0-9\s]{2,}$/;
        setValidationErrors((prev) => ({
          ...prev,
          course: courseRegex.test(value) ? '' : 'Course must be at least 2 characters and contain letters, numbers, and spaces',
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all validations before submission
    const allValid = Object.values(validationErrors).every((error) => error === '');
    if (!allValid) {
      console.error('Validation errors present:', validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/student-timetable/', {
        userId, // Pass userId to the backend
        ...formData,
      });

      console.log('Timetable created:', response.data);
      navigate('/admin-profile'); // Redirect to Admin Profile page after successful creation
    } catch (error) {
      console.error('Error creating timetable:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Create Timetable
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            error={!!validationErrors.time}
            helperText={validationErrors.time}
          />
          <TextField
            label="Day"
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
            error={!!validationErrors.day}
            helperText={validationErrors.day}
          />
          <TextField
            label="Teacher"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            required
            error={!!validationErrors.teacher}
            helperText={validationErrors.teacher}
          />
          <TextField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            error={!!validationErrors.subject}
            helperText={validationErrors.subject}
          />
          <TextField
            label="Venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
            error={!!validationErrors.venue}
            helperText={validationErrors.venue}
          />
          <TextField
            label="Grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
            error={!!validationErrors.grade}
            helperText={validationErrors.grade}
          />
          <TextField
            label="Batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            required
            error={!!validationErrors.batch}
            helperText={validationErrors.batch}
          />
          <TextField
            label="Course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            error={!!validationErrors.course}
            helperText={validationErrors.course}
          />
          <Button type="submit" variant="contained" color="primary">
            Create Timetable
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default CreateTimetable;