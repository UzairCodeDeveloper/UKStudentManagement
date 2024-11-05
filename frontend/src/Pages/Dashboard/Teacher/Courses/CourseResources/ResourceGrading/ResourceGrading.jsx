import { useState, useEffect } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import Loader from '../../../../../../components/Loader/Loader'; 
import Swal from 'sweetalert2';

export default function ShowClasses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('a-z');
  const [loading, setLoading] = useState(true); 
  const [classes, setClasses] = useState([]); 
  const [refresh, setRefresh] = useState(false); 

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setClasses([
        { id: 1, reg_no: '101', name: 'John Doe', status: 'submitted', file: 'Assignment1.pdf', grade: '' },
        { id: 2, reg_no: '102', name: 'Jane Smith', status: 'not submitted', file: '', grade: '' },
        { id: 3, reg_no: '103', name: 'Sara Connor', status: 'submitted', file: 'Project.pdf', grade: '' },
      ]);
      setLoading(false);
    }, 2000);
  }, [refresh]);

  const filteredClasses = classes
    .filter(classItem => classItem.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const nameA = a.name || '';  
      const nameB = b.name || '';
      return sortOrder === 'a-z' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  if (loading) {
    return <Loader />; 
  }

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow:"auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            Resource <span className="sub-header"><AiOutlineHome className="sidebar-icon" />- Resource Grading</span>
          </h6>
        </div>

        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>Assignment 1</h1>
        </div>
        <div className="search-filter" style={{ marginTop: '50px' }}>
          <div>
            <span style={{ fontWeight: '600', marginRight: '20px' }}>Search </span>
            <input
              type="text"
              placeholder="Search by Name"
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
              color: '#fff',
              borderCollapse: 'collapse',
              width: '100%',
            }} 
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Reg No</th>
                <th>Name</th>
                <th>Status</th>
                <th>File</th>
                <th>Grade (/5)</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((classItem, index) => (
                <tr key={classItem.id}>
                  <td>{index + 1}</td>
                  <td>{classItem.reg_no}</td>
                  <td>{classItem.name}</td>
                  <td style={{ color: classItem.status === 'submitted' ? 'green' : 'red', fontWeight:'600' }}>
                    {classItem.status === 'submitted' ? 'Submitted' : 'Not Submitted'}
                  </td>
                  <td>
                    {classItem.file ? (
                      <a href="#"  style={{ color: '' }}>{classItem.file}</a>
                    ) : 'No File'}
                  </td>
                  <td>
                    <input
                      type="number"
                      max="5"
                      min="0"
                      value={classItem.grade}
                      onChange={(e) => handleGradeChange(e, classItem.id)}
                      style={{ width: '60px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{display:'flex', justifyContent:"center", alignItems:'center', flexWrap:'wrap'}}>
        <button onClick={handleSubmit} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#3085d6', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Submit Grades
        </button>
        </div>
        
      </div>
    </div>
  );

  function handleGradeChange(event, id) {
    const value = event.target.value;
    
    // Ensure the grade is within the range [0, 5]
    if (value >= 0 && value <= 5) {
      const updatedClasses = classes.map(classItem => 
        classItem.id === id ? { ...classItem, grade: value } : classItem
      );
      setClasses(updatedClasses);
    } else {
      // Show an alert or error message if the grade is out of range
      Swal.fire({
        icon: 'error',
        title: 'Invalid Grade',
        text: 'Grade must be between 0 and 5',
      });
    }
  }
  

  function handleSubmit() {
    Swal.fire({
      title: "Submit Grades",
      text: "Are you sure you want to submit these grades?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Submitted!", "Grades have been submitted.", "success");
        setRefresh(!refresh);
      }
    });
  }
}
