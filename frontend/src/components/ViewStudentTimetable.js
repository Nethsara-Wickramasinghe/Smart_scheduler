import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ViewStudentTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); // Assuming the userId is stored in localStorage

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student-timetable/', {
          params: { userId },
        });
        setTimetable(response.data);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
    };

    fetchTimetable();
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/student-timetable/${id}`);
      setTimetable(timetable.filter((entry) => entry._id !== id));
    } catch (error) {
      console.error('Error deleting timetable entry:', error);
    }
  };

  const handleUpdate = (entry) => {
    setSelectedEntry(entry);
    setOpenUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setOpenUpdateForm(false);
    setSelectedEntry(null);
  };

  // Generate the PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add a header
    doc.setFontSize(22);
    doc.setTextColor(33, 150, 243); // Material-UI primary blue
    doc.setFont('helvetica', 'bold');
    doc.text('Student Timetable Report', 105, 15, { align: 'center' });

    // Add a subtitle with date
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString();
    doc.text(`Generated on: ${today}`, 105, 25, { align: 'center' });

    // Add a placeholder for a logo (you can add an actual image if available)
    doc.setDrawColor(33, 150, 243);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 20, 20); // Placeholder for logo
    doc.setFontSize(10);
    doc.text('Logo', 15, 20);

    // Prepare table data
    const headers = [['Time', 'Day', 'Teacher', 'Subject', 'Venue', 'Grade', 'Batch', 'Course']];
    const body = timetable.map((entry) => [
      entry.time,
      entry.day,
      entry.teacher,
      entry.subject,
      entry.venue,
      entry.grade,
      entry.batch,
      entry.course,
    ]);

    // Use jsPDF-autotable for a styled table
    doc.autoTable({
      startY: 35,
      head: headers,
      body: body,
      theme: 'striped',
      headStyles: {
        fillColor: [33, 150, 243], // Material-UI primary blue
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 10,
        textColor: 50,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternating rows
      },
      margin: { left: 10, right: 10 },
      styles: {
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: [150, 150, 150],
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Time
        1: { cellWidth: 20 }, // Day
        2: { cellWidth: 25 }, // Teacher
        3: { cellWidth: 25 }, // Subject
        4: { cellWidth: 25 }, // Venue
        5: { cellWidth: 15 }, // Grade
        6: { cellWidth: 15 }, // Batch
        7: { cellWidth: 20 }, // Course
      },
    });

    // Add a footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: 'right' });
      doc.text('SmartScheduler - Timetable Management', 10, 285);
    }

    // Add a decorative line at the bottom
    doc.setDrawColor(33, 150, 243);
    doc.setLineWidth(0.5);
    doc.line(10, 280, 200, 280);

    // Save the PDF
    doc.save('Student_Timetable_Report.pdf');
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        View Timetable
      </Typography>

      {/* Button to generate PDF report */}
      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        style={{ marginBottom: '20px' }}
      >
        Generate Report as PDF
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timetable.map((entry) => (
              <TableRow key={entry._id}>
                <TableCell>{entry.time}</TableCell>
                <TableCell>{entry.day}</TableCell>
                <TableCell>{entry.teacher}</TableCell>
                <TableCell>{entry.subject}</TableCell>
                <TableCell>{entry.venue}</TableCell>
                <TableCell>{entry.grade}</TableCell>
                <TableCell>{entry.batch}</TableCell>
                <TableCell>{entry.course}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleUpdate(entry)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(entry._id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openUpdateForm && selectedEntry && (
        <UpdateTimetableForm
          selectedEntry={selectedEntry}
          handleClose={handleCloseUpdateForm}
          setTimetable={setTimetable}
        />
      )}

      {/* Button to navigate to Admin Profile */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/admin-profile')}
        style={{ marginTop: '20px' }}
      >
        Return to Admin Profile
      </Button>
    </div>
  );
};

const UpdateTimetableForm = ({ selectedEntry, handleClose, setTimetable }) => {
  const [formData, setFormData] = useState(selectedEntry);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/student-timetable/${selectedEntry._id}`, formData);

      setTimetable((prevTimetable) =>
        prevTimetable.map((entry) =>
          entry._id === selectedEntry._id ? response.data : entry
        )
      );
      handleClose();
    } catch (error) {
      console.error('Error updating timetable entry:', error);
    }
  };

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Typography variant="h5">Update Timetable Entry</Typography>
      <form onSubmit={handleUpdate}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
          <TextField
            label="Day"
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
          />
          <TextField
            label="Teacher"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            required
          />
          <TextField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <TextField
            label="Venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
          <TextField
            label="Grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
          />
          <TextField
            label="Batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            required
          />
          <TextField
            label="Course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Timetable
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default ViewStudentTimetable;