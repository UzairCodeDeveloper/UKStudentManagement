import { useEffect, useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../../Admin/Attendence/Student/StudentAttendence.css';
import AttendanceManager from "../../../../../api/services/teacher/attendance/AttendanceManager";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../../../../components/Loader/Loader'; // Import your Loader component

export default function StudentAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    // Set loading state to true when the page is loaded
    setLoading(true);

    // Fetch classes
    AttendanceManager.getAllAssignedClasses()
      .then((response) => {
        setClasses(response.data);
        setSelectedClass(response.data[0]?._id);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // After classes are fetched, set loading to false
        setLoading(false);
      });
  }, []);

  const handleFetchRecords = () => {
    const dateString = selectedDate.toISOString().split('T')[0];

    AttendanceManager.getAttendanceRecordByClassAndDate(selectedClass, dateString)
      .then((response) => {
        const updatedData = response.data.data.map(student => ({
          ...student,
          status: student.status === 'present' ? 'present' : 'absent'
        }));
        setAttendanceData(updatedData);
        setIsAttendanceMarked(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateAttendance = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
  
    const attendancePayload = {
      class_id: selectedClass,
      date: dateString,
      attendance: attendanceData.map(student => ({
        student_id: student.student_id,
        status: student.status
      }))
    };
  
    // Show loading toast
    const loadingToast = toast.loading("Marking attendance, please wait...");
  
    AttendanceManager.markAttendance(attendancePayload)
      .then((response) => {
        // Display success toast and remove the loading toast
        toast.update(loadingToast, {
          render: "Attendance marked successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000, // Auto close after 3 seconds
        });
      })
      .catch((err) => {
        // Display error toast and remove the loading toast
        toast.update(loadingToast, {
          render: "Failed to mark attendance. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000, // Auto close after 3 seconds
        });
      });
  
    // Reset form
    setSelectedDate(new Date());
    setAttendanceData([]);
    setIsAttendanceMarked(false);
  };
  
  const handleStatusChange = (roll_no, newStatus) => {
    const updatedData = attendanceData.map(student =>
      student.roll_no === roll_no
        ? { ...student, status: newStatus === 'P' ? 'present' : 'absent' }
        : student
    );
    setAttendanceData(updatedData);
  };

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="classes-container">
          <ToastContainer position="top-center" />

          <>
            <div className="header">
              <h6>
                Attendance <span className="sub-header"><AiOutlineHome className="sidebar-icon" /> - Student Attendance</span>
              </h6>
            </div>

            <div className="sectionAttendence" style={{ textAlign: "center", marginTop: '50px', padding: '0px 50px' }}>
              <h4>Select Date for Attendance</h4>
              <div className="form-container">
                <div className="form-group">
                  <label htmlFor="class-select">Select Class:</label>
                  <select
                    id="class-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="class-select"
                  >
                    {classes.map((classItem) => (
                      <option key={classItem?._id} value={classItem?._id}>
                        {classItem?.class_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date-picker">Select Date:</label>
                  <DatePicker
  id="date-picker"
  selected={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  dateFormat="MMMM d, yyyy"
  maxDate={new Date()}
  className="date-picker"
  filterDate={(date) => date.getDay() !== 0} // Disable Sundays (0 represents Sunday)
 />
                </div>

                <button className="mark-button" onClick={handleFetchRecords}>Fetch Records</button>
              </div>
            </div>

            <div className={`attendance-table ${isAttendanceMarked ? 'show' : ''}`}>
              <table>
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Marked By</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((student) => (
                    <tr key={student.roll_no}>
                      <td>{student.roll_no}</td>
                      <td>{`${student.forename} ${student.surname}`}</td>
                      <td>
                        <div className="status-buttons">
                          <button
                            className={`status-btn ${student.status === 'present' ? 'active' : ''}`}
                            style={{
                              backgroundColor: student.status === 'present' ? 'green' : 'transparent',
                              color: student.status === 'present' ? 'white' : 'black'
                            }}
                            onClick={() => handleStatusChange(student.roll_no, 'P')}
                          >
                            P
                          </button>
                          <button
                            className={`status-btn ${student.status === 'absent' ? 'active' : ''}`}
                            style={{
                              backgroundColor: student.status === 'absent' ? 'red' : 'transparent',
                              color: student.status === 'absent' ? 'white' : 'black'
                            }}
                            onClick={() => handleStatusChange(student.roll_no, 'A')}
                          >
                            A
                          </button>
                        </div>
                      </td>
                      <td>{student.markedBy || 'Not marked'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isAttendanceMarked && (
              <div className="update-section">
                <button className="update-button" onClick={handleUpdateAttendance}>Update Attendance</button>
              </div>
            )}
          </>
        </div>
      )}
    </div>
  );
}
