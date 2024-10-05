import React, { useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Ensure styles are applied
import './EmployeeAttendence.css'; // Add CSS for smooth animations and styling

export default function EmployeeAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);

  // Dummy employee data
  const employees = [
    { id: 1, name: 'John Doe', fatherName: 'Robert Doe', status: 'P' },
    { id: 2, name: 'Jane Smith', fatherName: 'Michael Smith', status: 'P' }
  ];

  const handleMarkAttendance = () => {
    setAttendanceData(employees);
    setIsAttendanceMarked(true);
  };

  const handleUpdateAttendance = () => {
    console.log('Updating attendance...', attendanceData);
    // You can replace this with your actual API call
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedData = attendanceData.map(employee => 
      employee.id === id ? { ...employee, status: newStatus } : employee
    );
    setAttendanceData(updatedData);
  };

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            Attendance <span className="sub-header"><AiOutlineHome className="sidebar-icon" />- Employee Attendance</span>
          </h6>
        </div>
        <div className="sectionAttendence" style={{ textAlign: "center", marginTop: '50px', padding:'0px 50px' }}>
          <h4>Choose Employee for Attendance</h4>
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
            <button className="mark-button" onClick={handleMarkAttendance}>Fetch Records</button>
          
        </div>

        {/* Attendance Table with Smooth Animation */}
        <div className={`attendance-table ${isAttendanceMarked ? 'show' : ''}`}>
          <table>
            <thead>
              <tr>
                <th>Teacher Name</th>
                <th>Father Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.fatherName}</td>
                  <td>
                    <div className="status-buttons">
                      <button
                        className={`status-btn ${employee.status === 'P' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(employee.id, 'P')}
                      >
                        P
                      </button>
                      <button
                        className={`status-btn ${employee.status === 'A' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(employee.id, 'A')}
                      >
                        A
                      </button>
                    </div>
                  </td>
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
