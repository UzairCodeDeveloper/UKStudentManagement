import { useState, useEffect } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import Loader from '../../../../components/Loader/Loader'; // Import the Loader component

export default function ShowClasses() {
  const [searchDay, setSearchDay] = useState(''); // State for selected day
  const [loading, setLoading] = useState(true); // State to track loading
  const [classes, setClasses] = useState([]); // State for classes

  useEffect(() => {
    // Simulate fetching data with a delay
    setTimeout(() => {
      // Replace this with your actual data fetching logic
      setClasses([
        { id: 1, class_name: 'Math 101', subject: 'Algebra', timing: '10:00 AM - 11:00 AM', day: 'Monday' },
        { id: 2, class_name: 'History 201', subject: 'Ancient Civilizations', timing: '12:00 PM - 1:00 PM', day: 'Tuesday' },
        { id: 3, class_name: 'Physics 301', subject: 'Electrodynamics', timing: '9:00 AM - 10:00 AM', day: 'Wednesday' },
        { id: 4, class_name: 'Chemistry 401', subject: 'Organic Chemistry', timing: '11:00 AM - 12:00 PM', day: 'Thursday' },
        { id: 5, class_name: 'Biology 501', subject: 'Genetics', timing: '2:00 PM - 3:00 PM', day: 'Friday' },
        { id: 6, class_name: 'Computer Science 601', subject: 'Data Structures', timing: '3:00 PM - 4:00 PM', day: 'Saturday' }
      ]);
      setLoading(false); // Set loading to false after data is fetched
    }, 2000); // Simulating a 2-second delay
  }, []);

  // Function to get today's day name
  const getToday = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Set default selected day to today when the component mounts
  useEffect(() => {
    setSearchDay(getToday());
  }, []); // This will run once when the component mounts

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Filter classes based on selected day
  const filteredClasses = searchDay
    ? classes.filter(classItem => classItem.day.toLowerCase() === searchDay.toLowerCase())
    : classes;

  if (loading) {
    return <Loader />; // Show the loader if loading
  }

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            TimeTable <span className="sub-header"><AiOutlineHome className="sidebar-icon" />- All Classes</span>
          </h6>
        </div>

        {/* Search Bar */}
        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>Teacher's TimeTable</h1>
        </div>

        {/* Select Day */}
        <div className="search-filter" style={{ marginTop: '50px' }}>
          <span style={{ fontWeight: '600', marginRight: '20px' }}>Select Day </span>
          <select value={searchDay} onChange={(e) => setSearchDay(e.target.value)} className="sort-select">
            <option value="">All Days</option>
            {daysOfWeek.map((day, index) => (
              <option key={index} value={day}>{day}</option>
            ))}
          </select>
        </div>

        {/* Table */}
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
                <th>Subject</th>
                <th>Timing</th>
                <th>Day</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No classes available for the selected day.</td>
                </tr>
              ) : (
                filteredClasses.map((classItem, index) => (
                  <tr key={classItem.id}>
                    <td>{index + 1}</td> {/* Dynamic row number */}
                    <td>{classItem.class_name}</td>
                    <td>{classItem.subject}</td>
                    <td>{classItem.timing}</td>
                    <td>{classItem.day}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
