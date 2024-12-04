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

    // Handle grade change for a student
    const handleGradeChange = (event, studentId) => {
        const value = event.target.value;

        if (value >= 0 && value <= 100) {
            // Update only the grade of the specific student based on studentId
            setSubmissions((prevSubmissions) => {
                const updatedSubmissions = prevSubmissions.map((submission) =>
                    submission.student_id === studentId // Use student_id to identify the student
                        ? { ...submission, obtained_marks: value } // Update the obtained_marks for the student with the matching student_id
                        : submission // Keep other submissions unchanged
                );

                return updatedSubmissions;
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Invalid Grade",
                text: "Grade must be between 0 and 100",
            });
        }
    };


    // Handle form submission to save grades
    const handleSubmit = () => {
        const allFilled = submissions.length > 0 && submissions.every((submission) => submission.obtained_marks !== "");


        if (!classSelected || !examSelected) {
            Swal.fire({
                icon: "error",
                title: "Selection Required",
                text: "Please select both class and exam before submitting.",
            });
            return;
        }

        if (!allFilled) {
            Swal.fire({
                icon: "error",
                title: "Incomplete Marks",
                text: "All marks must be filled before submitting.",
            });
            return;
        }

        // Prepare the data to be sent to the backend
        const data = {
            classSelected,
            examSelected,
            submissions: submissions.map(submission => ({
                student_id: submission.student_id,
                obtained_marks: submission.obtained_marks,
            })),
        };

        // Call the submitGradingData function from GradingManager to submit the data
        GradingManager.submitGradingData(data)
            .then(() => {
                Swal.fire("Success!", "Marks submitted successfully!", "success");
                setSubmissions([])
                setClassSelected('')
                setExamSelected('')
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "Submission Failed",
                    text: "There was an error while submitting the grades.",
                });
                console.error("Error submitting grades:", err);
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
            setLoading(true);
            GradingManager.getStudentRecord({ class_id: classSelected, exam: examSelected })
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
    }, [classSelected, examSelected]); // Re-run this effect when classSelected or examSelected changes

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
                    <h1>Final Grades</h1>
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
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.length > 0 ? (
                                submissions.map((submission, index) => (
                                    <tr key={submission.id}>
                                        <td>{index + 1}</td>
                                        <td>{submission.roll_no}</td>
                                        <td>{submission.forename}</td>
                                        <td>
                                            <input
                                                type="number"
                                                max="100"
                                                min="0"
                                                value={submission.obtained_marks || ""}
                                                onChange={(e) => handleGradeChange(e, submission.student_id)}
                                                style={{ width: "60px" }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                                        Select the Class and Exam.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Submit Button */}
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#0071e9",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Submit All
                    </button>
                </div>
            </div>
        </div>
    );
}
