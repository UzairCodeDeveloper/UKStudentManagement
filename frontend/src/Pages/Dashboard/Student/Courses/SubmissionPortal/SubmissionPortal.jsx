import { useEffect, useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import { useDropzone } from 'react-dropzone'; 
// import { Table } from 'react-bootstrap';
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileAlt } from 'react-icons/fa';
import { AiOutlineFile } from 'react-icons/ai'; 
import { useParams } from 'react-router-dom';
import { Table } from 'react-bootstrap'; // Importing the Table component from react-bootstrap
import ResourceManager from "../../../../../api/services/student/ResourceManager"

export default function ShowClasses() {
  function toLondonTimeWithMinutes(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString); // Convert string to Date object
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  }

  function toLondonTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString); // Convert string to Date object
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState([]);
  const [showDropzone, setShowDropzone] = useState(false);
  // const [submissionTime, setSubmissionTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [resource, setResource] = useState(null);
  const [submission, setSubmission] = useState(null);

  const params = useParams();

  useEffect(() => {
    // Fetch resource details
    ResourceManager.getResourceByID(params.id)
      .then((res) => {
        setResource(res.data.data); // Set resource details
        setIsSubmitted(res.data.isSubmitted); // Update submission status
        if (res.data.isSubmitted) {
          setSubmission(res.data.submission); // Set submission details if available
        }
      })
      .catch((err) => console.log(err));
  }, [params.id]);

  // Handle file drop for the Dropzone
  const handleFileDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setErrorMessage('');
  };

  const handleDropRejected = (rejectedFiles) => {
    rejectedFiles.forEach(file => {
      if (file.errors[0].code === 'file-invalid-type') {
        setErrorMessage('Invalid file type. Please upload PDF, DOCX, or PPTX files only.');
      } else {
        setErrorMessage('File type is not supported.');
      }
    });
  };

  // React Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    onDropRejected: handleDropRejected,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.ms-powerpoint': ['.pptx'],
    },
    multiple: false // Only allow one file to be uploaded
  });

  // Handle submission action
  const handleSubmit = () => {
    if (files.length > 0 && resource) {
      ResourceManager.submitResource(resource._id, files[0])
        .then((res) => {
          console.log('Submission successful', res);
          setIsSubmitted(true);
          setSubmission(res.data);
          setFiles([]);
          setShowDropzone(false);
        })
        .catch(() => setErrorMessage('Submission failed. Please try again.'));
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setShowDropzone(false);
    setFiles([]);
  };

  // Render file type icons based on file extension
  const getFileIcon = (file) => {
    const fileType = file.name.split('.').pop().toLowerCase();
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf style={{ color: '#e03e36', fontSize: '24px' }} />;
      case 'docx':
        return <FaFileWord style={{ color: '#2a67a1', fontSize: '24px' }} />;
      case 'pptx':
        return <FaFilePowerpoint style={{ color: '#f0b35b', fontSize: '24px' }} />;
      default:
        return <FaFileAlt style={{ color: '#6c757d', fontSize: '24px' }} />;
    }
  };

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            Quran <span className="sub-header"><AiOutlineHome className="sidebar-icon" /> - Resource</span>
          </h6>
        </div>

        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>{resource?.title}</h1>
        </div>

        <div style={{ marginTop: '100px' }}>
          <h3 style={{ marginLeft: '20px' }}>Submission Status</h3>
          <div style={{ marginLeft: '20px', marginTop: '50px' }}>
            <h5>Assignment Description:</h5>
            <p>{resource?.description}</p>
          </div>
          <div style={{ marginLeft: '20px', marginTop: '50px' }}>
            <h5>Due Date:</h5>
            <p>{toLondonTime(resource?.due_date)}</p>
          </div>
          <div style={{ marginLeft: '20px', marginTop: '50px' }}>
            <h5>{resource?.resource_type}</h5>
          </div>
          <div style={{ marginLeft: '20px', marginTop: '30px' }}>
            <a href={resource?.resource_url} target='_blank'>View Submission</a>
          </div>
          {/* <div style={{ marginLeft: '20px', marginTop: '30px' }}>
            <h5>Total Marks: </h5>
            <p>{resource?.totalMarks}</p>
          </div> */}
          {/* <div style={{ marginLeft: '20px', marginTop: '30px' }}>
            <h5>Obtained Marks: </h5>
            <p>{submission?.obtained_marks}</p>
          </div> */}

          {
            resource?.submissionRequired === 'Yes' && (
              <>
                        {!isSubmitted ? (
            <div>
              <div style={{ margin: '20px 0', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'column' }}>
                <p style={{ marginLeft: '20px', color: 'red' }}>No submission yet</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowDropzone(true)} // Show the dropzone area
                  style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Add Submission
                </button>
              </div>

              <div
                style={{
                  transition: 'all 0.5s ease-in-out',
                  opacity: showDropzone ? 1 : 0,
                  transform: showDropzone ? 'translateY(0)' : 'translateY(-20px)',
                  display: showDropzone ? 'block' : 'none',
                  marginTop: '20px',
                }}
              >
                <div
                  {...getRootProps()}
                  style={{
                    border: '2px dashed #ccc',
                    borderRadius: '10px',
                    // padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: isDragActive ? '#d1e7ff' : '#f9f9f9',
                    borderColor: isDragActive ? '#0069d9' : '#ccc',
                    padding: '100px',
                  }}
                >
                  <input {...getInputProps()} />
                  <p>Drag & Drop files here, or click to select files</p>
                  <ul>
                    {files.map(file => (
                      <li key={file.name} style={{ listStyleType: 'none', marginBottom: '10px' }}>
                        {getFileIcon(file)} <span>{file.name}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      opacity: 0.2,
                      fontSize: '50px',
                      color: '#000',
                    }}
                  >
                    <AiOutlineFile />
                  </div>
                </div>

                {errorMessage && (
                  <div style={{
                    color: 'red',
                    marginTop: '10px',
                    fontWeight: 'bold',
                  }}>
                    {errorMessage}
                  </div>
                )}

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <button
                    className="btn btn-danger"
                    onClick={handleCancel}
                    style={{
                      marginRight: '10px',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
            <div style={{ marginTop: '20px', marginLeft:'20px'}}>
            {/* Adjusted Table layout with header column on left and values column on right */}
            <Table bordered hover responsive>
              <tbody>
                <tr style={{ backgroundColor: '#f1f1f1' }}>
                  <td style={{ fontWeight: 'bold',  background:"#f7f7f7"}}>Submission Status</td>
                  <td style={{backgroundColor:'#cfefcf'}}>Submitted</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Grading Status</td>
                  <td>Pending</td>
                </tr>
                <tr style={{ backgroundColor: '#f1f1f1' }}>
                  <td style={{ fontWeight: 'bold' }}>Submission Time</td>
                  <td style={{ backgroundColor: '#cfefcf' }}>{toLondonTimeWithMinutes(submission?.updatedAt)}</td>
                </tr>
                <tr style={{ backgroundColor: '#f1f1f1 !important' }}>
                  <td style={{ fontWeight: 'bold',  backgroundColor:'#f7f7f7'}}>Grades</td>
                  <td style={{backgroundColor:'#f7f7f7'}}>
                    {
                      submission?.status === 'PENDING' ? 'Pending' : submission?.status === 'SUBMITTED' ? 'Submitted' : submission?.status === 'GRADED' ? 'Graded' : 'Rejected'
                    }
                    {submission?.obtained_marks}
                    </td>
                </tr>
              </tbody>
            </Table>
          </div>
          </>
          )}
              </>
            )
          }

        </div>
      </div>
    </div>
  );
}
