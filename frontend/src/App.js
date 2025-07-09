import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateTimetable from './components/CreateTimetable';
import Login from './components/Login';
import StudentRegister from './components/StudentRegister';
import StudentProfile from './components/StudentProfile';
import StudentProfileEdit from './components/StudentProfileEdit';
import ViewTimetable from './components/ViewTimetable'; // Import ViewTimetable component
import AdminProfile from './components/AdminProfile';
import CreateStudentTimetable from './components/CreateStudentTimetable';
import ViewStudentTimetable from './components/ViewStudentTimetable';
import CreateTicket from './components/CreateTicket';
import ViewMyTickets from './components/viewticket';
import ViewStudentTickets from './components/view student tickets';
import { CssBaseline, Container } from '@mui/material';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/create-timetable" element={<CreateTimetable />} />
          <Route path="/" element={<StudentRegister />} />
          <Route path="/student-dashboard" element={<h1>Student Dashboard (Coming Soon)</h1>} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/student-profile/edit" element={<StudentProfileEdit />} />
          <Route path="/view-timetable" element={<ViewTimetable />} /> {/* Added the View Timetable route */}
          <Route path="/admin-profile" element={<AdminProfile/>} />
          <Route path="/make-timetable" element={<CreateStudentTimetable/>} />
          <Route path="/view-stdtimetable" element={<ViewStudentTimetable/>}/>
          <Route path="/create-ticket" element={<CreateTicket/>}/>
          <Route path="/view-tickets" element={<ViewMyTickets/>}/>
          <Route path="/view-student-tickets" element={<ViewStudentTickets/>}/>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
