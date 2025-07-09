import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, CircularProgress, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
  maxWidth: '1000px',
  margin: 'auto',
  mt: 4,
}));

const ViewTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/timetable', {
          params: { userId },
        });
        setTimetable(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch timetable');
        setLoading(false);
      }
    };

    if (userId) {
      fetchTimetable();
    } else {
      setError('Please log in to view your timetable');
      setLoading(false);
    }
  }, [userId]);

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
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

    // Add title
    doc.setFontSize(18);
    doc.text('Weekly Timetable', 14, 20);

    // Prepare table data
    const tableData = timeSlots.map((time) => {
      const row = [time];
      days.forEach((day) => {
        const entry = timetable.find((item) => item.time === time && item.day === day);
        row.push(entry ? entry.activity : '-');
      });
      return row;
    });

    // Generate table in PDF
    doc.autoTable({
      startY: 30,
      head: [['Time', ...days]],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [25, 118, 210], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    }

    // Save the PDF
    doc.save('timetable_report.pdf');
  };

  // Render timetable with time as rows and days as columns
  const renderTimetable = () => {
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

    return (
      <>
        <TableContainer component={Paper} sx={{ mt: 4, borderRadius: '12px', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>Time</TableCell>
                {days.map((day) => (
                  <TableCell key={day} sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map((time) => (
                <TableRow key={time}>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>{time}</TableCell>
                  {days.map((day) => (
                    <TableCell key={`${time}-${day}`} sx={{ border: '1px solid #e0e0e0' }}>
                      {timetable.some((entry) => entry.time === time && entry.day === day) ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {timetable.find((entry) => entry.time === time && entry.day === day)?.activity}
                          </Typography>
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={generatePDF}
            sx={{ borderRadius: '8px', padding: '10px 20px' }}
          >
            Generate PDF Report
          </Button>
        </Box>
      </>
    );
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        View Timetable
      </Typography>

      <StyledPaper elevation={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        ) : (
          renderTimetable()
        )}
      </StyledPaper>
    </div>
  );
};

export default ViewTimetable;