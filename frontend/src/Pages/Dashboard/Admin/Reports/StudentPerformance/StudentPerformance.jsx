import { useEffect, useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import '../../../Admin/Attendence/Student/StudentAttendence.css';
import ClassManager from '../../../../../api/services/admin/class/classManager';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../../../../components/Loader/Loader';
import ReportManager from '../../../../../api/services/admin/Report/Report';
import { jsPDF } from 'jspdf';  // Import jsPDF
import autoTable from 'jspdf-autotable';  // Import autoTable for table formatting
import logo from '/public/logo.png';  // Adjust the logo path

export default function StudentAttendance() {
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reportData, setReportData] = useState(null); // Store report data
  const [attendance, setAttendance] = useState(''); // Attendance data
  const [loading, setLoading] = useState(true);
  const [isStudentDropdownDisabled, setIsStudentDropdownDisabled] = useState(true);

  // Fetch all classes on initial load
  useEffect(() => {
    setLoading(true);

    ClassManager.getAllClasses()
      .then((response) => {
        setClasses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching classes:', error);
        toast.error('Failed to fetch classes');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Fetch student records whenever selectedClass is updated
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      setIsStudentDropdownDisabled(true);
      return;
    }

    setLoading(true);

    ReportManager.getStudentsbyClassid(selectedClass)
      .then((response) => {
        if (response?.data?.students) {
          setStudents(response.data.students);
          setIsStudentDropdownDisabled(false);
          toast.success('Records fetched successfully');
        } else {
          console.warn('Unexpected response structure:', response);
          setStudents([]);
          setIsStudentDropdownDisabled(true);
          toast.error('No students found for the selected class');
        }
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        toast.error('Failed to fetch records');
        setStudents([]);
        setIsStudentDropdownDisabled(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedClass]);

  // Fetch summarized records for the selected student
  const fetchSummerizedRecord = () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    setLoading(true);

    ReportManager.getSummerizedStudentReport(selectedStudent)
      .then((res) => {
        setAttendance(res.data.attendance); // Set attendance data
        console.log(attendance)
        if (res?.data?.report) {
          setReportData(res.data.report);
          toast.success('Summarized record fetched successfully');
        } else {
          setReportData(null);
          toast.error('No summarized record found');
        }
      })
      .catch((err) => {
        console.error('Error fetching summarized record:', err);
        toast.error('Failed to fetch summarized record');
        setReportData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const title = "Student Performance Report";

    // Adding the logo
    doc.addImage(logo, 'PNG', 10, 10, 50, 20);

    // Adding the title and student info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 70, 20);
    doc.setFontSize(12);
    doc.text(`Student: ${selectedStudent ? `${students.find(student => student.id === selectedStudent).forename} ${students.find(student => student.id === selectedStudent).surname}` : 'N/A'}`, 70, 30);
    doc.text(`Class: ${selectedClass ? classes.find(cls => cls._id === selectedClass)?.class_name : 'N/A'}`, 70, 40);

    // Table headers and data for report
    const headers = [
      'Course',
      'Assignment',
      'Homework',
      'Quiz',
      'Graded',
      'Submitted',
      'Assignment%',
      'Homework%',
      'Quiz%',
    ];

    const rows = reportData.map(course => [
      course.course_name,
      course.resources.assignment?.total || 0,
      course.resources.homework?.total || 0,
      course.resources.quiz ? course.resources.quiz.total : 0,
      course.total_graded_resources,
      Object.values(course.resources).reduce((acc, r) => acc + (r.submissionsMade || 0), 0),
      course.resources.assignment?.average || 0,
      course.resources.homework?.average || 0,
      course.resources.quiz?.average || 0
    ]);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Report", 10, 55);
    autoTable(doc, {
      startY: 60,
      head: [headers],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: '#4CAF50', textColor: 'white', fontSize: 10, halign: 'center' },
      bodyStyles: { fontSize: 10, valign: 'middle' },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' }, 5: { halign: 'center' }, 6: { halign: 'center' } },
      margin: { top: 50, bottom: 30, left: 10, right: 10 },
      tableWidth: 'auto',
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Attendance", 10, 155);
    // Adding the Attendance Table below the report
    if (attendance) {
      const attendanceHeaders = ['Total Present', 'Total Absent', 'Total Late', 'Resilience', 'Knowledge', 'Behavior'];
      const attendanceData = [
        attendance.totalPresent || 0,
        attendance.totalAbsent || 0,
        attendance.totalLate || 0,
        attendance.averageResilience || 0,
        attendance.averageKnowledge || 0,
        attendance.averageBehaviour || 0,
      ];

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 30,
        head: [attendanceHeaders],
        body: [attendanceData],
        theme: 'grid',
        headStyles: { fillColor: '#4CAF50', textColor: 'white', fontSize: 10, halign: 'center' },
        bodyStyles: { fontSize: 10, valign: 'middle' },
        columnStyles: { 0: { halign: 'left' }, 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' }, 5: { halign: 'center' } },
        margin: { top: 10, bottom: 30, left: 10, right: 10 },
        tableWidth: 'auto',
      });
    }
    doc.setFontSize(10);
    const marginTop = 10; // 10 units margin for top
    
    // Disclaimer text with added margin
    doc.text("Disclaimer: This is an automated report generated by the IMAM Organization UK system.", 10, doc.lastAutoTable.finalY + marginTop + 15);
    doc.text("The data provided is based on the most recent information available and is subject to change.", 10, doc.lastAutoTable.finalY + marginTop + 20);
    doc.text("Any discrepancies or errors in the report are not the responsibility of the system.", 10, doc.lastAutoTable.finalY + marginTop + 25);
    doc.text("For any questions, please contact support@imam.org.uk", 10, doc.lastAutoTable.finalY + marginTop + 30);
    
    // Signature text with added margin
    doc.text("Signature: _____________________________", 120, doc.lastAutoTable.finalY + marginTop + 55);
    
    doc.save("student_performance_report.pdf");
    
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
          <div className="header">
            <h6>
              Performance <span className="sub-header"><AiOutlineHome className="sidebar-icon" /> - Individual student</span>
            </h6>
          </div>

          <div className="sectionAttendence" style={{ textAlign: "center", marginTop: '50px', padding: '0px 50px' }}>
            <h4>Student Performance</h4>
            <div className="form-container">
              {/* Class Dropdown */}
              <div className="form-group">
                <label htmlFor="class-select">Select Class:</label>
                <select
                  id="class-select"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="class-select"
                >
                  <option value=""> Select a class</option>
                  {classes.map((classItem) => (
                    <option key={classItem?._id} value={classItem?._id}>
                      {classItem?.class_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Dropdown */}
              <div className="form-group">
                <label htmlFor="student-select">Select Student:</label>
                <select
                  id="student-select"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="student-select"
                  disabled={isStudentDropdownDisabled}
                >
                  <option value="">-- Select a student --</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.forename} {student.surname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Summarized Records Button */}
              <button
                className="mark-button"
                onClick={fetchSummerizedRecord}
                disabled={!selectedStudent}
              >
                Summarized Records
              </button>
              
            </div>

            {/* Report Table */}
            {reportData && (
              <div className="report-table" style={{ overflowX: 'auto' ,marginTop:"50px"}}>
              
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Assignment</th>
                      <th>Homework</th>
                      <th>Quiz</th>
                      <th>Graded</th>
                      <th>Submitted</th>
                      <th>Assignment%</th>
                      <th>Homework%</th>
                      <th>Quiz%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((course, index) => (
                      <tr key={index}>
                        <td>{course.course_name}</td>
                        <td>{course.resources.assignment?.total || 0}</td>
                        <td>{course.resources.homework?.total || 0}</td>
                        <td>{course.resources.quiz ? course.resources.quiz.total : 0}</td>
                        <td>{course.total_graded_resources}</td>
                        <td>{Object.values(course.resources).reduce((acc, r) => acc + (r.submissionsMade || 0), 0)}</td>
                        <td>{course.resources.assignment?.average || 0}%</td>
                        <td>{course.resources.homework?.average || 0}%</td>
                        <td>{course.resources.quiz?.average || 0}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Attendance Table */}
            {attendance && Object.keys(attendance).length > 0 && (
  <div className="report-table" style={{marginTop:'50px', overflowX:"auto"}}>
    {/* <h2 style={{textAlign:"left", marginLeft:'10px', fontWeight:'bold'}}>Attendance</h2> */}
    <table>
      <thead>
        <tr>
          <th>Total Present</th>
          <th>Total Absent</th>
          <th>Total Late</th>
          <th>Resilience</th>
          <th>Knowledge</th>
          <th>Behavior</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{attendance.totalPresent || 0}</td>
          <td>{attendance.totalAbsent || 0}</td>
          <td>{attendance.totalLate || 0}</td>
          <td>{attendance.averageResilience || 0}</td>
          <td>{attendance.averageKnowledge || 0}</td>
          <td>{attendance.averageBehaviour || 0}</td>
        </tr>
      </tbody>
    </table>
  </div>
)}


            {/* PDF Generation Button */}
            <button
              className="mark-button"
              onClick={generatePDF}
            >
              Download Report as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
