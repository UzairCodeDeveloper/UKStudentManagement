import React, { useState } from 'react';
import './CoursesDashboard.css';

const courses = [
  {
    id: 1,
    courseCode: 'CS462_F24_A',
    courseName: 'Compiler Construction',
    semester: 'Fall2024',
    completion: 0,
    image: 'https://cdn.vectorstock.com/i/500p/19/76/blue-triangle-abstract-background-vector-1581976.jpg',
  },
  {
    id: 2,
    courseCode: 'CS424_F24_A',
    courseName: 'Parallel & Distributed Computing',
    semester: 'Fall2024',
    completion: 0,
    image: 'https://cdn.wallpapersafari.com/46/81/hquHiD.jpg',
  },
  {
    id: 3,
    courseCode: 'MGT206_F24_A',
    courseName: 'Principles of Marketing',
    semester: 'Fall2024',
    completion: 0,
    image: 'https://media.istockphoto.com/id/1399201575/vector/blurred-gradient-mosaic-geometric-abstract-background.jpg?s=612x612&w=0&k=20&c=yQt5RsXo9-nW0QGvDqayEPSTDrmfdRCLNsWbCI15h_8=',
  },
  {
    id: 3,
    courseCode: 'MGT206_F24_A',
    courseName: 'Principles of Marketing',
    semester: 'Fall2024',
    completion: 0,
    image: 'https://st2.depositphotos.com/4422187/7401/v/450/depositphotos_74017709-stock-illustration-low-polygon-background-polygon-underwater.jpg',
  },
  
];

export default function CoursesDashboard() {
  // State for managing search term and layout
  const [searchTerm, setSearchTerm] = useState('');
  const [layout, setLayout] = useState('card'); // Default to 'card' layout

  // Filter courses based on the search term
  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <div key={course.id} className={`course-card ${layout}`} >
                <img src={course.image} alt={course.courseName} className="course-image" />
                <div className="course-content">
                  <p>{course.courseCode}</p>
                  <h4>{course.courseName}</h4>
                  <div className="completion-bar">
                    <span>{course.completion}% complete</span>
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
