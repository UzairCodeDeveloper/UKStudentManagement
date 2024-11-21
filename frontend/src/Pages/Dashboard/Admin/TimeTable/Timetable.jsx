import React, { useState, useEffect } from 'react';
import { AiOutlineHome, AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import '../../Teacher/Courses/CourseResources/CourseResources.css';
import Swal from 'sweetalert2';
import ClassManager from "../.././../../api/services/admin/class/classManager"
import EmployeeServices from "../../../../api/services/admin/volunteer/volunteerManager";
import CourseManager from "../../../../api/services/admin/course/courseManager.js"
import TimeTable from "../../../../api/services/admin/timetable/TimeTableManager.js"
import Loader from '../../../../components/Loader/Loader.jsx';
export default function ShowTimetable() {
  const [classFilter, setClassFilter] = useState('All'); // State for class filter
  const [timetables, setTimetables] = useState([]); // State for timetable data
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedClassForTimetable, setSelectedClassForTimetable] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(''); 
  const [selectedCourse, setSelectedCourse] = useState(''); 
  const [classes, setClassData] = useState([]);
  const [Teachers, setTeacherData] = useState([]);
  const [Courses, setCoursesData] = useState([]);
  const [day,setSelectedDay]=useState('')
  const [endTime,setSelectedEndTime]=useState('')
  const [startTime,setSelectedStartTime]=useState('')
  const [filteredTeachers, setFilteredTeachers] = useState([]); // State to store filtered teachers
  const [filteredCourses, setFilteredCourses] = useState([]); // State to store filtered courses
  // const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const [refresh, setRefresh] = useState(false); 
  const [error, setError] = useState(null); 
  const [selectedDayForTimetable, setSelectedDayForTimetable] = useState('all'); // State to store the selected day for filtering
  const [isDropdownEnabled, setIsDropdownEnabled] = useState(false); // State to enable/disable the day dropdown
  const [formData, setFormData] = useState({
    className: '',
    teacher: '',
    course: '',
    day: '',
    startTime: '',
    endTime: '',
  });

  // Dummy data for timetables
  useEffect(() => {
    const dummyTimetables = [
      { _id: 1, className: 'Class 1', teacher: 'Mr. John', course: 'Math', day: 'Monday', startTime: '09:00', endTime: '10:00' },
      { _id: 2, className: 'Class 2', teacher: 'Ms. Jane', course: 'English', day: 'Tuesday', startTime: '10:00', endTime: '11:00' },
    ];

    setTimetables(dummyTimetables);
  }, []);

  useEffect(() => {
    setLoading(true);
    ClassManager.getAllClasses()
      .then((res) => {
        setClassData(res.data)
        // console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
      
        setLoading(true);
        EmployeeServices.getAllVolunteers()
          .then((response) => {
            setTeacherData(response.data)
            // console.log(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });

          CourseManager.getAllCourses()
    .then((res)=>{
      // console.log(res.data)
      setCoursesData(res.data);
      setLoading(false);

    })
    .catch((err)=>{
      console.log(err)
      setLoading(false);
    })
    // console.log(selectedClassForTimetable)
    
    
      
  }, [refresh]);



  useEffect(() => {
    TimeTable.getTimetableByClass(selectedClassForTimetable)
      .then((res) => {
        console.log(res.data.data);

        // Flatten the timetable data
        const timetableData = [];
        for (const [day, schedules] of Object.entries(res.data.data)) {
          schedules.forEach((schedule) => {
            timetableData.push({
              ...schedule,
              day, // Add the day to each timetable entry
            });
          });
        }

        setFilteredTimetables(timetableData);
        setError(null); // Clear any previous error
        setIsDropdownEnabled(true); // Enable the day dropdown after data is fetched
      })
      .catch((err) => {
        console.error(err);
        setError('No records found'); // Set error message on failure
        setIsDropdownEnabled(false); // Disable the dropdown in case of error
      });
  }, [selectedClassForTimetable]);

  // Filter the timetables based on the selected day
  const filteredByDay = selectedDayForTimetable === 'all' 
    ? filteredTimetables 
    : filteredTimetables.filter(timetable => timetable.day.toLowerCase() === selectedDayForTimetable.toLowerCase());






  // const filteredTimetables = timetables.filter(timetable =>
  //   classFilter === 'Select Class' || timetable.className === classFilter
  // );

  const handleClassChange = (e) => {
    const selectedClassId = e.target.value;
    setSelectedClass(selectedClassId);
    setSelectedTeacher(''); // Reset teacher selection
    setSelectedCourse('');  // Reset course selection

    if (selectedClassId) {
      // Filter teachers by checking if any course has the selected class and the teacher's ID
      const teacherIds = [...new Set(
        Courses
          .filter(course => course.class_id?._id === selectedClassId)
          .map(course => course.instructor?._id)
      )];

      // Get the teachers matching the filtered IDs
      const filteredTeacherList = Teachers.filter(teacher => teacherIds.includes(teacher._id));
      setFilteredTeachers(filteredTeacherList);
    } else {
      setFilteredTeachers([]);
    }

    setFilteredCourses([]); // Clear courses when class changes
  };

  // Handle teacher selection
  const handleTeacherChange = (e) => {
    const selectedTeacherId = e.target.value;
    setSelectedTeacher(selectedTeacherId);
    setSelectedCourse(''); // Reset course selection

    if (selectedTeacherId && selectedClass) {
      // Filter courses by both the selected teacher and class
      const filtered = Courses.filter(course =>
        course.instructor?._id === selectedTeacherId && course.class_id?._id === selectedClass
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  };


  const handleAddTimetable = (e) => {
  
  
    const data={
      "class_id":selectedClass,
      "course":selectedCourse,
      "teacher":selectedTeacher,
      "day_of_week":day,
      "start_time":startTime,
      "end_time":endTime
    }
    console.log(data)
    TimeTable.createTimetable(data)
  .then((res) => {
    console.log(res);
    const message = res.message || "Timetable has been added successfully.";
    // setFormData({ className: '', teacher: '', course: '', day: '', startTime: '', endTime: '' });
    Swal.fire({
      title: "Success!",
      text: message,
      icon: "success",
    });
  })
  .catch((err) => {
    console.log(err);
    const errorMessage = err.response?.data?.message || err.message || "An error occurred while adding the timetable.";
    Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
    });
  });


    
    setShowModal(false);
    
    // console.log(selectedCourse)

    
  };

  const handleDelete = (id) => {
    console.log(id);
  
    // Show confirmation dialog first
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the API call only after confirmation
        TimeTable.deleteTimetable(id) // Pass the id to the deleteTimetable function
          .then((res) => {
            // On success, re-fetch the updated timetable data
            Swal.fire("Deleted!", "Timetable has been deleted.", "success");
            // Re-fetch the timetable data
            fetchTimetableData();
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error!", "Failed to delete timetable.", "error");
          });
      }
    });
  };
  
  // Function to re-fetch timetable data
  const fetchTimetableData = () => {
    // Assuming `selectedClassForTimetable` and `selectedDayForTimetable` are already set and available
    TimeTable.getTimetableByClass(selectedClassForTimetable)
      .then((res) => {
        console.log(res.data.data);
  
        // Flatten the timetable data
        const timetableData = [];
        for (const [day, schedules] of Object.entries(res.data.data)) {
          schedules.forEach((schedule) => {
            timetableData.push({
              ...schedule,
              day, // Add the day to each timetable entry
            });
          });
        }
  
        // Update the state with the new timetable data
        setFilteredTimetables(timetableData);
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("No records found");
      });
  };
  
  if (loading) {
    return <Loader />; // Show the loader if loading
  }

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="table-container">
        <div className="students-container" style={{ backgroundColor: 'white' }}>
          <div className="header">
            <h6>
              Course<span className="sub-header"><AiOutlineHome className="sidebar-icon" />- All Timetables</span>
            </h6>
          </div>

          {/* Filter by class */}
          <div className="search-filter" style={{ marginTop: '50px' }}>
            <div>
              <span style={{ fontWeight: '600', marginRight: '20px' }}>Filter by Class </span>
              <select
                  id="selectClass"
                  className="form-input"
                  value={selectedClassForTimetable}
                  onChange={(e) => setSelectedClassForTimetable(e.target.value)}
                  required // Mark as required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls, index) => (
                    <option key={index} value={cls._id}>{cls.class_name}</option>
                  ))}
                </select>
            </div>
          </div>
          <div className="search-filter" style={{ marginTop: '20px' }}>
            <div>
              <span style={{ fontWeight: '600', marginRight: '50px' }}>Filter by Day </span>
              <select
          id="dayFilter"
          className="form-input"
          value={selectedDayForTimetable}
          onChange={(e) => setSelectedDayForTimetable(e.target.value)}
          disabled={!isDropdownEnabled} // Disable dropdown until the API response is received
        >
          <option value="all">All</option>
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
          <option value="sunday">Sunday</option>
        </select>
            </div>
          </div>

          {/* Add Timetable Button */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', margin: '20px 0' }}>
            <button
              type="button"
              className='btn btn-primary'
              style={{ display: 'flex', alignItems: 'center', fontSize: '15px', padding: "5px 10px" }}
              onClick={() => setShowModal(true)}
            >
              <AiOutlinePlus style={{ marginRight: '5px' }} /> Add Timetable
            </button>
          </div>

          {/* Timetable Table */}
         
          <div>
      

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Teacher</th>
            <th>Course</th>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {error ? (
            // If there is an error, display it in a row
            <tr>
              <td colSpan="7" className="text-center text-danger">
                {error}
              </td>
            </tr>
          ) : filteredByDay.length > 0 ? (
            filteredByDay.map((timetable, key) => {
              return (
                <tr key={timetable._id || key}>
                  <td>{key + 1}</td>
                  <td>
                    {typeof timetable.teacher === 'object'
                      ? timetable.teacher.volunteer_details.full_name // Adjust according to your data structure
                      : timetable.teacher}
                  </td>
                  <td>
                    {typeof timetable.course === 'object'
                      ? timetable.course.course_name // Adjust as needed
                      : timetable.course}
                  </td>
                  <td>{timetable.day}</td>
                  <td>{timetable.start_time}</td>
                  <td>{timetable.end_time}</td>
                  <td className="status-buttons">
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(timetable._id)}
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            // If there are no records after filtering by day
            <tr>
              <td colSpan="7" className="text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
    </div>

      {/* Add Timetable Modal */}
      {showModal && (
        <div className={`modal-overlay ${showModal ? "visible" : ""}`}>
          <div className={`modal-content ${showModal ? "zoom-in" : ""}`}>
            {/* Close Button */}
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
              aria-label="Close Modal"
            >
              &times;
            </button>

            <h2>Add Timetable</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTimetable();
              }}
            >
              {/* Class Dropdown */}
              <div className='form-group'>
              <label htmlFor="selectClass" className="field-label required-bg">Select Class*</label>
              <div className="input-wrapper">
              <select
          id="selectClass"
          className="form-input"
          value={selectedClass}
          onChange={handleClassChange}
        >
          <option value="">Select a class</option>
          {classes.map(cls => (
            <option key={cls._id} value={cls._id}>{cls.class_name}</option>
          ))}
        </select>
              </div>
            </div>

              {/* Teacher Dropdown */}
              <div className='form-group' style={{marginTop:'20px'}}>
              <label htmlFor="selectClass" className="field-label required-bg">Select Teacher*</label>
              <div className="input-wrapper">
              <select
          id="selectTeacher"
          className="form-input"
          value={selectedTeacher}
          onChange={handleTeacherChange}
          disabled={!filteredTeachers.length} // Disable if no teachers are available
        >
          <option value="">Select a teacher</option>
          {filteredTeachers.map(teacher => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.volunteer_details.full_name}
            </option>
          ))}
        </select>

              </div>
            </div>

              {/* Course Dropdown */}
              <div className='form-group' style={{marginTop:'20px'}}>
              <label htmlFor="selectClass" className="field-label required-bg">Select Course*</label>
              <div className="input-wrapper">
              <select
          id="selectCourse"
          className="form-input"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          disabled={!filteredCourses.length} // Disable if no courses are available
        >
          <option value="">Select a course</option>
          {filteredCourses.map(course => (
            <option key={course._id} value={course._id}>
              {course.course_name}
            </option>
          ))}
        </select>

              </div>
            </div>


              {/* Start Time */}
              <div className="form-group AddClassFormGroup">
                <label htmlFor="startTime" className="field-label required-bg">
                  Start Time*
                </label>
                <div className="input-wrapper">
                  <input
                    type="time"
                    id="startTime"
                    className="form-input"
                    value={startTime}
                    onChange={(e) => setSelectedStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* End Time */}
              <div className="form-group AddClassFormGroup">
                <label htmlFor="endTime" className="field-label required-bg">
                  End Time*
                </label>
                <div className="input-wrapper">
                  <input
                    type="time"
                    id="endTime"
                    className="form-input"
                    value={endTime}
                    onChange={(e) => setSelectedEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Day */}
              <div className="form-group AddClassFormGroup">
                <label htmlFor="dayDropdown" className="field-label required-bg">
                  Day*
                </label>
                <div className="input-wrapper">
                  <select
                    id="dayDropdown"
                    className="form-input"
                    value={day}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select a day
                    </option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button type="submit" className="btn btn-warning" style={{ padding: '10px 70px' }}>
                  Add
                </button>

              </div>
            </form>
          </div>
        </div>

      )}
    </div>
  );
}
