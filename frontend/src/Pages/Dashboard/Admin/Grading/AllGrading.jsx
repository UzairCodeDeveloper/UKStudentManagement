import { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import Swal from "sweetalert2";
import ClassManager from "../../../../api/services/admin/class/classManager";
import GradingManager from "../../../../api/services/admin/Grading/GradingManager";
import Loader from "../../../../components/Loader/Loader";

export default function ShowClasses() {
  const [classSelected, setClassSelected] = useState("");
  const [examSelected, setExamSelected] = useState("");
  const [classes, setClassData] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading

  // Sample exams list
  const exams = ["Book 1", "Book 2", "Book 3", "Book 4", "Book 5", "Book 6", "Book 7"];

  // Handle the deletion of a grade record for a student
  const handleDelete = (studentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the student's grade for the selected exam!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the delete function from GradingManager
        console.log(studentId)
        GradingManager.deleteRecord(studentId)
          .then(() => {
            Swal.fire("Deleted!", "The grade record has been deleted.", "success");
            // Refresh the submissions list after deletion
            setSubmissions((prevSubmissions) =>
              prevSubmissions.filter((submission) => submission.student_id !== studentId)
            );
            setSubmissions([])
            setExamSelected('')
            setClassSelected('')
          })
          .catch((err) => {
            Swal.fire("Error", "There was an error deleting the grade record.", "error");
            console.error("Error deleting grade record:", err);
          });
      }
    });
  };

  // Fetch classes when the component loads
  useEffect(() => {
    setLoading(true);
    ClassManager.getAllClasses()
      .then((res) => {
        setClassData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // Fetch student records based on the selected class and exam
  useEffect(() => {
    if (classSelected && examSelected) {
      setSubmissions([])
      setLoading(true);
      GradingManager.getRecords({ class_id: classSelected, exam_name: examSelected })
        .then((res) => {
          setSubmissions(res.data.data);
          console.log(res.data.data)
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [classSelected, examSelected]);

  if (loading) {
    return <Loader />; // Show the loader if loading
  }

  return (
    <div
      style={{
        height: "100%",
        padding: "20px",
        backgroundColor: "#f6f7fb",
        overflow: "auto",
      }}
    >
      <div className="classes-container">
        <div className="header">
          <h6>
            Final{" "}
            <span className="sub-header">
              <AiOutlineHome className="sidebar-icon" />-Grading
            </span>
          </h6>
        </div>

        <div
          className="container-fluid admission-header text-center"
          style={{ marginTop: "30px" }}
        >
          <h1>Student Grades</h1>
        </div>

        {/* Class and Exam Selection */}
        <div
          className="dropdowns"
          style={{
            marginTop: "50px",
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label>Select Class: </label>
            <select
              value={classSelected}
              onChange={(e) => setClassSelected(e.target.value)}
              style={{ padding: "5px", width: "150px" }}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Select Exam: </label>
            <select
              value={examSelected}
              onChange={(e) => setExamSelected(e.target.value)}
              style={{ padding: "5px", width: "150px" }}
              disabled={!classSelected} // Disable exam selection until a class is selected
            >
              <option value="">Select Exam</option>
              {exams.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-container" style={{ marginTop: "20px" }}>
          <table
            className="table"
            style={{
              background: "linear-gradient(to right, #007bff, #003f7f)",
              color: "#fff",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Reg No</th>
                <th>Name</th>
                <th>Grades</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length > 0 ? (
                submissions.map((submission, index) => (
                  <tr key={submission.id}>
                    <td>{index + 1}</td>
                    <td>{submission.roll_no}</td>
                    <td>{submission.forename}</td>
                    <td>{submission.obtained_marks}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(submission.id)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
