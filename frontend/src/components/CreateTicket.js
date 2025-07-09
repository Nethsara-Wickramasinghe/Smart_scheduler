import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
  marginBottom: theme.spacing(4),
}));

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    name: '',
    universityId: '',
    email: '',
    contactNumber: '',
    department: '',
    message: '',
    attachment: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    universityId: '',
    email: '',
    contactNumber: '',
    department: '',
    message: '',
    attachment: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Real-time validation
    switch (name) {
      case 'name':
        const nameRegex = /^[A-Za-z\s]{2,}$/;
        setValidationErrors((prev) => ({
          ...prev,
          name: nameRegex.test(value) ? '' : 'Name must be at least 2 characters and contain only letters and spaces',
        }));
        break;
      case 'universityId':
        const universityIdRegex = /^\d{9}$/;
        setValidationErrors((prev) => ({
          ...prev,
          universityId: universityIdRegex.test(value) ? '' : 'University ID must be a 9-digit number',
        }));
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setValidationErrors((prev) => ({
          ...prev,
          email: emailRegex.test(value) ? '' : 'Please enter a valid email address',
        }));
        break;
      case 'contactNumber':
        const contactRegex = /^\d{10}$/;
        setValidationErrors((prev) => ({
          ...prev,
          contactNumber: contactRegex.test(value) ? '' : 'Contact number must be a 10-digit number',
        }));
        break;
      case 'department':
        const deptRegex = /^[A-Za-z\s]{2,}$/;
        setValidationErrors((prev) => ({
          ...prev,
          department: deptRegex.test(value) ? '' : 'Department must be at least 2 characters and contain only letters and spaces',
        }));
        break;
      case 'message':
        setValidationErrors((prev) => ({
          ...prev,
          message: value.length >= 10 ? '' : 'Message must be at least 10 characters',
        }));
        break;
      default:
        break;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, attachment: file }));

    const isPdf = file && file.type === 'application/pdf';
    setValidationErrors((prev) => ({
      ...prev,
      attachment: isPdf ? '' : 'Please upload a PDF file only',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all validations before submission
    const allValid = Object.values(validationErrors).every((error) => error === '');
    if (!allValid) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    try {
      const ticketData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) ticketData.append(key, formData[key]);
      });

      const response = await axios.post('http://localhost:5000/api/tickets', ticketData);
      setSuccess('Ticket submitted successfully');
      setError('');
      setFormData({
        name: '',
        universityId: '',
        email: '',
        contactNumber: '',
        department: '',
        message: '',
        attachment: null,
      });

      // Reset file input
      document.getElementById('attachment').value = '';

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting ticket');
      setSuccess('');
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        Create Ticket
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            error={!!validationErrors.name}
            helperText={validationErrors.name}
          />
          <TextField
            label="University ID"
            name="universityId"
            value={formData.universityId}
            onChange={handleChange}
            required
            error={!!validationErrors.universityId}
            helperText={validationErrors.universityId}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            error={!!validationErrors.contactNumber}
            helperText={validationErrors.contactNumber}
          />
          <TextField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            error={!!validationErrors.department}
            helperText={validationErrors.department}
          />
          <TextField
            label="Message"
            name="message"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            error={!!validationErrors.message}
            helperText={validationErrors.message}
          />
          <input
            type="file"
            id="attachment"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ marginBottom: '15px' }}
          />
          {validationErrors.attachment && (
            <Typography color="error" variant="caption">
              {validationErrors.attachment}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary">
            Submit Ticket
          </Button>
        </Box>
      </form>
    </StyledPaper>
  );
};

export default CreateTicket;