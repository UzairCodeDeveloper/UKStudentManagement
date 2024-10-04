import React, { useState, useEffect } from 'react';
import { AiOutlineHome, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Loader from '../../../../components/Loader/Loader'; // Import the Loader component


export default function ShowClasses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('a-z');
  const [loading, setLoading] = useState(true); // State to track loading
  const [classes, setClasses] = useState([]); // State for classes

  useEffect(() => {
    // Simulate fetching data with a delay
    setTimeout(() => {
      // Replace this with your actual data fetching logic
      setClasses([
        { id: 1, name: 'Mathematics', teachers: ['John Doe', 'Jane Smith'], subjects: ['Algebra', 'Geometry'] },
        { id: 2, name: 'Science', teachers: ['Sara Connor', 'Mark Johnson'], subjects: ['Physics', 'Chemistry'] },
        { id: 3, name: 'History', teachers: ['Emma Watson'], subjects: ['Ancient Civilizations', 'Modern History'] },
      ]);
      setLoading(false); // Set loading to false after data is fetched
    }, 2000); // Simulating a 2-second delay
  }, []);

  // Filter and sort classes based on search term and selected order
  const filteredClasses = classes
    .filter(classItem => classItem.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'a-z') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
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
              <th>Teachers</th>
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((classItem, index) => (
              <tr key={classItem.id}>
                <td>{index + 1}</td> {/* Dynamic row number */}
                <td>{classItem.name}</td>
                <td>{classItem.teachers.join(', ')}</td>
                <td>{classItem.subjects.join(', ')}</td>
                <td className="status-buttons">
                  <button className="btn btn-edit" onClick={() => handleEdit(classItem.id)}>
                    <AiOutlineEdit />
                  </button>
                  <button className="btn btn-delete" onClick={() => handleDelete(classItem.id)}>
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
    console.log(`Delete class with ID: ${id}`);
    // Implement delete functionality here
  }
}
