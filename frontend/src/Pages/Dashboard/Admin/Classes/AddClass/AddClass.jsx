import React, { useState, useEffect } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import './AddClass.css'; // Ensure you have this CSS file for styles

export default function AddClass() {
  const [className, setClassName] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dummy teacher data
  const teachers = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Mickel' },
    { id: '3', name: 'Fiza' },
    { id: '4', name: 'Hafsa' },
  ];

  useEffect(() => {
    const fetchTeachers = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    fetchTeachers();
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const teacher = teachers.find(t => t.id === value);

    if (checked) {
      setSelectedTeachers([...selectedTeachers, teacher.name]);
    } else {
      setSelectedTeachers(selectedTeachers.filter(name => name !== teacher.name));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if at least one teacher is selected
    if (selectedTeachers.length === 0) {
      alert("Please select at least one teacher.");
      return;
    }

    // Log class name and selected teachers
    console.log({ className, selectedTeachers });
    
    // Clear input fields
    setClassName('');
    setSelectedTeachers([]);
  };

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div style={{ backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '30px', boxShadow: '0px 0px 1px 0px gray' }}>
        <h6>Class <span style={{ fontWeight: '400' }}>| <AiOutlineHome className="sidebar-icon" style={{ marginRight: '5px' }} />- Add Class</span></h6>
      </div>
      <div className={`classContainer ${isLoading ? 'loading' : ''}`}>
        <div className='classBox'>
          <h5>Add New Class</h5>
          <form onSubmit={handleSubmit}>
            <div className='form-group AddClassFormGroup'>
              <label htmlFor="className" className="field-label required-bg">Class Name*</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="className"
                  className="form-input"
                  placeholder="Enter class name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required // Mark as required
                />
              </div>
            </div>

            <div className="certificate-section">
              <label className="certificate-label required-bg" style={{ fontSize: '12px' }}>Select Teachers*</label>
              
              <div className="checkbox-list btn-group" role="group" aria-label="Teacher Selection Toggle Button Group" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="checkbox-item" style={{ margin: '10px' }}>
                    <input
                      type="checkbox"
                      id={teacher.id}
                      value={teacher.id}
                      checked={selectedTeachers.includes(teacher.name)}
                      onChange={handleCheckboxChange}
                      className="btn-check"
                      autoComplete="off"
                    />
                    <label htmlFor={teacher.id} className="btn btn-outline-primary">
                      {teacher.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className='submit-button'>Add Class</button>
          </form>
        </div>
      </div>
    </div>
  );
}
