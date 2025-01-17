import { useState } from 'react';
import Swal from 'sweetalert2';
import { AiOutlineHome } from "react-icons/ai";
import { useDropzone } from 'react-dropzone';
import { AiOutlineFileAdd, AiFillFilePdf } from "react-icons/ai";
import { FaFileImage } from "react-icons/fa";
import '../../../../Admin/Classes/AddClass/AddClass.css'; // Ensure you have this CSS file for styles
import CourseManager from '../../../../../../api/services/teacher/course/courseManager'
import { useParams } from 'react-router-dom';

export default function AddResource() {
  const [selectedResource, setSelectedResource] = useState('');
  const [submissionRequired, setsubmissionRequired] = useState('No');
  const [resourceTitle, setResourceTitle] = useState('');
  const [description, setDescription] = useState(''); // State for description
  const [selectedDate, setSelectedDate] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalMarks, setTotalMarks] = useState("5")
  const resources = ['BOOK', 'ASSIGNMENT', 'SYLLABUS', 'HOMEWORK', 'QUIZ','OTHERS'];
  const submission = ['No', 'Yes']
  const params = useParams();
  const id = params.id;

  

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Prepare the data to be sent
    const resourceData = {
      resource_type: selectedResource,
      title: resourceTitle,
      description,
      course_id: id,
      due_date: selectedDate,
      pdf: uploadedFile,
      submissionRequired,
      totalMarks: totalMarks
    };
  
    // Show loading alert
    Swal.fire({
      title: 'Uploading Resource...',
      text: 'Please wait while we upload the resource.',
      // imageUrl: '/path-to-your-loader.gif', // Optional: You can add a custom loader image
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: 'Loading',
      showConfirmButton: false,
      allowOutsideClick: false, // Disable closing the modal during upload
      didOpen: () => {
        Swal.showLoading(); // Show loading spinner
      }
    });
  
    // Set loading state
    setLoading(true);
  
    CourseManager.uploadResource(resourceData)
      .then((response) => {
        setLoading(false);
        Swal.close(); // Close the loader
  
        // Show success message and navigate back
        Swal.fire({
          title: 'Success!',
          text: 'Resource assigned successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Navigate to the previous page after the success message is dismissed
          window.history.back(); // Go to the previous page
        });
  
        // Reset fields after successful submission
        setResourceTitle('');
        setDescription('');
        setSelectedResource('');
        setSelectedDate('');
        setTotalMarks('');
        setsubmissionRequired('');
        setUploadedFile(null);
      })
      .catch((error) => {
        setLoading(false);
        Swal.close(); // Close the loader
  
        // Show error message
        Swal.fire({
          title: 'Error!',
          text: 'Failed to upload resource. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  };
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0]; // Only take the first file
      if (
        file && (
          file.type.startsWith('image/') || 
          ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.ms-powerpoint', 'application/vnd.ms-excel', 'text/plain'].includes(file.type)
        )
      ) {
        setErrorMessage('');
        console.log(file);
        setUploadedFile(file); // Set only one file
      } else {
        setErrorMessage('Only files related to educational purposes (e.g., PDF, DOCX, PPTX, images) are allowed.');
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/msword': ['.doc'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.ms-excel': ['.xlsx'], // Ensure xlsx is here
      'text/plain': ['.txt'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDropRejected: () => {
      setErrorMessage('Unsupported file type. Please upload only educational-related files (e.g., PDF, DOCX, PPTX, images).');
    },
    multiple: false // Restrict to a single file
  });
  

  const removeFile = () => {
    setUploadedFile(null);
  };

  const shortenFileName = (name, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    return `${name.substring(0, maxLength)}...`;
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <FaFileImage style={{ color: '#4CAF50', fontSize: '20px', marginRight: '10px' }} />;
    } else if (fileType === 'application/pdf') {
      return <AiFillFilePdf style={{ color: '#FF5722', fontSize: '20px', marginRight: '10px' }} />;
    }
    return null;
  };

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div style={{ backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '30px', boxShadow: '0px 0px 1px 0px gray' }}>
        <h6>Resource <span style={{ fontWeight: '400' }}>| <AiOutlineHome className="sidebar-icon" style={{ marginRight: '5px' }} />- Add Resource</span></h6>
      </div>
      <div className='classContainer'>
        <div className='classBox'>
          <h5 style={{ marginBottom: '20px' }}>Add New Resource</h5>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor="selectClass" className="field-label required-bg">Select Resource*</label>
              <div className="input-wrapper">
                <select
                  id="selectClass"
                  className="form-input"
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                  required
                >
                  <option value="">Select Resource</option>
                  {resources.map((cls, index) => (
                    <option key={index} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='form-group' style={{ marginTop: '20px' }}>
              <label htmlFor="selectDate" className="field-label required-bg">Select Date*</label>
              <div className="input-wrapper">
                <input
                  type="date"
                  id="selectDate"
                  className="form-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='form-group AddClassFormGroup'>
              <label htmlFor={`subjectName`} className="field-label required-bg">Title Name*</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id={`subjectName`}
                  className="form-input"
                  placeholder="Enter Title name"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor="description" className="field-label required-bg">Description</label>
              <div className="input-wrapper">
                <textarea
                  id="description"
                  className="form-input"
                  placeholder="Enter description here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  style={{ border: 'none' }}
                />
              </div>
            </div>


            <div className='form-group' style={{ marginTop: '20px' }}>
              <label htmlFor="selectClass" className="field-label required-bg">Student Submission*</label>
              <div className="input-wrapper">
                <select
                  id="selectClass"
                  className="form-input"
                  value={submissionRequired}
                  onChange={(e) => setsubmissionRequired(e.target.value)}
                  required

                >
                  {/* <option value="">Select</option> */}
                  {submission.map((cls, index) => (
                    <option key={index} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>


            {/* {submissionRequired === 'Yes' && (
              <div className="form-group AddClassFormGroup">
                <label htmlFor={`subjectName`} className="field-label required-bg">
                  Total Marks*
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id={`subjectName`}
                    className="form-input"
                    placeholder="Enter Marks"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                  />
                </div>
              </div>
            )} */}

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="field-label required-bg">Upload Resource (PDF/Image)*</label>
              <div
                {...getRootProps()}
                className="dropzone"
                style={{
                  padding: '20px',
                  border: '2px dashed #cccccc',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the file here...</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AiOutlineFileAdd style={{ fontSize: '50px', color: '#cccccc' }} />
                    <p>Drag 'n' drop a file here, or click to select a file</p>
                  </div>
                )}
              </div>

              {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}

              {uploadedFile && (
                <ul style={{ marginTop: '10px' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {getFileIcon(uploadedFile.type)}
                      <span title={uploadedFile.name}>{shortenFileName(uploadedFile.name)}</span>
                    </div>
                    <button
                      type="button"
                      style={{
                        marginLeft: '10px',
                        backgroundColor: '#ff4d4d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        padding: '3px 8px'
                      }}
                      onClick={removeFile}
                    >
                      Cancel
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <button disabled={loading} type="submit" className='submit-button' style={{ marginTop: '20px', backgroundColor: '#ffc674', fontWeight: '400', color: 'black' }}>
              {
                loading ? 'Loading...' : 'Add Resource'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
