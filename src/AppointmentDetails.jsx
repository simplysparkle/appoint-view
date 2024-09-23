import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';

// Function to fetch data from the API
const fetchAppointments = async () => {
  try {
    const response = await axios.get(
      'https://vercel-express-backend.vercel.app/api/retrieve-appointment'
    );
    return response.data.appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

const AppointmentDetails = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAppointments();
      setAppointments(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter logic for search and date
  const filteredAppointments = appointments.filter((appointment) => {
    const isNameMatch = appointment.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.mobile_number.includes(searchTerm);

    const isDateMatch = selectedDate
      ? new Date(appointment.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
      : true;

    return isNameMatch && isDateMatch;
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Clear the search input
  const clearSearch = () => setSearchTerm('');

  // Clear the date input
  const clearDate = () => setSelectedDate('');

  return (
    <Box sx={{ margin: '20px', fontFamily: 'Montserrat, Poppins, sans-serif' }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Montserrat, Poppins, sans-serif', fontWeight: 600 }}>
        Appointments Details
      </Typography>

      {/* Search Bar and Date Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search by Name or Mobile"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{ width: '45%' }}
        />
        <TextField
          label="Filter by Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: selectedDate ? (
              <InputAdornment position="end">
                <IconButton onClick={clearDate}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{ width: '45%' }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="appointments table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, Poppins, sans-serif' }}>First Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, Poppins, sans-serif' }}>Last Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, Poppins, sans-serif' }}>Mobile Number</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, Poppins, sans-serif' }}>Email</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, Poppins, sans-serif' }}>Service(s)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, Poppins, sans-serif' }}>Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, Poppins, sans-serif' }}>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment, index) => (
              <TableRow
                key={appointment.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff', // Alternating shading
                }}
              >
                <TableCell align="center" sx={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>{appointment.first_name}</TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>{appointment.last_name}</TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>{appointment.mobile_number}</TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>{appointment.email || 'N/A'}</TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>{appointment.service.join(', ')}</TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>{appointment.time.slice(0, 5)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AppointmentDetails;


