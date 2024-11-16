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
  // Get the current year
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (searchMonth !== '') {
      setLoading(true); // Start loading before making API call

      AttendanceManager
        .getAttendanceByMonthAndYear(searchMonth + 1, currentYear) // Pass month (1-indexed) and year
        .then((response) => {
          const attendanceData = response.data.data;

          setAttendance(attendanceData); // Update attendance state
          const presentCounter = attendanceData.filter(att => att.status === 'present').length;
          const absentCounter = attendanceData.filter(att => att.status === 'absent').length;

          setPresentCount(presentCounter); // Update present count
          setAbsentCount(absentCounter); // Update absent count
        })
        .catch((error) => {
          console.error('Error fetching attendance:', error);
        })
        .finally(() => {
          setLoading(false); // Stop loading after API call
        });
    }
  }, [searchMonth, currentYear]);

  // Filter attendance based on selected month
  const filteredAttendance = searchMonth !== ''
    ? attendance.filter(att => att.month === parseInt(searchMonth))
    : attendance;

  // Update the present and absent count based on the filtered data
  useEffect(() => {
    const presentCounter = filteredAttendance.filter(att => att.status === 'present').length;
    const absentCounter = filteredAttendance.filter(att => att.status === 'absent').length;
    setPresentCount(presentCounter);
    setAbsentCount(absentCounter);
    console.log(attendance)
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
            gap: '30px',  // Adds gap between the two items
            marginTop: '20px'
          }}>
            <p style={{color:'green'}}>Total Present Days: {presentCount}</p>
            <p style={{color:'red'}}>Total Absent Days: {absentCount}</p>
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
                      {new Date(currentYear, att.month, att.day).toLocaleDateString('en-US', { weekday: 'long' })}
                    </td>
                    <td style={{ color: att.status === 'present' ? 'green' : 'red' }}>
                      {att.status}
                    </td> {/* P for Present, A for Absent */}
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
