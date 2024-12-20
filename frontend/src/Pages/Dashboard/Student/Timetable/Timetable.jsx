import { useState, useEffect } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import Loader from '../../../../components/Loader/Loader'; // Import the Loader component
import { useSelector } from 'react-redux';
import TimeTableManager from '../../../../api/services/admin/timetable/TimeTableManager';

export default function ShowClasses() {
  const [searchDay, setSearchDay] = useState(''); // State for selected day
  const [loading, setLoading] = useState(true); // State to track loading
  const [classes, setClasses] = useState([]); // State for classes
  const [id] = useState(useSelector((state) => state?.user?.user?.user?.class_id));

  useEffect(() => {
    // Fetch timetable data by teacher
    TimeTableManager.getTimetableforStudentByClass(id)
      .then((res) => {
        const apiData = res.data.data;
        console.log(apiData);

        // Transform API response into a usable format
        const formattedClasses = [];
        for (const [day, dayClasses] of Object.entries(apiData)) {
          dayClasses.forEach((classItem) => {
            formattedClasses.push({
              id: classItem._id,
              teacher: classItem.teacher?.volunteer_details?.full_name || "N/A",
              subject: classItem.course?.course_name || "N/A",
              timing: `${classItem.start_time} - ${classItem.end_time}`,
              day: day
            });
          });
        }
        setClasses(formattedClasses);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Ensure loading stops even if there's an error
      });
  }, [id]);

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
  const filteredClasses = searchDay && searchDay !== ""
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
            TimeTable <span className="sub-header"><AiOutlineHome className="sidebar-icon" />- Student</span>
          </h6>
        </div>

        {/* Search Bar */}
        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>Class TimeTable</h1>
        </div>

        {/* Select Day */}
        <div className="search-filter" style={{ marginTop: '50px' }}>
          <span style={{ fontWeight: '600', marginRight: '20px' }}>Select Day </span>
          <select value={searchDay} onChange={(e) => setSearchDay(e.target.value)} className="sort-select">
            <option value="">Select a Day</option> {/* Option to select no day */}
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
                <th>Subject</th>
                <th>Teacher</th>
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
                    <td>{classItem.subject}</td>
                    <td>{classItem.teacher}</td>
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
