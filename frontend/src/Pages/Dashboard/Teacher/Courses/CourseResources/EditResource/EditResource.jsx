import { useEffect, useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import { useDropzone } from 'react-dropzone';
import { AiOutlineFileAdd, AiFillFilePdf } from "react-icons/ai";
import { FaFileImage } from "react-icons/fa";
import '../../../../Admin/Classes/AddClass/AddClass.css'; // Ensure you have this CSS file for styles
import CourseManager from '../../../../../../api/services/teacher/course/courseManager';
import { useParams } from 'react-router-dom';

export default function AddResource() {
  const [selectedResource, setSelectedResource] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const resources = ['Book', 'Assignment', 'Syllabus', 'HomeWork', 'Other resourceTitle'];
  const params = useParams();
  const id = params.id; // Ensure correct variable naming

  useEffect(() => {
    CourseManager.getResourcebyId(id)
      .then((res) => {
        console.log(res.data);
        setResourceTitle(res.data.title);
        setSelectedResource(res.data.resource_type.charAt(0).toUpperCase() + res.data.resource_type.slice(1).toLowerCase()); // Converts 'ASSIGNMENT' to 'Assignment'
        setSelectedDate(res.data.due_date.split('T')[0]); // Extract just the date
        setDescription(res.data.description);

        // Assuming resource_url contains the uploaded file URL
        if (res.data.resource_url) {
          setUploadedFiles([{ url: res.data.resource_url, name: res.data.title, type: 'application/pdf' }]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []); // Add id to dependencies

  const handleSubmit = (e) => {
    e.preventDefault();
    const resourceData = {
      resource_type: selectedResource.toUpperCase(),
      title: resourceTitle,
      description: description,
      course_id: id,
      pdf: uploadedFiles // Assuming this is where you send the uploaded files
    };

    CourseManager.uploadResource(resourceData)
      .then((response) => {
        console.log('Resource uploaded successfully:', response.data);
        alert("Resource assigned successfully");

        // Reset fields after successful submission
        setResourceTitle('');
        setDescription('');
        setSelectedResource('');
        setSelectedDate('');
        setUploadedFiles([]);
      })
      .catch((error) => {
        console.error('Error uploading resource:', error);
        alert("Failed to upload resource");
      });
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

      setUploadedFiles(prevFiles => [
        ...prevFiles,
        ...validFiles.map(file => ({ url: URL.createObjectURL(file), name: file.name, type: file.type }))
      ]);
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

  const removeFile = (fileToRemove) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.name !== fileToRemove.name));
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
        <h6>Resource <span style={{ fontWeight: '400' }}>| <AiOutlineHome className="sidebar-icon" style={{ marginRight: '5px' }} />- Update Resource</span></h6>
      </div>
      <div className='classContainer'>
        <div className='classBox'>
          <h5 style={{ marginBottom: '20px' }}>Update Resource</h5>
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
                    <option key={index} value={cls.toUpperCase()}>{cls}</option> // Ensure value is in uppercase
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
                  style={{ border: 'none' }}
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
              {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
            </div>

            {/* Display Uploaded Files */}
            <div className="uploaded-files">
              <h6 style={{ marginTop: '20px' }}>Uploaded Files:</h6>
              {uploadedFiles.map((file) => (
                <div key={file.name} style={{ display: 'flex', alignItems: 'space-between', margin: '5px 0', justifyContent:'space-between'}}>
                <div>
                  {getFileIcon(file.type)}
                  
                  <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>
                    {file.name}
                  </a>
                  </div>
                  <button onClick={() => removeFile(file)} style={{ background: '#ff4d4d', border: 'none', color: 'white', cursor: 'pointer' }} className='btn btn-warning'>
                    Cancel
                  </button>
                  
                </div>
              ))}
            </div>

            <button type="submit" className="submit-button">Update Resource</button>
          </form>
        </div>
      </div>
    </div>
  );
}
