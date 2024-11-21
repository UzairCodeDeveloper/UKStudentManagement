import { useEffect, useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import { useDropzone } from 'react-dropzone';
import { AiOutlineFileAdd, AiFillFilePdf } from "react-icons/ai";
import { FaFileImage } from "react-icons/fa";
import '../../../../Admin/Classes/AddClass/AddClass.css'; // Ensure you have this CSS file for styles
import CourseManager from '../../../../../../api/services/teacher/course/courseManager';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddResource() {
  const [selectedResource, setSelectedResource] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading,setLoading]=useState(false)


  const navigate=useNavigate()
  // Updated resources array with id and label
  const resources = [
    { id: 'BOOK', label: 'Book' },
    { id: 'ASSIGNMENT', label: 'Assignment' },
    { id: 'SYLLABUS', label: 'Syllabus' },
    { id: 'HOMEWORK', label: 'Homework' },
    { id: 'OTHER', label: 'Other' }
  ];
  
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    setLoading(true)
    CourseManager.getResourcebyId(id)
      .then((res) => {
        console.log(res.data.data);
        setResourceTitle(res.data.data.title);
        setSelectedResource(res.data.data.resource_type.toUpperCase()); // Set the resource type to uppercase to match the ids
        setSelectedDate(res.data.data.due_date.split('T')[0]);
        setDescription(res.data.data.description);
        setLoading(false)
      })

      .catch((e) => {
        console.log(e);
        setLoading(false)
      });

  }, [id]); // Add id to dependencies

  const handleSubmit = (e) => {
    e.preventDefault();
    const resourceData = {
      resource_type: selectedResource, // Keep it uppercase
      title: resourceTitle,
      description: description,
      course_id: id,
      due_date:selectedDate
    };
    setLoading(true)
    CourseManager.updateResource(id,resourceData)
    .then((response) => {
        console.log('Resource uploaded successfully:', response.data);
        alert("Resource Updated successfully");
        
        // Reset fields after successful submission
        setResourceTitle('');
        setDescription('');
        setSelectedResource('');
        setSelectedDate('');
        setLoading(false)
        navigate(-1)
      })
      .catch((error) => {
        console.error('Error Updating resource:', error);
        setLoading(false)
        alert("Failed to Update resource");
      });
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
              <label htmlFor="selectResource" className="field-label required-bg">Select Resource*</label>
              <div className="input-wrapper">
                <select
                  id="selectResource"
                  className="form-input"
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                  required
                >
                  <option value="">Select Resource</option>
                  {resources.map((resource, index) => (
                    <option key={index} value={resource.id}>{resource.label}</option>
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


            <button type="submit" className="submit-button" style={{marginTop:'20px'}} disabled={loading}>
             {loading ? "Updating..." : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
