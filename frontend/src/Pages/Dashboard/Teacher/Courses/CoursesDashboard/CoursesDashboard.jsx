import { useEffect, useState } from 'react';
import './CoursesDashboard.css';
import { useNavigate } from 'react-router-dom';
import CourseManager from "../../../../../api/services/teacher/course/courseManager";

export default function CoursesDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [layout, setLayout] = useState('card');
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    CourseManager.getAllTeacherCourses()
      .then(res => {
        // Check if res.data is an array before setting it to courses
        // console.log(res)
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          console.error("Expected an array but got:", res.data);
          setCourses([]); // Set to empty array as a fallback
        }
      })
      .catch(err => {
        console.error(err);
        setCourses([]); // Set to empty array if there's an error
      });
  }, []);

  // Filter courses based on the search term
  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.class_id.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="courses-dashboard">
      <h3>My Courses</h3>
      <div className="course-overview" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px' }}>
        <div className="filters" style={{ borderBottom: '1px solid black', padding: '20px 0px' }}>
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

        <div className={`courses-container ${layout}`} style={{ border: 'none' }}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className={`course-card ${layout}`}
                style={{ cursor: "pointer" }}
                onClick={() => { navigate(`/DetailedCourse/${course._id}`) }}
              >
                <img src="https://cdn.vectorstock.com/i/500p/19/76/blue-triangle-abstract-background-vector-1581976.jpg" alt={course.course_name} className="course-image" />
                <div className="course-content">
                  <p>{course.courseCode}</p>
                  <h4>{course.course_name}</h4>
                  <div className="completion-bar">
                    <span>0 % complete</span>
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
