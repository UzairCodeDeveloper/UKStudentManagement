import React, { useState, useEffect } from 'react';
import { AiOutlineHome, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Loader from '../../../../../components/Loader/Loader'; // Import the Loader component
import '../../../Teacher/Courses/CourseResources/CourseResources.css';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlinePlus } from "react-icons/ai"; // Import icons
import CourseManager from '../../../../../api/services/student/CourseManager'
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
    CourseManager.getDetailedCourse(id)
      .then((res) => {
        // Filter to include only resources with types 'BOOK', 'SYLLABUS', and 'OUTLINE'
        const filteredResources = res.data.data.filter(resource => 
          ['BOOK', 'SYLLABUS', 'OUTLINE'].includes(resource.resource_type)
        );
  
        setResourceData(filteredResources); // Set only the filtered resources
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
   

    

  if (loading) {
    return <Loader />; // Show the loader if loading
  }

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="table-container">
        <div className="students-container" style={{ backgroundColor: 'white' }}>
          <div className="header">
            <h6>
              Course<span className="sub-header"><AiOutlineHome className="sidebar-icon" />- All Handouts</span>
            </h6>
          </div>

          {/* Search Bar */}
          <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
            <h1>Handouts</h1>
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

              </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Resources</th>
                <th>Date</th>
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
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
