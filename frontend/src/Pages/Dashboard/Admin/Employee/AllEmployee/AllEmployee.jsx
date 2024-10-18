import React, { useState, useEffect } from "react";
import { AiOutlineHome, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Loader from "../../../../../components/Loader/Loader"; // Import the Loader component
import "../../Student/ShowStudents/ShowStudents.css"; // Import the CSS file
import Swal from 'sweetalert2'
import EmployeeServices from "../../../../../api/services/admin/volunteer/volunteerManager";
import { useNavigate } from "react-router-dom";

export default function ShowStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("a-z");
  const [loading, setLoading] = useState(true); // State to track loading
  const [students, setStudents] = useState([]); // State for students
  const [refresh, setRefresh] = useState(false);

  // useEffect(() => {
  //   // Simulate fetching data with a delay
  //   setTimeout(() => {
  //     // Replace this with your actual data fetching logic
  //     setStudents([
  //       { id: 1, forename: 'Mark', workingHours: '2', contact: '(123) 456-7890' },
  //       { id: 2, forename: 'Jacob', workingHours: '5', contact: '(987) 654-3210' },
  //       { id: 3, forename: 'Larry', workingHours: '3', contact: '(555) 123-4567' },
  //     ]);
  //     setLoading(false); // Set loading to false after data is fetched
  //   }, 2000); // Simulating a 2-second delay
  // }, []);


  const navigate = useNavigate();
  const handleEdit = (id) => {

    navigate(`/employees/edit/${id}`)

  }
  useEffect(() => {
    setLoading(true);
    EmployeeServices.getAllVolunteers()
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [refresh]);



  function handleDelete(id) {
    // Show confirmation dialog with SweetAlert2
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      // If user confirms the action
      if (result.isConfirmed) {
        // Call the delete API
        EmployeeServices.deleteVolunteer(id)
          .then((res) => {
            console.log(res.data);
            // Show success notification using SweetAlert2
            Swal.fire({
              title: "Deleted!",
              text: "Employee has been deleted successfully.",
              icon: "success",
              confirmButtonColor: "#3085d6"
            });
            // Trigger re-fetch by toggling refresh state
            setRefresh(!refresh);
          })
          .catch((err) => {
            console.error(err);
            // Show error notification using SweetAlert2
            Swal.fire({
              title: "Error!",
              text: err.response?.data?.msg || "Something went wrong while deleting the employee.",
              icon: "error",
              confirmButtonColor: "#d33"
            });
          });
      } else {
        // Optional: Log or handle cancel action
        console.log("Employee deletion canceled by user");
      }
    });
  }



  // Filter and sort students based on search term and selected order
  const filteredStudents = students
    .filter(student =>
      student.volunteer_details?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const fullNameA = a.volunteer_details?.full_name || '';
      const fullNameB = b.volunteer_details?.full_name || '';

      if (sortOrder === "a-z") {
        return fullNameA.localeCompare(fullNameB);
      } else {
        return fullNameB.localeCompare(fullNameA);
      }
    });


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
      <div className="table-container">
        <div
          className="students-container"
          style={{ backgroundColor: "white" }}
        >
          <div className="header">
            <h6>
              Employee{" "}
              <span className="sub-header">
                <AiOutlineHome className="sidebar-icon" />- All Employee
              </span>
            </h6>
          </div>

          {/* Search Bar */}
          <div
            className="container-fluid admission-header text-center "
            style={{ marginTop: "30px" }}
          >
            <h1>Employee Records</h1>
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

          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Working Hours</th>
                <th>Contact No</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.employee_id}</td>
                  <td>{student.volunteer_details.full_name}</td>
                  <td>
                    {student.volunteer_details.working_commitment === "No"
                      ? `${student.volunteer_details.schedule}  ${student.volunteer_details.schedule_detail} Hours`
                      : `Weekly ${student.volunteer_details.working_commitment}`}
                  </td>


                  <td>{student.volunteer_details.contact_number}</td>
                  <td className="status-buttons">
                    <button className="btn btn-edit" onClick={() => { handleEdit(student._id) }}>
                      <AiOutlineEdit />
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(student._id)}>
                      <AiOutlineDelete />
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
}
