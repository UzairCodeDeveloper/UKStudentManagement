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
    AttendanceManager.getReasonRecordByClassAndDate(selectedClass, dateString)
      .then((response) => {
        // console.log(response)
        const updatedData = response.data.data.map(student => ({
          ...student,
          
          reason_for_leave: student.reason_for_leave || '',
          status:student.status // Ensure behaviourMarks exists
        }));
        setAttendanceData(updatedData);
        setIsAttendanceMarked(true);
      })
      .catch((error) => {
        console.log(error);
      });
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
                Reasons <span className="sub-header"><AiOutlineHome className="sidebar-icon" /> - Student Reasons</span>
              </h6>
            </div>

            <div className="sectionAttendence" style={{ textAlign: "center", marginTop: '50px', padding: '0px 50px' }}>
              <h4>Select Date for Reasons</h4>
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
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((student) => (
                    <tr key={student.roll_no}>
                      <td>{student.roll_no}</td>
                      <td>{`${student.forename} ${student.surname}`}</td>
                      <td>
                        <div className="resilience">
                          <span>{student.status}</span>
                        </div>
                      </td>
                      <td>
                        <div className="resilience">
                          <span>{student.reason_for_leave}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            
          </>
        </div>
      )}
    </div>
  );
}
