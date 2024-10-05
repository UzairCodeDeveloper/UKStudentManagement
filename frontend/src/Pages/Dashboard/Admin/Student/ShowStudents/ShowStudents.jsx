import React, { useState, useEffect } from 'react';
import { AiOutlineHome, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Loader from '../../../../../components/Loader/Loader'; // Import the Loader component
import './ShowStudents.css'; // Import the CSS file

export default function ShowStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('a-z');
  const [loading, setLoading] = useState(true); // State to track loading
  const [students, setStudents] = useState([]); // State for students

  useEffect(() => {
    // Simulate fetching data with a delay
    setTimeout(() => {
      // Replace this with your actual data fetching logic
      setStudents([
        { id: 1, forename: 'Mark', surname: 'Otto', contact: '(123) 456-7890' },
        { id: 2, forename: 'Jacob', surname: 'Thornton', contact: '(987) 654-3210' },
        { id: 3, forename: 'Larry', surname: 'Bird', contact: '(555) 123-4567' },
      ]);
      setLoading(false); // Set loading to false after data is fetched
    }, 2000); // Simulating a 2-second delay
  }, []);

  // Filter and sort students based on search term and selected order
  const filteredStudents = students
    .filter(student => student.forename.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'a-z') {
        return a.forename.localeCompare(b.forename);
      } else {
        return b.forename.localeCompare(a.forename);
      }
    });

  if (loading) {
    return <Loader />; // Show the loader if loading
  }

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
    <div className="table-container" >
    <div className="students-container" style={{backgroundColor:'white'}}>
     
      <div className="header">
        <h6>
          Students <span className="sub-header"><AiOutlineHome className="sidebar-icon" />- All Students</span>
        </h6>
      </div>

      {/* Search Bar */}
      <div className="container-fluid admission-header text-center " style={{marginTop:'30px'}}>
        <h1>Students Record</h1>
      </div>
      <div className="search-filter" style={{marginTop:'50px'}}>
        <div>
          <span style={{fontWeight:'600', marginRight:'20px' }}>Search </span>
          <input
            type="text"
            placeholder="Search by Forename"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
        </select>
      </div>

      
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Forename</th>
              <th>Surname</th>
              <th>Contact No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.forename}</td>
                <td>{student.surname}</td>
                <td>{student.contact}</td>
                <td className="status-buttons">
                  <button className="btn btn-edit">
                    <AiOutlineEdit />
                  </button>
                  <button className="btn btn-delete">
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
}
