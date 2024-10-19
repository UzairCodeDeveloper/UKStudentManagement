import { useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import { useDropzone } from 'react-dropzone';
import { AiOutlineFileAdd, AiFillFilePdf } from "react-icons/ai";
import { FaFileImage } from "react-icons/fa";
import '../../../../Admin/Classes/AddClass/AddClass.css'; // Ensure you have this CSS file for styles

export default function AddResource() {
  const [selectedResource, setSelectedResource] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [description, setDescription] = useState(''); // State for description
  const [selectedDate, setSelectedDate] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const resources = ['Book', 'Assignment', 'Syllabus', 'HomeWork', 'Other resourceTitle'];

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      class_id: selectedResource,
      course_name: resourceTitle,
      description, // Include description in the submission
      selectedDate,
      uploaded_files: uploadedFiles
    });

    // Reset fields after submission
    setResourceTitle('');
    setDescription('');
    setSelectedResource('');
    setSelectedDate('');
    setUploadedFiles([]);
    alert("Resource assigned successfully");
  };

  // React Dropzone for drag-and-drop functionality
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      const validFiles = acceptedFiles.filter(file =>
        file.type.startsWith('image/') || file.type === 'application/pdf'
      );

      if (validFiles.length < acceptedFiles.length) {
        setErrorMessage('Only image or PDF files are allowed.');
      } else {
        setErrorMessage('');
      }

      setUploadedFiles(prevFiles => [...prevFiles, ...validFiles]);
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDropRejected: () => {
      setErrorMessage('Unsupported file type. Only PDF or image files are allowed.');
    },
    multiple: true
  });

  const removeFile = (file) => {
    setUploadedFiles(prevFiles => prevFiles.filter(f => f !== file));
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
            {/* Select Resource Dropdown */}
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


             {/* Select Date */}
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


            {/* Title Name */}
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

            {/* Description Textarea */}
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
                  style={{border:'none'}}
                />
              </div>
            </div>

           

            {/* Drag and Drop Zone */}
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="field-label required-bg">Upload Resources (PDF/Images)*</label>
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
                  <p>Drop the files here...</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AiOutlineFileAdd style={{ fontSize: '50px', color: '#cccccc' }} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                )}
              </div>

              {/* Error Message for unsupported file types */}
              {errorMessage && (
                <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
              )}

              {/* Display uploaded files with cancel button and icons */}
              {uploadedFiles.length > 0 && (
                <ul style={{ marginTop: '10px' }}>
                  {uploadedFiles.map((file, index) => (
                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* File Type Icon */}
                        {getFileIcon(file.type)}
                        {/* Shortened file name with tooltip */}
                        <span title={file.name}>{shortenFileName(file.name)}</span>
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
                        onClick={() => removeFile(file)}
                      >
                        Cancel
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="submit" className='submit-button' style={{ marginTop: '20px', backgroundColor: '#ffc674', fontWeight: '400', color: 'black' }}>
             Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
