import React, { useState, useEffect } from 'react';
import { AiOutlineHome, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Loader from '../../../../../components/Loader/Loader'; // Import the Loader component
import './CourseResources.css';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlinePlus } from "react-icons/ai"; // Import icons
import CourseManager from '../../../../../api/services/teacher/course/courseManager'
export default function ShowStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('a-z');
  const [loading, setLoading] = useState(true); // State to track loading
  const [students, setStudents] = useState([]); // State for students
  const [refresh, setRefresh] = useState(false); 
  
  const [resourceData,setResourceData]=useState([])
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id
  const handleEdit = (id) => {
    navigate(`/courseResources/edit/${id}`);
  };


  useEffect(() => {
    setLoading(true);
    CourseManager.getResourcesByCourse(id)
      .then((res) => {
        setResourceData(res.data.data);
        console.log(res.data.data)
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [refresh]);




  // Use dummy data for students
  useEffect(() => {
    setLoading(true);
    
    // Dummy data for students
    const dummyStudents = [
      { _id: 1, user_id: '101', studentData: { forename: 'John', surname: 'Doe' } },
      { _id: 2, user_id: '102', studentData: { forename: 'Jane', surname: 'Smith' } },
      { _id: 3, user_id: '103', studentData: { forename: 'Michael', surname: 'Johnson' } },
      { _id: 4, user_id: '104', studentData: { forename: 'Emily', surname: 'Davis' } },
    ];

    setStudents(dummyStudents);
    setLoading(false);
  }, [refresh]);

  // Filter and sort students based on search term and selected order
  const filteredResources = resourceData
    .filter(resource =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return sortOrder === 'a-z' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
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
        // If user confirms the action
        if (result.isConfirmed) {
          // Call the delete API
          CourseManager.deleteResource(id)
            .then((res) => {
              console.log(res.data);
              // Show success notification using SweetAlert2
              Swal.fire({
                title: "Deleted!",
                text: "Resource been deleted successfully.",
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
                text: err.response?.data?.msg || "Something went wrong while deleting the session.",
                icon: "error",
                confirmButtonColor: "#d33"
              });
            });
        }
      });
    }

  if (loading) {
    return <Loader />; // Show the loader if loading
  }

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="table-container">
        <div className="students-container" style={{ backgroundColor: 'white' }}>
          <div className="header">
            <h6>
              Course<span className="sub-header"><AiOutlineHome className="sidebar-icon" />- All Resources</span>
            </h6>
          </div>

          {/* Search Bar */}
          <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
            <h1>Resources</h1>
          </div>
          <div className="search-filter" style={{ marginTop: '50px' }}>
            <div>
              <span style={{ fontWeight: '600', marginRight: '20px' }}>Search </span>
              <input
                type="text"
                placeholder="Search by Resource"
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
          <div style={{display:'flex', justifyContent:'center', flexWrap:'wrap'} }>

         
          <button type="button" className='btn btn-primary'  style={{ display: 'flex', alignItems: 'center',  fontSize:'15px', padding:"5px 10px"}} onClick={()=>{navigate(`/addresource/${id}`)}}>
                <AiOutlinePlus style={{ marginRight: '5px' }} /> Add Resources
              </button>
              </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Resources</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((student,key) => (
                <tr key={student._id}>
                  <td>{key+1}</td>
                  <td><a href={student.resource_url} target='_blank'>{student.title}</a></td>
                  {
                    (student?.due_date === null) ? <td>Not Set</td> : <td>{new Date(student?.due_date).toLocaleDateString()}</td>
                  }
                  {/* <td>{new Date(student?.due_date).toLocaleDateString()}</td> */}
                  <td className="status-buttons">
                    <button className="btn btn-edit" onClick={() => handleEdit(student._id)}>
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
