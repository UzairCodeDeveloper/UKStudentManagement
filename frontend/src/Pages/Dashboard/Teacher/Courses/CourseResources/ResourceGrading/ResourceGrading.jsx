import { useState, useEffect } from "react";
import { AiOutlineHome } from "react-icons/ai";
import Loader from "../../../../../../components/Loader/Loader";
import Swal from "sweetalert2";
import ResourceManager from "../../../../../../api/services/student/ResourceManager";
import { useParams } from "react-router-dom";

export default function ShowClasses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("a-z");
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const params = useParams();

  useEffect(() => {
    setLoading(true);
    ResourceManager.getAllSubmissionsByResourceID(params.id)
      .then((response) => {
        console.log(response.data.submissions);
        setSubmissions(response.data.submissions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching submissions:", error);
        setLoading(false);
      });
  }, [refresh, params.id]);

  const filteredSubmissions = submissions
    .filter(
      (submission) =>
        submission.student_id.studentData.forename
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.student_id.studentData.surname
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = `${a.student_id.studentData.forename} ${a.student_id.studentData.surname}`;
      const nameB = `${b.student_id.studentData.forename} ${b.student_id.studentData.surname}`;
      return sortOrder === "a-z"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  if (loading) {
    return <Loader />;
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
            Resource{" "}
            <span className="sub-header">
              <AiOutlineHome className="sidebar-icon" />- Resource Grading
            </span>
          </h6>
        </div>

        <div
          className="container-fluid admission-header text-center"
          style={{ marginTop: "30px" }}
        >
          <h1>Assignment 1</h1>
        </div>
        <div className="search-filter" style={{ marginTop: "50px" }}>
          <div>
            <span style={{ fontWeight: "600", marginRight: "20px" }}>
              Search{" "}
            </span>
            <input
              type="text"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              required
            />
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>

        <div className="table-container">
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
                <th>Status</th>
                <th>File</th>
                <th>Grade </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission, index) => (
                <tr key={submission._id}>
                  <td>{index + 1}</td>
                  <td>{submission.student_id.roll_number}</td>
                  <td>{`${submission.student_id.studentData.forename} ${submission.student_id.studentData.surname}`}</td>
                  <td
                    style={{
                      color: submission.status === "PENDING" ? "red" : "green",
                      fontWeight: "600",
                    }}
                  >
                    {submission?.status}
                  </td>

                  <td>
                    {submission.submission_url ? (
                      <a href={submission.submission_url} target="_blank">
                        View File
                      </a>
                    ) : (
                      "No File"
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      max="5"
                      min="0"
                      value={submission.obtained_marks || ""}
                      onChange={(e) => handleGradeChange(e, submission._id)}
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleSaveMarks(submission._id)}
                      style={{
                        padding: "5px 15px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  function handleGradeChange(event, id) {
    const value = event.target.value;

    // Ensure the grade is within the range [0, 5]
    if (value >= 0 && value <= 5) {
      const updatedSubmissions = submissions.map((submission) =>
        submission._id === id
          ? { ...submission, obtained_marks: value }
          : submission
      );
      setSubmissions(updatedSubmissions);
    } else {
      // Show an alert or error message if the grade is out of range
      Swal.fire({
        icon: "error",
        title: "Invalid Grade",
        text: "Grade must be between 0 and 5",
      });
    }
  }

  function handleSaveMarks(id) {
    const submission = submissions.find((sub) => sub._id === id);
    console.log("Saving marks for submission ID:", id);
    console.log("Marks:", submission.obtained_marks);

    // Prepare the data to be sent
    const data = {
        submissionId: submission._id, // Use the submission's ID
        obtained_marks: submission.obtained_marks, // Marks obtained
    };

    // Send the data to the backend via ResourceManager.saveMarks
    ResourceManager.saveMarks(data)
      .then((response) => {
        Swal.fire("Success!", "Marks saved successfully!", "success");
        setRefresh(!refresh); // Trigger a refresh to show the updated data
      })
      .catch((error) => {
        console.error("Error saving marks:", error);
        Swal.fire("Error", "Failed to save marks", "error");
      });
  }
}
