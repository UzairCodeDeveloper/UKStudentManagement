import React, { useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Ensure styles are applied
import './StudentAttendence.css'; // Add CSS for smooth animations and styling

export default function StudentAttendance() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);

  // Dummy student data
  const students = [
    { id: 1, name: 'Alice Johnson', fatherName: 'Mark Johnson', status: 'P', markedBy: 'Teacher A' },
    { id: 2, name: 'Bob Brown', fatherName: 'David Brown', status: 'P', markedBy: 'Teacher B' }
  ];

  const handleFetchRecords = () => {
    setAttendanceData(students); // Fetch records based on selected class
    setIsAttendanceMarked(true);
  };

  const handleUpdateAttendance = () => {
    console.log('Updating attendance...', attendanceData);
    // API call to update attendance
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

        <div className="sectionAttendence" style={{ textAlign: "center", marginTop: '50px', padding:'0px 50px' }}>
          <h4>Choose Class and Date for Attendance</h4>

          {/* Form-like layout with better styling */}
          <div className="form-container">
            <div className="form-group">
              <label htmlFor="class-select">Select Class:</label>
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="class-dropdown"
              >
                <option value="" disabled>Select Class</option>
                <option value="class1">Class 1</option>
                <option value="class2">Class 2</option>
                <option value="class3">Class 3</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date-picker">Select Date:</label>
              <DatePicker
                id="date-picker"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM d, yyyy"
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
                        onClick={() => handleStatusChange(student.id, 'P')}
                      >
                        P
                      </button>
                      <button
                        className={`status-btn ${student.status === 'A' ? 'active' : ''}`}
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
