import React, { useState, useEffect } from 'react';
import { AiOutlineHome, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Loader from '../../../../../components/Loader/Loader'; // Import the Loader component
import Swal from 'sweetalert2'; // Ensure you have SweetAlert2 installed and imported
import CourseManager from "../../../../../api/services/admin/course/courseManager.js"

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
  // Filter by course name instead of subjects if subjects field is not present
  .filter(classItem => 
    classItem.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const classNameA = a.class_id?.class_name || '';  // Ensure fallback to empty string
    const classNameB = b.class_id?.class_name || '';  // Same fallback

    if (sortOrder === 'a-z') {
      return classNameA.localeCompare(classNameB);  // Compare class names alphabetically
    } else {
      return classNameB.localeCompare(classNameA);  // Reverse alphabetical
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
            Subjects <span className="sub-header"><AiOutlineHome className="sidebar-icon" />- All Subjects</span>
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
              placeholder="Search by Subject Name"
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
                <th>Instructor</th>
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
                    <td>
                    
                    {/* {classItem.subjects.join(', ')} */}
                    {classItem?.instructor?.volunteer_details?.full_name}
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
    // Show confirmation dialog with SweetAlert2
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      // If user confirms the action
      if (result.isConfirmed) {
        // Call the delete API
        CourseManager.deleteCourse(id)
          .then((res) => {
            console.log(res.data);
            // Show success notification using SweetAlert2
            Swal.fire({
              title: "Deleted!",
              text: "Course has been deleted successfully.",
              icon: "success",
              confirmButtonColor: "#3085d6"
            });
            // Trigger re-fetch by toggling refresh state
            setRefresh(!refresh);
          })
          .catch((err) => {
            console.error(err);
            // Show error notification using SweetAlert2
            Swal.fire({
              title: "Error!",
              text: err.response?.data?.msg || "Something went wrong while deleting the course.",
              icon: "error",
              confirmButtonColor: "#d33"
            });
          });
      } else {
        // Log or handle cancellation
        console.log("Course deletion canceled by user");
      }
    });
  }
  


}
