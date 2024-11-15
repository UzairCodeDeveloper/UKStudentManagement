import { useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import { useDropzone } from 'react-dropzone'; // Using react-dropzone for drag-and-drop
import { Table } from 'react-bootstrap'; // Importing the Table component from react-bootstrap
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileAlt } from 'react-icons/fa'; // Icons for different file types
import { AiOutlineFile } from 'react-icons/ai'; // File icon for watermark

export default function ShowClasses() {
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if submission has been made
  const [files, setFiles] = useState([]); // Store files for submission
  const [showDropzone, setShowDropzone] = useState(false); // To control visibility of dropzone
  const [submissionTime, setSubmissionTime] = useState(null); // Store submission time
  const [errorMessage, setErrorMessage] = useState(''); // To store error message if file type is incorrect

  const handleFileDrop = (acceptedFiles) => {
    setFiles(acceptedFiles); // Handle the files dropped
    setErrorMessage(''); // Reset error message if files are accepted
  };

  const handleDropRejected = (rejectedFiles) => {
    // Handle rejected files and show appropriate error message
    rejectedFiles.forEach(file => {
      if (file.errors[0].code === 'file-invalid-type') {
        setErrorMessage('Invalid file type. Please upload PDF, DOCX, or PPTX files only.');
      } else {
        setErrorMessage('File type is not supported.');
      }
    });
  };

  // React Dropzone for drag and drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      // Always keep files as an array
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]; // Only take the first file
        if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
          setErrorMessage('');
          setFiles([file]); // Set files as an array with one file
        } else {
          setErrorMessage('Only image or PDF files are allowed.');
        }
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      // 'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDropRejected: () => {
      setErrorMessage('Unsupported file type. Only PDF or image files are allowed.');
    },
    multiple: false // Restrict to a single file
  });

  // Handle submission action
  const handleSubmit = () => {
    setIsSubmitted(true);
    setSubmissionTime(new Date().toLocaleString()); // Record the submission time
    setShowDropzone(false); // Hide the dropzone after submission
  };

  // Handle cancel action
  const handleCancel = () => {
    setShowDropzone(false); // Hide the dropzone without submitting
    setFiles([]); // Clear files
  };

  // Function to render file type icons based on file extension
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

        {/* Search Bar */}
        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>Quran Assignemnt 1</h1>
        </div>

        <div style={{ marginTop: '100px' }}>
          <h3 style={{ marginLeft: '20px' }}>Submission Status</h3>
          <div style={{marginLeft:'20px', marginTop:'50px'}}>
          <h5>Assignment Description:</h5>
          <p>Upload the Assignment on Proper Time and In PDF Formate</p>
          </div>
          {!isSubmitted ? (
            <div>
              <div style={{ margin: '20px 0', fontSize: '16px',  display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap', flexDirection:'column'}} >
                <p style={{marginLeft:'20px', color:'red'}}>No submission yet</p>
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

              {/* Dropzone with smooth animation and visual feedback */}
              <div
                style={{
                  transition: 'all 0.5s ease-in-out',
                  opacity: showDropzone ? 1 : 0,
                  transform: showDropzone ? 'translateY(0)' : 'translateY(-20px)',
                  display: showDropzone ? 'block' : 'none', // Make sure it's removed from layout when hidden
                  marginTop: '20px',
                  
                }}
              >
                <div
                  {...getRootProps()}
                  style={{
                    border: '2px dashed #ccc',
                    borderRadius: '10px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: isDragActive ? '#d1e7ff' : '#f9f9f9', // Change background color when dragging
                    borderColor: isDragActive ? '#0069d9' : '#ccc', 
                    // Highlight border on drag
                    padding:'100px'
                  }}
                >
                  <input {...getInputProps()} 
                    
                  />
                  <p>Drag & Drop files here, or click to select files</p>
                  <ul>
                    {files.map(file => (
                      <li key={file.name} style={{ listStyleType: 'none', marginBottom: '10px' }}>
                        {getFileIcon(file)} <span>{file.name}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Watermark file icon */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      opacity: 0.2, // Make it look like a watermark
                      fontSize: '50px',
                      color: '#000',
                    }}
                  >
                    <AiOutlineFile />
                  </div>
                </div>

                {/* Error Message for Invalid File Type */}
                {errorMessage && (
                  <div style={{
                    color: 'red',
                    marginTop: '10px',
                    fontWeight: 'bold',
                  }}>
                    {errorMessage}
                  </div>
                )}

                {/* Cancel and Submit Buttons */}
                <div style={{ marginTop: '20px', display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap', gap:'20px' }}>
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
                    className="btn btn-success"
                    onClick={handleSubmit}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: files.length > 0 ? 'inline-block' : 'none',
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ) : (
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
                    <td style={{backgroundColor:'#cfefcf'}}>{submissionTime}</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f1f1f1 !important' }}>
                    <td style={{ fontWeight: 'bold',  backgroundColor:'#f7f7f7'}}>Grades</td>
                    <td style={{backgroundColor:'#f7f7f7'}}>Pending</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
