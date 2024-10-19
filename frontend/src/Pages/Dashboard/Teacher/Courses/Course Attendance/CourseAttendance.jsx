import React, { useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Ensure styles are applied
import '../../../Admin/Attendence/Student/StudentAttendence.css'; // Add CSS for smooth animations and styling

export default function StudentAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]); // Store attendance data for the selected date
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // Temporary store for attendance records

  // Dummy student data
  const students = [
    { id: 1, name: 'Alice Johnson', fatherName: 'Mark Johnson', markedBy: 'Teacher A' },
    { id: 2, name: 'Bob Brown', fatherName: 'David Brown', markedBy: 'Teacher B' }
  ];

  const handleFetchRecords = () => {
    const dateString = selectedDate.toISOString().split('T')[0]; // Use date as key
    const records = attendanceRecords[dateString] || students.map(student => ({ ...student, status: 'P' })); // Initialize with default status if no records
    setAttendanceData(records);
    setIsAttendanceMarked(true);
  };

  const handleUpdateAttendance = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    setAttendanceRecords(prevRecords => ({
      ...prevRecords,
      [dateString]: attendanceData // Store updated attendance for the selected date
    }));
    console.log('Updating attendance...', attendanceData);

    // Reset the form
    setSelectedDate(new Date()); // Reset to today's date
    setAttendanceData([]); // Clear attendance data
    setIsAttendanceMarked(false); // Reset attendance marked status
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedData = attendanceData.map(student => 
      student.id === id ? { ...student, status: newStatus } : student
    );
    setAttendanceData(updatedData);
  };

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            Attendance <span className="sub-header"><AiOutlineHome className="sidebar-icon" /> - Student Attendance</span>
          </h6>
        </div>

        <div className="sectionAttendence" style={{ textAlign: "center", marginTop: '50px', padding: '0px 50px' }}>
          <h4>Select Date for Attendance</h4>

          {/* Form-like layout with better styling */}
          <div className="form-container">
            <div className="form-group">
              <label htmlFor="date-picker">Select Date:</label>
              <DatePicker
                id="date-picker"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM d, yyyy"
                maxDate={new Date()} // Set max date to today
                className="date-picker"
              />
            </div>

            <button className="mark-button" onClick={handleFetchRecords}>Fetch Records</button>
          </div>
        </div>

        {/* Attendance Table with Smooth Animation */}
        <div className={`attendance-table ${isAttendanceMarked ? 'show' : ''}`}>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Father Name</th>
                <th>Status</th>
                <th>Marked By</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.fatherName}</td>
                  <td>
                    <div className="status-buttons">
                      <button
                        className={`status-btn ${student.status === 'P' ? 'active' : ''}`}
                        style={{ backgroundColor: student.status === 'P' ? 'green' : 'transparent', color: 'white' }}
                        onClick={() => handleStatusChange(student.id, 'P')}
                      >
                        P
                      </button>
                      <button
                        className={`status-btn ${student.status === 'A' ? 'active' : ''}`}
                        style={{ backgroundColor: student.status === 'A' ? 'red' : 'transparent', color: 'white' }}
                        onClick={() => handleStatusChange(student.id, 'A')}
                      >
                        A
                      </button>
                    </div>
                  </td>
                  <td>{student.markedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update Attendance Button */}
        {isAttendanceMarked && (
          <div className="update-section">
            <button className="update-button" onClick={handleUpdateAttendance}>Update Attendance</button>
          </div>
        )}
      </div>
    </div>
  );
}
