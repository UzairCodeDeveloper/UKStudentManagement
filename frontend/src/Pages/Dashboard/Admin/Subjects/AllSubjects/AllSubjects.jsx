import React, { useState, useEffect } from 'react';
import { AiOutlineHome, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Loader from '../../../../../components/Loader/Loader'; // Import the Loader component

import CourseManager from "../.././../../../api/services/admin/course/courseManager"

export default function ShowClasses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('a-z');
  const [loading, setLoading] = useState(true); // State to track loading
  const [classes, setClasses] = useState([]); // State for classes
  const [refresh, setRefresh] = useState(false)

  // useEffect(() => {
  //   // Simulate fetching data with a delay
  //   setTimeout(() => {
  //     // Replace this with your actual data fetching logic
  //     setClasses([
  //       { id: 1, name: 'Class 1', subjects: ['Algebra', 'Geometry'] },
  //       { id: 2, name: 'Class 2', subjects: ['Physics', 'Chemistry'] },
  //       { id: 3, name: 'Class 3', subjects: ['Ancient Civilizations', 'Modern History'] },
  //     ]);
  //     setLoading(false); // Set loading to false after data is fetched
  //   }, 2000); // Simulating a 2-second delay
  // }, []);


  useEffect(()=>{
    setLoading(true);
    CourseManager.getAllCourses()
    .then((res)=>{
      console.log(res.data)
      setClasses(res.data);
      setLoading(false);

    })
    .catch((err)=>{
      console.log(err)
      setLoading(false);
    })
  },[refresh])

  // Filter and sort classes based on search term and selected order
  const filteredClasses = classes
    // .filter(classItem => classItem.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'a-z') {
        // return a.name.localeCompare(b.name);
      } else {
        // return b.name.localeCompare(a.name);
      }
    });

  if (loading) {
    return <Loader />; // Show the loader if loading
  }

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            Classes <span className="sub-header"><AiOutlineHome className="sidebar-icon" />- All Subjects</span>
          </h6>
        </div>

        {/* Search Bar */}
        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>Subjects Record</h1>
        </div>
        <div className="search-filter" style={{ marginTop: '50px' }}>
          <div>
            <span style={{ fontWeight: '600', marginRight: '20px' }}>Search </span>
            <input
              type="text"
              placeholder="Search by Class Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              required
            />
          </div>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>

        <div className="table-container" style={{ marginTop: '30px' }}>
          <table 
            className="table" 
            style={{ 
              background: "#fff", 
              color: '#000', // Text color for better contrast
              borderCollapse: 'collapse', // Ensures borders collapse correctly
              width: '100%', // Full width
            }} 
          >
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Subjects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((classItem) => (
                <tr key={classItem._id}>
                  <td>
                    {/* {classItem.course_name} */}
                  {classItem.class_id.class_name}
                  </td>
                  <td>
                    
                    {/* {classItem.subjects.join(', ')} */}
                    {classItem.course_name}
                    </td>
                  <td className="status-buttons">
                    <button className="btn btn-edit" onClick={() => handleEdit(classItem.id)}>
                      <AiOutlineEdit />
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(classItem._id)}>
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Add your edit and delete functions
  function handleEdit(id) {
    console.log(`Edit class with ID: ${id}`);
    // Implement edit functionality here
  }

  function handleDelete(id) {
    const isConfirmed = window.confirm("Are you sure you want to delete this course?");
  
    if (isConfirmed) {
      CourseManager.deleteCourse(id)
        .then((res) => {
          console.log(res.data);
          alert("Class Deleted Successfully");
          setRefresh(!refresh); // Toggle refresh to trigger re-fetch
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data.msg);
        });
    } else {
      console.log("Class deletion canceled by user");
    }
  }


}
