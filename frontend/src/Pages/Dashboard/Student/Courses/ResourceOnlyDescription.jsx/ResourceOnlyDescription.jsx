import { useState} from 'react';
import { Table } from 'react-bootstrap'; // Importing the Table component from react-bootstrap
import { useParams } from 'react-router-dom';

export default function ShowClasses() {
  const [submissionTime, setSubmissionTime] = useState('2024-11-17 10:00 AM'); // Store submission time, you can replace this with actual time
  const [isSubmitted, setIsSubmitted] = useState(true); // Force submission to be true (remove the button and submission logic)

  const param=useParams()
  const course=param.course
  const id=param.id
  console.log(id)
  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            {course} <span className="sub-header"> - Resource</span>
          </h6>
        </div>

        {/* Search Bar */}
        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>Quran Assignment 1</h1>
        </div>

        <div style={{ marginTop: '100px' }}>
          
          <div style={{ marginLeft: '20px', marginTop: '50px' }}>
            <h5>Assignment Description:</h5>
            <p>Upload the Assignment on Proper Time and In PDF Format</p>
          </div>
          <h3 style={{ marginLeft: '20px', marginTop:'50px' }}>Submission Status</h3>

          {/* Submission Status Table */}
          {isSubmitted ? (
            <div style={{ marginTop: '20px', marginLeft: '20px' }}>
              {/* Adjusted Table layout with header column on left and values column on right */}
              <Table bordered hover responsive>
                <tbody>
                  <tr style={{ backgroundColor: '#f1f1f1' }}>
                    <td style={{ fontWeight: 'bold', background: "#f7f7f7" }}>Submission Status</td>
                    <td style={{ backgroundColor: '#cfefcf' }}>Submission Not Required</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>File</td>
                    <td>Pending</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f1f1f1' }}>
                    <td style={{ fontWeight: 'bold' }}>Submission Time</td>
                    <td style={{ backgroundColor: '#cfefcf' }}>{submissionTime}</td>
                  </tr>
                  
                </tbody>
              </Table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
