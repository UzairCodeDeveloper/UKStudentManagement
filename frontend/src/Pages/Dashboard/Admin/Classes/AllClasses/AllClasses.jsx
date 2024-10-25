import { useState, useEffect } from 'react';
import { AiOutlineHome, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Loader from '../../../../../components/Loader/Loader'; // Import the Loader component
import Swal from 'sweetalert2'; // Ensure you have SweetAlert2 installed and imported

import ClassManager from "../.././../../../api/services/admin/class/classManager"


export default function ShowClasses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('a-z');
  const [loading, setLoading] = useState(true); // State to track loading
  const [classes, setClasses] = useState([]); // State for classes
  const [refresh, setRefresh] = useState(false); // State to trigger refetch

  // useEffect(() => {
  //   // Simulate fetching data with a delay
  //   setTimeout(() => {
  //     // Replace this with your actual data fetching logic
  //     setClasses([
  //       { id: 1, name: 'Class 1', teachers: ['John Doe', 'Jane Smith'], subjects: ['Algebra', 'Geometry'] },
  //       { id: 2, name: 'Class 2', teachers: ['Sara Connor', 'Mark Johnson'], subjects: ['Physics', 'Chemistry'] },
  //       { id: 3, name: 'Class 3', teachers: ['Emma Watson'], subjects: ['Ancient Civilizations', 'Modern History'] },
  //     ]);
  //     setLoading(false); // Set loading to false after data is fetched
  //   }, 2000); // Simulating a 2-second delay
  // }, []);

  useEffect(() => {
    setLoading(true);
    ClassManager.getAllClasses()
      .then((res) => {
        
        setClasses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [refresh]);

  // Filter and sort classes based on search term and selected order
  const filteredClasses = classes
  .filter(classItem => classItem.class_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  .sort((a, b) => {
    const nameA = a.class_name || '';  // Fallback to empty string if class_name is undefined
    const nameB = b.class_name || '';
    
    if (sortOrder === 'a-z') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });


  if (loading) {
    return <Loader />; // Show the loader if loading
  }

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow:"auto" }}>
    <div className="classes-container">
      <div className="header">
        <h6>
          Classes <span className="sub-header"><AiOutlineHome className="sidebar-icon" />- All Classes</span>
        </h6>
      </div>

      {/* Search Bar */}
      <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
        <h1>Classes Record</h1>
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

      <div className="table-container">
        <table 
          className="table" 
          style={{ 
            background: "linear-gradient(to right, #007bff, #003f7f)", 
            color: '#fff', // Text color for better contrast
            borderCollapse: 'collapse', // Ensures borders collapse correctly
            width: '100%', // Full width
          }} 
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Class Name</th>
              <th>Session</th>
              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredClasses.map((classItem, index) => (
  <tr key={classItem?._id}>
    <td>{index + 1}</td> {/* Dynamic row number */}
    <td>{classItem?.class_name}</td> {/* Class Name */}
    <td>
      {classItem?.session?.session_year} {/* Teachers */}
    </td>
    
    <td className="status-buttons">
      {/* <button className="btn btn-edit" onClick={() => handleEdit(classItem._id)}>
        <AiOutlineEdit />
      </button> */}
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
      ClassManager.deleteClass(id)
        .then((res) => {
          console.log(res.data);
          // Show success notification using SweetAlert2
          Swal.fire({
            title: "Deleted!",
            text: "Class has been deleted successfully.",
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
            text: err.response?.data?.msg || "Something went wrong while deleting the class.",
            icon: "error",
            confirmButtonColor: "#d33"
          });
        });
    } else {
      
    }
  });
}


}
