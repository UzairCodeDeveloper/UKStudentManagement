import React, { useState, useEffect } from 'react';
import { AiOutlineHome, AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import '../../Teacher/Courses/CourseResources/CourseResources.css';
import Swal from 'sweetalert2';

export default function ShowTimetable() {
  const [classFilter, setClassFilter] = useState('All'); // State for class filter
  const [timetables, setTimetables] = useState([]); // State for timetable data
  const [showModal, setShowModal] = useState(false); // State for modal visibility
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

  const filteredTimetables = timetables.filter(timetable =>
    classFilter === 'All' || timetable.className === classFilter
  );

  const handleAddTimetable = () => {
    if (formData.startTime >= formData.endTime) {
      Swal.fire("Invalid Time", "End time must be later than start time", "error");
      return;
    }

    setTimetables(prev => [...prev, { _id: Date.now(), ...formData }]);
    setShowModal(false);
    setFormData({ className: '', teacher: '', course: '', day: '', startTime: '', endTime: '' });
    Swal.fire("Added!", "Timetable has been added successfully.", "success");
  };

  const handleDelete = (id) => {
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
        setTimetables(prev => prev.filter(timetable => timetable._id !== id));
        Swal.fire("Deleted!", "Timetable has been deleted.", "success");
      }
    });
  };

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
              <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="sort-select">
                <option value="All">All</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
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
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Class</th>
                <th>Teacher</th>
                <th>Course</th>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimetables.map((timetable, key) => (
                <tr key={timetable._id}>
                  <td>{key + 1}</td>
                  <td>{timetable.className}</td>
                  <td>{timetable.teacher}</td>
                  <td>{timetable.course}</td>
                  <td>{timetable.day}</td>
                  <td>{timetable.startTime}</td>
                  <td>{timetable.endTime}</td>
                  <td className="status-buttons">
                    <button className="btn btn-delete" onClick={() => handleDelete(timetable._id)}>
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <div className="form-group AddClassFormGroup">
                <label htmlFor="classDropdown" className="field-label required-bg">
                  Class*
                </label>
                <div className="input-wrapper">
                  <select
                    id="classDropdown"
                    className="form-input"
                    value={formData.className}
                    onChange={(e) =>
                      setFormData({ ...formData, className: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select a class
                    </option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                  </select>
                </div>
              </div>

              {/* Teacher Dropdown */}
              <div className="form-group AddClassFormGroup">
                <label htmlFor="teacherDropdown" className="field-label required-bg">
                  Teacher*
                </label>
                <div className="input-wrapper">
                  <select
                    id="teacherDropdown"
                    className="form-input"
                    value={formData.teacher}
                    onChange={(e) =>
                      setFormData({ ...formData, teacher: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select a teacher
                    </option>
                    <option value="Mr. John">Mr. John</option>
                    <option value="Ms. Jane">Ms. Jane</option>
                    <option value="Dr. Smith">Dr. Smith</option>
                  </select>
                </div>
              </div>

              {/* Course Dropdown */}
              <div className="form-group AddClassFormGroup">
                <label htmlFor="courseDropdown" className="field-label required-bg">
                  Course*
                </label>
                <div className="input-wrapper">
                  <select
                    id="courseDropdown"
                    className="form-input"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select a course
                    </option>
                    <option value="Math">Math</option>
                    <option value="English">English</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
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
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
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
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
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
                    value={formData.day}
                    onChange={(e) =>
                      setFormData({ ...formData, day: e.target.value })
                    }
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
