import { useEffect, useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../Admin/Attendence/Student/StudentAttendence.css';
import ClassManager from '../../../../../api/services/admin/class/classManager';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../../../../components/Loader/Loader';
import ReportManager from '../../../../../api/services/admin/Report/Report';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function StudentAttendance() {
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStudentDropdownDisabled, setIsStudentDropdownDisabled] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(1);

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

  const fetchRecord = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    ReportManager.getDetailedStudentReport(selectedStudent, { start: formattedStartDate, end: formattedEndDate })
      .then((res) => {
        if (res?.data?.report) {
          setReportData(res.data.report);
          toast.success('Report fetched successfully');
        } else {
          setReportData([]);
          toast.error('No data available for the selected criteria');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to fetch the report');
      });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add Logo (You can replace with your actual logo file)
    const logoUrl = '/public/logo.png'; // Replace with your logo path or base64 URL
    doc.addImage(logoUrl, 'PNG', 10, 10, 40, 40); // Adjust the size and position
    
    // Organization Name & Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('IMAM ORGANIZATION UK', 60, 20); // Adjust the position of the name
    
    // Report Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text('Student Detailed Performance Report', 60, 30); // Adjust the title position

    // Add space after the title
    let yOffset = 40; // Position after the report title
    
    // Date
    const currentDate = new Date().toLocaleDateString(); // Get the current date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${currentDate}`, 140, yOffset+20); // Add date below title
    yOffset += 10; // Space after the date
    
    // Student Name & Class Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${selectedStudent ? `${students.find(student => student.id === selectedStudent).forename} ${students.find(student => student.id === selectedStudent).surname}` : 'N/A'}`, 10, yOffset+10);
    doc.text(`Class: ${selectedClass ? classes.find(cls => cls._id === selectedClass)?.class_name : 'N/A'}`, 10, yOffset+18);// Adjust class position to align horizontally
    yOffset += 40; // Add extra space after student info
    
    // Loop through reportData and generate the tables
    reportData.forEach((course, courseIndex) => {
        // Course Name
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Course ${courseIndex + 1}: ${course.course_name}`, 15, yOffset);
        yOffset += 10;

        // Assignments Table
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Assignments:', 15, yOffset);
        yOffset += 8;

        if (course.assignments.length > 0) {
            const assignmentData = course.assignments.map((item) => [
                item.title,
                item.submissionMade,
                item.status,
                item.obtained_marks,
            ]);
            doc.autoTable({
                startY: yOffset,
                head: [['Title', 'Submission Made','Status', 'Obtained Marks']],
                body: assignmentData,
                theme: 'grid',
                headStyles: { fillColor: "#4CAF50" }, // Blue header
                bodyStyles: { font: 'helvetica', fontSize: 10 },
                alternateRowStyles: { fillColor: [245, 245, 245] }, // Light gray for alternate rows
            });
            yOffset = doc.lastAutoTable.finalY + 10;
        } else {
            // "No Data Available" for assignments
            const noDataRow = [['No Data Available', '', '']];
            doc.autoTable({
                startY: yOffset,
                head: [['Title', 'Submission Made','Status', 'Obtained Marks']],
                body: noDataRow,
                theme: 'grid',
                headStyles: { fillColor: "#4CAF50" },
                bodyStyles: { font: 'helvetica', fontSize: 10 },
            });
            yOffset = doc.lastAutoTable.finalY + 10;
        }

        // Homeworks Table
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Homeworks:', 15, yOffset);
        yOffset += 8;

        if (course.homeworks.length > 0) {
            const homeworkData = course.homeworks.map((item) => [
                item.title,
                item.submissionMade,
                item.status,
                item.obtained_marks,
            ]);
            doc.autoTable({
                startY: yOffset,
                head: [['Title', 'Submission Made','Status', 'Obtained Marks']],
                body: homeworkData,
                theme: 'grid',
                headStyles: { fillColor: "#4CAF50" },
                bodyStyles: { font: 'helvetica', fontSize: 10 },
                alternateRowStyles: { fillColor: [245, 245, 245] },
            });
            yOffset = doc.lastAutoTable.finalY + 10;
        } else {
            // "No Data Available" for homeworks
            const noDataRow = [['No Data Available', '', '']];
            doc.autoTable({
                startY: yOffset,
                head: [['Title', 'Submission Made','Status', 'Obtained Marks']],
                body: noDataRow,
                theme: 'grid',
                headStyles: { fillColor: "#4CAF50" },
                bodyStyles: { font: 'helvetica', fontSize: 10 },
            });
            yOffset = doc.lastAutoTable.finalY + 10;
        }

        // Quizzes Table
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Quizzes:', 15, yOffset);
        yOffset += 8;

        if (course.quizzes.length > 0) {
            const quizData = course.quizzes.map((item) => [
                item.title,
                item.submissionMade,
                item.status,
                item.obtained_marks,
            ]);
            doc.autoTable({
                startY: yOffset,
                head: [['Title', 'Submission Made', 'Status','Obtained Marks']],
                body: quizData,
                theme: 'grid',
                headStyles: { fillColor: "#4CAF50" },
                bodyStyles: { font: 'helvetica', fontSize: 10 },
                alternateRowStyles: { fillColor: [245, 245, 245] },
            });
            yOffset = doc.lastAutoTable.finalY + 20;
        } else {
            // "No Data Available" for quizzes
            const noDataRow = [['No Data Available', '', '']];
            doc.autoTable({
                startY: yOffset,
                head: [['Title', 'Submission Made', 'Status','Obtained Marks']],
                body: noDataRow,
                theme: 'grid',
                headStyles: { fillColor: "#4CAF50" },
                bodyStyles: { font: 'helvetica', fontSize: 10 },
            });
            yOffset = doc.lastAutoTable.finalY + 10;
        }
    });

    // Save the generated PDF
    doc.save('student_performance_report.pdf');
};



  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = reportData.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
              Performance <span className="sub-header"><AiOutlineHome className="sidebar-icon" /> - Detailed</span>
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

              {/* Date Pickers */}
              <div className="form-group">
                <label htmlFor="start-date">Start Date:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  id="start-date"
                  placeholderText="Select start date"
                  className="date-picker"
                />
              </div>
              <div className="form-group">
                <label htmlFor="end-date">End Date:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  id="end-date"
                  placeholderText="Select end date"
                  className="date-picker"
                />
              </div>

              {/* Summarized Records Button */}
              <button
                className="mark-button"
                onClick={fetchRecord}
                disabled={!selectedStudent || !startDate || !endDate}
              >
                Summarized Records
              </button>
              <button
                className="mark-button"
                onClick={generatePDF}
                disabled={reportData.length === 0}
              >
                Generate PDF
              </button>
            </div>

            {/* Report Tables */}
            {currentCourses.length > 0 && (
              <div className="report-section" style={{ marginTop: '20px', overflowX:"auto" }}>
                {currentCourses.map((course, index) => (
                  <div key={index} className="course-report">
                    <h5 className="course-title">{course.course_name}</h5>

                    {['assignments', 'homeworks', 'quizzes'].map((type) => (
                      <div key={type} style={{ marginTop: '10px' }}>
                        <h6 className="type-title">{type.charAt(0).toUpperCase() + type.slice(1)}</h6>
                        <table className="report-table" border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Submission Made</th>
                              <th>Status</th>
                              <th>Obtained Marks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {course[type].length > 0 ? (
                              course[type].map((item, idx) => (
                                <tr key={idx}>
                                  <td>{item.title}</td>
                                  <td>{item.submissionMade}</td>
                                  <td>{item.status}</td>
                                  <td>{item.obtained_marks}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="3">No data available</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="pagination-container">
              {reportData.length > 1 && (
                <div className="pagination">
                  {Array.from({ length: Math.ceil(reportData.length / coursesPerPage) }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
