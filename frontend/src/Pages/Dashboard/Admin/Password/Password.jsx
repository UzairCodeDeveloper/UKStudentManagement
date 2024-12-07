import { useState, useEffect } from 'react';
import { AiOutlineHome, AiOutlineEdit, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Swal from 'sweetalert2';
import SecurityManager from '../../../../api/services/admin/Password/PasswordManager';

export default function ShowClasses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('a-z');
  const [classes, setClasses] = useState([]); // To store the fetched data
  const [passwordVisible, setPasswordVisible] = useState({}); // To track which password is visible

  // Fetch data when component is mounted
  useEffect(() => {
    SecurityManager.getCredentialsRecord()
      .then((res) => {
        // Assuming res.data contains the array of credentials
        console.log(res.data);
        setClasses(res.data); // Store the response data in state
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Filter and sort classes based on search term and selected order
  const filteredClasses = classes
    .filter((classItem) =>
      classItem.username && classItem.username.toLowerCase().includes(searchTerm.toLowerCase()) // Ensure username exists
    )
    .sort((a, b) => {
      const nameA = a.username || ''; // Fallback to empty string if username is undefined
      const nameB = b.username || ''; // Fallback to empty string if username is undefined

      if (sortOrder === 'a-z') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

  const togglePasswordVisibility = (id) => {
    setPasswordVisible(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            Security <span className="sub-header"><AiOutlineHome className="sidebar-icon" />- All Passwords</span>
          </h6>
        </div>

        {/* Search Bar */}
        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>Security Record</h1>
        </div>
        <div className="search-filter" style={{ marginTop: '50px' }}>
          <div>
            <span style={{ fontWeight: '600', marginRight: '20px' }}>Search </span>
            <input
              type="text"
              placeholder="Search by Username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              required
            />
          </div>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>

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
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No records found</td>
                </tr>
              ) : (
                filteredClasses.map((classItem, index) => (
                  <tr key={classItem.id}>
                    <td>{index + 1}</td> {/* Dynamic row number */}
                    <td>{classItem.username}</td> {/* Username */}
                    <td>
                      {passwordVisible[classItem.id] ? (
                        classItem.password
                      ) : (
                        '••••••••' // Display a masked password
                      )}
                      <span 
                        onClick={() => togglePasswordVisibility(classItem.id)}
                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                      >
                        {passwordVisible[classItem.id] ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                      </span>
                    </td> {/* Password */}
                    <td className="status-buttons">
                      <button className="btn btn-edit" onClick={() => handleUpdate(classItem.id)}>
                        <AiOutlineEdit />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  function handleUpdate(id) {
    Swal.fire({
      title: "Update Password",
      input: 'text',
      inputLabel: 'Enter the new password',
      inputPlaceholder: 'New Password',
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: (newPassword) => {
        if (!newPassword) {
          Swal.showValidationMessage('Password cannot be empty!');
        }
        return newPassword;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setClasses((prevClasses) =>
          prevClasses.map((classItem) =>
            classItem.id === id ? { ...classItem, password: result.value } : classItem
          )
        );
        Swal.fire('Updated!', 'The password has been updated.', 'success');
      }
    });
  }
}
