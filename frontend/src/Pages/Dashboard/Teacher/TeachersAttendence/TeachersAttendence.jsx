import { useState, useEffect } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import Loader from '../../../../components/Loader/Loader'; // Import the Loader component
import Attendance from '../../../../api/services/teacher/attendance/AttendanceManager';

export default function ShowClasses() {
  const [searchMonth, setSearchMonth] = useState(new Date().getMonth()); // State for selected month (default to current month)
  const [searchYear, setSearchYear] = useState(new Date().getFullYear()); // State for selected year (default to current year)
  const [loading, setLoading] = useState(true); // State to track loading
  const [attendance, setAttendance] = useState([]); // State for attendance
  const [presentCount, setPresentCount] = useState(0); // Count of 'P' for selected month
  const [absentCount, setAbsentCount] = useState(0); // Count of 'A' for selected month
  const [leaveCount, setLeaveCount] = useState(0); // Count of 'L' for leave in the selected month
  const [yearsList, setYearsList] = useState([]); // List of available years from attendance data

  // Get the current year
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Fetch actual attendance data from the API
    Attendance.getAttendance()
      .then((res) => {
        // console.log(res);

        // Check if res.data.data is an array
        if (Array.isArray(res.data.data)) {
          const formattedAttendance = res.data.data.map(att => {
            const date = new Date(att.date); // Assuming the date is a string that can be converted to a Date object
            return {
              day: date.getDate(),
              month: date.getMonth(), // Get the month from the date
              year: date.getFullYear(), // Get the year from the date
              status: att.status, // The attendance status (P, A, L for Leave)
            };
          });
          setAttendance(formattedAttendance); // Set the formatted attendance data

          // Extract unique years from attendance data
          const uniqueYears = [...new Set(formattedAttendance.map(att => att.year))];
          setYearsList(uniqueYears); // Set available years list
        } else {
          console.error('Attendance data is not an array', res);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false); // Set loading to false once data is fetched
      });
  }, []); // Empty dependency array to call once on mount

  // Filter attendance based on selected month and year
  const filteredAttendance = attendance.filter(att => 
    (searchMonth !== '' ? att.month === parseInt(searchMonth) : true) &&
    (searchYear !== '' ? att.year === parseInt(searchYear) : true)
  );

  // Update the present, absent, and leave count based on the filtered data
  useEffect(() => {
    const presentCounter = filteredAttendance.filter(att => att.status === 'present').length;
    const absentCounter = filteredAttendance.filter(att => att.status === 'absent').length;
    const leaveCounter = filteredAttendance.filter(att => att.status === 'leave').length;
    setPresentCount(presentCounter);
    setAbsentCount(absentCounter);
    setLeaveCount(leaveCounter); // Update leave count
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
            Teacher Attendance <span className="sub-header"><AiOutlineHome className="sidebar-icon" /> - Monthly Overview</span>
          </h6>
        </div>

        {/* Header Section */}
        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>Teacher Attendance</h1>
        </div>

        {/* Select Month and Year Dropdowns */}
        <div className="search-filter" style={{ marginTop: '50px' }}>
          <span style={{ fontWeight: '600', marginRight: '20px' }}>Select Month </span>
          <select value={searchMonth} onChange={(e) => setSearchMonth(e.target.value)} className="sort-select">
            <option value="">All Months</option>
            {monthsList.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <span style={{ fontWeight: '600', marginRight: '20px' }}>Select Year </span>
          <select value={searchYear} onChange={(e) => setSearchYear(e.target.value)} className="sort-select">
            <option value="">All Years</option>
            {yearsList.map((year, index) => (
              <option key={index} value={year}>{year}</option>
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
            <p style={{color:'orange'}}>Total Leave Days: {leaveCount}</p> {/* Added Leave Count */}
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
                  <td colSpan="3" style={{ textAlign: 'center' }}>No attendance available for the selected month and year.</td>
                </tr>
              ) : (
                filteredAttendance.map((att, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td> {/* Dynamic row number */}
                    <td>
                      {new Date(searchYear, att.month, att.day).toLocaleDateString('en-US', { weekday: 'long' })}
                    </td>
                    <td style={{ color: att.status === 'present' ? 'green' : att.status === 'absent' ? 'red' : 'orange' }}>
                      {att.status}
                    </td> {/* P for Present, A for Absent, L for Leave */}
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
