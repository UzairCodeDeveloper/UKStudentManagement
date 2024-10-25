import  { useEffect, useState } from 'react';
import './CoursesDashboard.css';
import {useNavigate} from 'react-router-dom'
import CourseManager from "../../../../../api/services/teacher/course/courseManager";
// const courses = [
//   {
//     id: 1,
//     courseCode: 'CS462_F24_A',
//     courseName: 'Compiler Construction',
//     semester: 'Fall2024',
//     completion: 0,
//     image: 'https://cdn.vectorstock.com/i/500p/19/76/blue-triangle-abstract-background-vector-1581976.jpg',
//   },
//   {
//     id: 2,
//     courseCode: 'CS424_F24_A',
//     courseName: 'Parallel & Distributed Computing',
//     semester: 'Fall2024',
//     completion: 0,
//     image: 'https://cdn.wallpapersafari.com/46/81/hquHiD.jpg',
//   },
//   {
//     id: 3,
//     courseCode: 'MGT206_F24_A',
//     courseName: 'Principles of Marketing',
//     semester: 'Fall2024',
//     completion: 0,
//     image: 'https://media.istockphoto.com/id/1399201575/vector/blurred-gradient-mosaic-geometric-abstract-background.jpg?s=612x612&w=0&k=20&c=yQt5RsXo9-nW0QGvDqayEPSTDrmfdRCLNsWbCI15h_8=',
//   },
//   {
//     id: 3,
//     courseCode: 'MGT206_F24_A',
//     courseName: 'Principles of Marketing',
//     semester: 'Fall2024',
//     completion: 0,
//     image: 'https://st2.depositphotos.com/4422187/7401/v/450/depositphotos_74017709-stock-illustration-low-polygon-background-polygon-underwater.jpg',
//   },
  
// ];




export default function CoursesDashboard() {
  // State for managing search term and layout
  const [searchTerm, setSearchTerm] = useState('');
  const [layout, setLayout] = useState('card'); // Default to 'card' layout

  const [courses, setCourses] = useState([]);

  useEffect(()=>{
    CourseManager.getAllTeacherCourses()
    .then(res=>{
      setCourses(res.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },[])

  // Filter courses based on the search term
  const filteredCourses = courses.filter(course => 
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.class_id.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate=useNavigate();

  return (
    <div className="courses-dashboard">
      <h3>My Courses</h3>
      <div className="course-overview" style={{backgroundColor:'white', padding:'30px', borderRadius:'20px'}}>
        <div className="filters" style={{borderBottom:'1px solid black', padding:'20px 0px'}}>
          <select value={layout} onChange={(e) => setLayout(e.target.value)}>
            <option value="card">Card</option>
            <option value="list">List</option>
          </select>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          
        </div>

        <div className={`courses-container ${layout}`} style={{border:'none'}}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className={`course-card ${layout}`} style={{cursor:"pointer"}} onClick={()=>{navigate(`/DetailedCourse/${course._id}`)}} >
                <img src="https://cdn.vectorstock.com/i/500p/19/76/blue-triangle-abstract-background-vector-1581976.jpg" alt={course.course_name} className="course-image" />
                <div className="course-content">
                  <p>{course.courseCode}</p>
                  <h4>{course.course_name}</h4>
                  <div className="completion-bar">
                    <span>
                      {/* {course.completion} */}
                    0  % complete</span>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${course.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No courses found</p>
          )}
        </div>
      </div>
    </div>
  );
}
