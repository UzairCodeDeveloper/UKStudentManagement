import { useState, useEffect } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { useParams } from "react-router-dom";
import "../../Classes/AddClass/AddClass.css";
import ClassManager from "../../../../../api/services/admin/class/classManager";
import CourseManager from "../../../../../api/services/admin/course/courseManager";
import VolunteerManager from "../../../../../api/services/admin/volunteer/volunteerManager";

export default function AddClass() {
  const [classes, setClasses] = useState([]); // List of all classes
  const [teachers, setTeachers] = useState([]); // List of all teachers
  const [selectedClass, setSelectedClass] = useState(""); // Selected class value
  const [selectedTeacher, setSelectedTeacher] = useState(""); // Selected teacher value
  const [subject, setSubject] = useState(""); // Subject input field

  const { id: courseId } = useParams();

  // Fetch Classes, Teachers, and Course Details
  useEffect(() => {
    // Fetch classes and teachers simultaneously
    Promise.all([
      ClassManager.getAllClasses(),
      VolunteerManager.getAllVolunteers(),
      CourseManager.getCourseById(courseId),
    ])
      .then(([classRes, teacherRes, courseRes]) => {
        // Set classes and teachers
        setClasses(classRes.data);
        setTeachers(teacherRes.data);
        console.log(teacherRes.data)

        const course = courseRes.data.course;

        // Set default values based on course details
        setSubject(course.course_name || "");
        setSelectedClass(course.class_id?._id || "");
        setSelectedTeacher(course.instructor?._id || "");
        console.log("Current Selected APi Teacher:"+course.instructor?._id || "");
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [courseId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      class_id: selectedClass,
      course_name: subject,
      volunteer_id: selectedTeacher,
    };
    // console.log(data)
     console.log('Selected Teacher APi: '+selectedTeacher)
    CourseManager.UpdateCourse(courseId,data)
      .then(() => {
        alert("Subject updated successfully");
        setSelectedClass("");
        setSelectedTeacher("");
        setSubject("");
      })
      .catch((err) => {
        console.error(err.response.data?.msg || "Error updating subject");
        alert(err.response.data?.msg || "Failed to update subject");
      });
  };

  return (
    <div
      style={{
        height: "100%",
        padding: "20px",
        backgroundColor: "#f6f7fb",
        overflow: "auto",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "30px",
          boxShadow: "0px 0px 1px 0px gray",
        }}
      >
        <h6>
          Subject{" "}
          <span style={{ fontWeight: "400" }}>
            | <AiOutlineHome className="sidebar-icon" style={{ marginRight: "5px" }} />
            - Update Subject
          </span>
        </h6>
      </div>
      <div className="classContainer">
        <div className="classBox">
          <h5>Update Subject</h5>
          <form onSubmit={handleSubmit}>
            {/* Select Class */}
            <div className="form-group">
              <label htmlFor="classSelect" className="field-label required-bg">
                Select Class*
              </label>
              <div className="input-wrapper">
                <select
                  id="classSelect"
                  className="form-input"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.class_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select Teacher */}
            <div className="form-group" style={{ marginTop: "20px" }}>
              <label htmlFor="teacherSelect" className="field-label required-bg">
                Select Teacher*
              </label>
              <div className="input-wrapper">
                <select
                  id="teacherSelect"
                  className="form-input"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.volunteer_details.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject Name */}
            <div className="form-group AddClassFormGroup">
              <label htmlFor="subjectName" className="field-label required-bg">
                Subject Name*
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="subjectName"
                  className="form-input"
                  placeholder="Enter subject name"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              style={{
                marginTop: "20px",
                backgroundColor: "#ffc674",
                fontWeight: "400",
                color: "black",
              }}
            >
              Update Subject
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
