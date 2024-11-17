import { useState, useEffect } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import Loader from '../../../../components/Loader/Loader'; // Import the Loader component
import AttendanceManager from '../../../../api/services/student/AttendanceManager';

export default function ShowClasses() {
  const [searchMonth, setSearchMonth] = useState(new Date().getMonth()); // State for selected month (default to current month)
  const [loading, setLoading] = useState(false); // State to track loading
  const [attendance, setAttendance] = useState([]); // State for attendance
  const [presentCount, setPresentCount] = useState(0); // Count of 'present' days
  const [absentCount, setAbsentCount] = useState(0); // Count of 'absent' days
  const currentYear = new Date().getFullYear(); // Get the current year

  // Fetch attendance data
  useEffect(() => {
    setLoading(true); // Start loading before making API call
    AttendanceManager
      .getAttendanceByMonthAndYear()
      .then((response) => {
        const attendanceData = response.data.data.formattedAttendance;
        console.log("Response : "+attendanceData)
        // Map the response to include parsed month and day
        const parsedAttendance = attendanceData.map((att) => {
          const [year, month, day] = att.date.split('-');
          return {
            ...att,
            year: parseInt(year),
            month: parseInt(month) - 1, // Convert to 0-indexed
            day: parseInt(day),
          };
        });
        setAttendance(parsedAttendance); // Update attendance state
      })
      .catch((error) => {
        console.error('Error fetching attendance:', error);
      })
      .finally(() => {
        setLoading(false); // Stop loading after API call
      });
  }, []);

  // Filter attendance based on selected month
  const filteredAttendance = attendance.filter((att) => {
    return (
      (searchMonth === '' || att.month === parseInt(searchMonth)) &&
      att.year === currentYear
    );
  });

  // Update present and absent count
  useEffect(() => {
    const presentCounter = filteredAttendance.filter((att) => att.status === 'present').length;
    const absentCounter = filteredAttendance.filter((att) => att.status === 'absent').length;
    setPresentCount(presentCounter);
    setAbsentCount(absentCounter);
  }, [filteredAttendance]);

  // List of months
  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (loading) {
    return <Loader />; // Show the loader if loading
  }

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            Student Attendance <span className="sub-header"><AiOutlineHome className="sidebar-icon" /> - Monthly Overview</span>
          </h6>
        </div>

        {/* Header Section */}
        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>Attendance</h1>
        </div>

        {/* Select Month Dropdown */}
        <div className="search-filter" style={{ marginTop: '50px' }}>
          <span style={{ fontWeight: '600', marginRight: '20px' }}>Select Month </span>
          <select value={searchMonth} onChange={(e) => setSearchMonth(e.target.value)} className="sort-select">
            <option value="">All Months</option>
            {monthsList.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
        </div>

        {/* Attendance Table */}
        <div className="table-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px', // Adds gap between the two items
            marginTop: '20px'
          }}>
            <p style={{ color: 'green' }}>Total Present Days: {presentCount}</p>
            <p style={{ color: 'red' }}>Total Absent Days: {absentCount}</p>
          </div>

          <table
            className="table"
            style={{
              background: "linear-gradient(to right, #007bff, #003f7f)",
              color: '#fff', // Text color for better contrast
              borderCollapse: 'collapse', // Ensures borders collapse correctly
              width: '100%', // Full width
            }}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Attendance Day</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No attendance available for the selected month.</td>
                </tr>
              ) : (
                filteredAttendance.map((att, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td> {/* Dynamic row number */}
                    <td>
                      {new Date(currentYear, att.month, att.day).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </td>
                    <td style={{ color: att.status === 'present' ? 'green' : 'red' }}>
                      {att.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
