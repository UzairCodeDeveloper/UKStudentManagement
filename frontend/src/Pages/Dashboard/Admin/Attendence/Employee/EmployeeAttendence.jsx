import { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Ensure styles are applied
import "./EmployeeAttendence.css"; // Add CSS for smooth animations and styling
import AttendanceManager from "../../../../../api/services/admin/attendance/AttendanceManager"; // Assuming this is your Attendance Manager

export default function EmployeeAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch attendance based on the selected date
  const fetchAttendance = () => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    AttendanceManager.getAttendanceRecordByDate(formattedDate)
      .then((response) => {
        const { attendanceFound, data } = response.data;
        if (attendanceFound) {
          setAttendanceData(data); // Populate with fetched attendance data
        } else {
          setAttendanceData(data); // No attendance found
        }
        setIsAttendanceMarked(true);
      })
      .catch((error) => {
        console.error("Error fetching attendance:", error);
        setIsAttendanceMarked(false);
      });
  };

  // Toggle status between 'present', 'absent', and 'leave'
  const toggleStatus = (teacher_id, newStatus) => {
    const updatedData = attendanceData.map((employee) =>
      employee.teacher_id === teacher_id
        ? { ...employee, status: newStatus }
        : employee
    );
    setAttendanceData(updatedData); // Update the attendance data
  };

  // Prepare the data in the required format to update attendance
  const prepareAttendanceData = () => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    const attendanceList = attendanceData.map((employee) => ({
      teacher_id: employee.teacher_id,
      status: employee.status
    }));

    return {
      date: formattedDate,
      attendance: attendanceList
    };
  };

  // Call the AttendanceManager to mark the attendance
  const updateAttendance = () => {
    const data = prepareAttendanceData();
    setIsUpdating(true); // Disable button to prevent double submission
    AttendanceManager.markAttendance(data)
      .then(() => {
        alert("Attendance updated successfully!");
        setIsUpdating(false);
      })
      .catch((error) => {
        console.error("Error updating attendance:", error);
        setIsUpdating(false);
      });
  };

  // Determine the button class based on the status
  const getStatusClass = (status) => {
    switch (status) {
      case "present":
        return "status-present";
      case "absent":
        return "status-absent";
      case "leave":
        return "status-leave";
      default:
        return "status-default";
    }
  };

  useEffect(() => {
    fetchAttendance(); // Fetch attendance when component mounts
  }, [selectedDate]);

  return (
    <div style={{ height: "100%", padding: "20px", backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            Attendance{" "}
            <span className="sub-header">
              <AiOutlineHome className="sidebar-icon" />- Employee Attendance
            </span>
          </h6>
        </div>
        <div
          className="sectionAttendence"
          style={{ textAlign: "center", marginTop: "50px", padding: "0px 50px" }}
        >
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
          <button className="mark-button" onClick={fetchAttendance}>
            Fetch Records
          </button>
        </div>

        {/* Attendance Table with buttons */}
        <div className={`attendance-table ${isAttendanceMarked ? "show" : ""}`}>
          <table>
            <thead>
              <tr>
                <th>Teacher Name</th>
                <th>Employee ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((employee) => (
                <tr key={employee.teacher_id}>
                  <td>{employee.full_name}</td>
                  <td>{employee.employee_id}</td>
                  <td>
                    <div className="attendance-buttons">
                      {/* Present Button */}
                      <button
                        className={`attendance-btn present-btn ${employee.status === "present" ? "active" : ""}`}
                        onClick={() => toggleStatus(employee.teacher_id, "present")}
                      >
                        Present
                      </button>
                      {/* Absent Button */}
                      <button
                        className={`attendance-btn absent-btn ${employee.status === "absent" ? "active" : ""}`}
                        onClick={() => toggleStatus(employee.teacher_id, "absent")}
                      >
                        Absent
                      </button>
                      {/* Leave Button */}
                      <button
                        className={`attendance-btn leave-btn ${employee.status === "leave" ? "active" : ""}`}
                        onClick={() => toggleStatus(employee.teacher_id, "leave")}
                      >
                        Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update Section */}
        <div className="update-section">
          <button
            className="update-button"
            onClick={updateAttendance}
            disabled={isUpdating} // Disable the button during the update process
          >
            {isUpdating ? "Updating..." : "Update Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}
