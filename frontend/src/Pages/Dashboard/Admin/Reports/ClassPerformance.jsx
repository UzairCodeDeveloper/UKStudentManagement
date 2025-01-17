import { useEffect, useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import "react-datepicker/dist/react-datepicker.css";
import '../Attendence/Student/StudentAttendence.css';
import ClassManager from '../../../../api/services/admin/class/classManager';
import ReportManager from '../../../../api/services/admin/Report/Report';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable'; 
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function StudentAttendance() {
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [classPerformanceData, setClassPerformanceData] = useState([]);
  const [overallClassPerformance, setOverallClassPerformance] = useState("");
  const [totalstd, settotalstd] = useState(0);
  const [totalcourse, settotalcourse] = useState(0);
  const [className, setclassName] = useState(0);

  useEffect(() => {
    ClassManager.getAllClasses()
      .then((response) => {
        setClasses(response.data);
        setSelectedClass(response.data[0]?._id); // Select the first class by default
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleFetchRecords = () => {
    Swal.fire({
      title: 'Loading...',
      text: 'Fetching class performance data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    ReportManager.getClassbasedPerformance(selectedClass)
      .then((response) => {
        setClassPerformanceData(response.data.course_details);
        setOverallClassPerformance(response.data.overall_class_performance);
        settotalcourse(response.data.total_courses);
        settotalstd(response.data.total_students);
        setclassName(response.data.class_name);

        Swal.fire({
          icon: 'success',
          title: 'Data Fetched Successfully',
          text: 'Class performance data has been fetched.',
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Fetch Data',
          text: 'There was an error while fetching the performance data.',
        });
      });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const title = "Class Performance Report";
  
    // Adding the company logo and name to the top left
    const logoUrl = 'public/logo.png';
    const logoWidth = 20;
    const logoHeight = 20;
  
    // Add logo to the top left (at position 10, 10)
    doc.addImage(logoUrl, 'PNG', 10, 10, logoWidth, logoHeight);
  
    // Add company name next to the logo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text('IMAM Organization UK', 70, 25);
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, 76, 35); 
    
    doc.setLineWidth(0.5); 
    doc.line(76, 38, 76 + titleWidth, 38); 

    // Adding Class Name, Total Students, Total Courses
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Class Name: ", 10, 50);
    doc.text("Total Students: ", 10, 55);
    doc.text("Total Courses: ", 10, 60);
    doc.setFont("helvetica", "normal");
    doc.text(String(className), 40, 50);  
    doc.text(String(totalstd), 43, 55);  
    doc.text(String(totalcourse), 43, 60); 
  
    // Right side: Date and Time
    const currentDate = new Date();
    const dateStr = `Date: ${currentDate.toLocaleDateString()}`;
    const timeStr = `Time: ${currentDate.toLocaleTimeString()}`;
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(dateStr, 150, 50); 
    doc.text(timeStr, 150, 55); 

    // Table headers and data
    const headers = [
      'Course',
      'Instructor',
      'Total Resources',
      'Graded',
      'Pending',
      'Submission Ratio',
      'Performance',
    ];
  
    const rows = classPerformanceData.map(course => [
      course.course_name,
      course.instructor,
      course.resources.total,
      course.resources.submissionCounts.graded,
      course.resources.submissionCounts.pending,
      course.submission_ratio,
      course.course_performance_score
    ]);
  
    autoTable(doc, {
      startY: 70,
      head: [headers],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: '#4CAF50', textColor: 'white', fontSize: 12, halign: 'center' },
      bodyStyles: { fontSize: 10, valign: 'middle' },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' }, 5: { halign: 'center' }, 6: { halign: 'center' } },
      margin: { top: 30, bottom: 30, left: 10, right: 10 },
      tableWidth: 'auto',
    });
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Overall Class Performance: ${String(overallClassPerformance)}`, 20, doc.lastAutoTable.finalY + 10);
  
    doc.setFontSize(10);
    doc.text("Disclaimer: This is an automated report generated by the IMAM Organization UK system.", 10, doc.lastAutoTable.finalY + 20);
    doc.text("The data provided is based on the most recent information available and is subject to change.", 10, doc.lastAutoTable.finalY + 25);
    doc.text("Any discrepancies or errors in the report are not the responsibility of the system.", 10, doc.lastAutoTable.finalY + 30);
    doc.text("For any questions, please contact support@imam.org.uk", 10, doc.lastAutoTable.finalY + 35);

    doc.setFontSize(10);
    doc.text("Signature: _____________________________", 120, doc.lastAutoTable.finalY + 45);

    doc.save("class_performance_report.pdf");
  };

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            Report <span className="sub-header"><AiOutlineHome className="sidebar-icon" /> - Class Wise</span>
          </h6>
        </div>

        <div className="sectionAttendence" style={{ textAlign: "center", marginTop: '50px', padding: '0px 50px' }}>
          <h4>Class Based Performance</h4>
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

            <button className="mark-button" onClick={handleFetchRecords}>Fetch Records</button>
          </div>
        </div>

        {classPerformanceData.length > 0 && (
          <div className="performance-table">
            <table style={{ width: '100%', tableLayout: 'auto' }}>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Total Resources</th>
                  <th>Graded</th>
                  <th>Pending</th>
                  <th>Submission Ratio</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {classPerformanceData.map((course, index) => (
                  <tr key={index}>
                    <td>{course.course_name}</td>
                    <td>{course.instructor}</td>
                    <td>{course.resources.total}</td>
                    <td>{course.resources.submissionCounts.graded}</td>
                    <td>{course.resources.submissionCounts.pending}</td>
                    <td>{course.submission_ratio}</td>
                    <td>{course.course_performance_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="overall-performance" style={{ marginTop: '20px' }}>
              <strong>Overall Class Performance: {overallClassPerformance}</strong>
            </div>
          </div>
        )}

        {classPerformanceData.length > 0 && (
          <div className="buttons-container " style={{ marginTop: '20px', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <button onClick={generatePDF} className="btn btn-primary">
              Generate PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
