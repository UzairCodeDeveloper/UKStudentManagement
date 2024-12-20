import { useEffect, useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../../Admin/Attendence/Student/StudentAttendence.css';
import AttendanceManager from '../../../../../api/services/admin/attendance/AttendanceManager'
import ClassManager from '../../../../../api/services/admin/class/classManager'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../../../../components/Loader/Loader'; // Import your Loader component
import Swal from "sweetalert2"; // Import SweetAlert

export default function StudentAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    ClassManager.getAllClasses()
      .then((response) => {
        setClasses(response.data);
        setSelectedClass(response.data[0]?._id);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleFetchRecords = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    console.log(selectedClass)
    console.log(dateString)
    AttendanceManager.getAttendanceRecordByClassAndDate(selectedClass, dateString)
      .then((response) => {
        console.log("Fetched Attendance Data: ", response.data.data);
        const updatedData = response.data.data.map(student => ({
          ...student,
          status:student.status === 'present'
          ? 'present'
          : student.status === 'late'
            ? 'late'
            : 'absent',
          behaviourMarks: student.behaviour_marks || '', // Ensure behaviourMarks exists
          knowledge: student.knowledge || '', // Ensure attitude exists
          resilience: student.resilience || '' // Ensure resilience exists
        }));
        setAttendanceData(updatedData);
        setIsAttendanceMarked(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateAttendance = () => {
    // Check if all required fields are filled
    const incompleteEntries = attendanceData.some(student => 
      !student.status || 
      student.behaviourMarks === '' || 
      student.knowledge === '' || 
      student.resilience === '' ||
      student.behaviourMarks < 0 || 
      student.behaviourMarks > 5 || 
      student.knowledge < 0 || 
      student.knowledge > 5 || 
      student.resilience < 0 || 
      student.resilience > 5
    );
  
    if (incompleteEntries) {
      Swal.fire({
        icon: "error",
        title: "Incomplete or Invalid Data",
        text: "Please ensure all fields are filled and marked ",
      });
      return; // Prevent further execution if validation fails
    }
  
    const dateString = selectedDate.toISOString().split('T')[0];
  
    const attendancePayload = {
      class_id: selectedClass,
      date: dateString,
      attendance: attendanceData.map(student => ({
        student_id: student.student_id,
        status: student.status,
        behaviour_marks: student.behaviourMarks,
        knowledge: student.knowledge,
        resilience: student.resilience,
      })),
    };
  
    const loadingToast = toast.loading("Marking attendance, please wait...");
  
    AttendanceManager.markStudentAttendance(attendancePayload)
      .then((response) => {
        toast.update(loadingToast, {
          render: "Attendance marked successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch((err) => {
        toast.update(loadingToast, {
          render: "Failed to mark attendance. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });
  
    // Reset state after successful update
    setSelectedDate(new Date());
    setAttendanceData([]);
    setIsAttendanceMarked(false);
  };
  
  const handleStatusChange = (roll_no, newStatus) => {
    const updatedData = attendanceData.map(student =>
      student.roll_no === roll_no
        ? {
            ...student,
            status:
              newStatus === 'P' ? 'present' :
              newStatus === 'A' ? 'absent' :
              newStatus === 'L' ? 'late' :
              'unknown' // Optional: handle unexpected newStatus values
          }
        : student
    );
    setAttendanceData(updatedData);
  };

  const handleMarksChange = (roll_no, field, value) => {
    if (value < 0 || value > 5) {
      Swal.fire({
        icon: "error",
        title: "Invalid Marks",
        text: "Marks must be between 0 and 5.",
      });
      return;
    }

    const updatedData = attendanceData.map(student =>
      student.roll_no === roll_no
        ? { ...student, [field]: value }
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
                    filterDate={(date) => date.getDay() !== 0}
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
                    <th>Attitude</th>
                    <th>Resilience</th>
                    <th>knowledge</th>
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
                            className={`status-btn ${student.status === 'late' ? 'active' : ''}`}
                            style={{
                              backgroundColor: student.status === 'late' ? '#f1c40f' : 'transparent',
                              color: student.status === 'late' ? 'white' : 'black'
                            }}
                            onClick={() => handleStatusChange(student.roll_no, 'L')}
                          >
                            L
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
                      <td>
                        <div className="behaviour-marks">
                          <input
                            type="number"
                            value={student.behaviourMarks}
                            onChange={(e) => handleMarksChange(student.roll_no, 'behaviourMarks', e.target.value)}
                            min="0"
                            max="5"
                            className="marks-input"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="resilience">
                          <input
                            type="number"
                            value={student.resilience}
                            onChange={(e) => handleMarksChange(student.roll_no, 'resilience', e.target.value)}
                            min="0"
                            max="5"
                            className="marks-input"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="attitude">
                          <input
                            type="number"
                            value={student.knowledge}
                            onChange={(e) => handleMarksChange(student.roll_no, 'knowledge', e.target.value)}
                            min="0"
                            max="5"
                            className="marks-input"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isAttendanceMarked && (
              <div className="attendance-actions" style={{display:'flex', justifyContent:'center'}}>
              <button className="update-button" style={{backgroundColor:"#28a745"}} onClick={handleUpdateAttendance}>Update Attendance</button>
              </div>
            )}
          </>
        </div>
      )}
    </div>
  );
}
