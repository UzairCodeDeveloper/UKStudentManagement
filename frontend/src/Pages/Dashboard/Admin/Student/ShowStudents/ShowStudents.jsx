import React, { useState, useEffect } from 'react';
import { AiOutlineHome, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Loader from '../../../../../components/Loader/Loader'; // Import the Loader component
import './ShowStudents.css'; // Import the CSS file
import Swal from 'sweetalert2';
import StudentServices from "../../../../../api/services/admin/student/studentManager";
import { useNavigate } from 'react-router-dom';

export default function ShowStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('a-z');
  const [loading, setLoading] = useState(true); // State to track loading
  const [students, setStudents] = useState([]); // State for students
  const [refresh, setRefresh] = useState(false); 

  const navigate=useNavigate()
  const handleEdit=(id)=>{
    
    navigate(`/students/edit/${id}`)

  }
  

  useEffect(()=>{
    setLoading(true);
    StudentServices.getAllStudents()
    .then((response) => {
      setStudents(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    }
    )

  },[refresh])
  

  // Filter and sort students based on search term and selected order
  const filteredStudents = students
  .filter(student => student?.studentData?.forename?.toLowerCase().includes(searchTerm.toLowerCase()))
  .sort((a, b) => {
    const forenameA = a.studentData?.forename || '';
    const forenameB = b.studentData?.forename || '';
    
    if (sortOrder === 'a-z') {
      return forenameA.localeCompare(forenameB);
    } else {
      return forenameB.localeCompare(forenameA);
    }
  });


 

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
      if (result.isConfirmed) {
        // Call the delete API if user confirms the action
        StudentServices.deleteStudent(id)
          .then((res) => {
            console.log(res.data);
            // Show success notification using SweetAlert2
            Swal.fire({
              title: "Deleted!",
              text: "Student has been deleted successfully.",
              icon: "success",
              confirmButtonColor: "#3085d6"
            });
            // Toggle refresh to trigger re-fetch
            setRefresh(!refresh);
          })
          .catch((err) => {
            console.error(err);
            // Show error notification using SweetAlert2
            Swal.fire({
              title: "Error!",
              text: err.response?.data?.msg || "Something went wrong while deleting the student.",
              icon: "error",
              confirmButtonColor: "#d33"
            });
          });
      } else {
        // Log or handle cancel action if needed
        console.log("Student deletion canceled by user");
      }
    });
  }
  

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
              <tr key={student._id}>
                <td>{student.user_id}</td>
                <td>{student.studentData.forename}</td>
                <td>{student.studentData.surname}</td>
                <td>{student.studentData.guardianDetails.primaryContactNumber}</td>
                <td className="status-buttons">
                  <button className="btn btn-edit" onClick={()=>{handleEdit(student._id)}}>
                    <AiOutlineEdit />
                  </button>
                  <button className="btn btn-delete" onClick={() => handleDelete(student._id)}>
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
