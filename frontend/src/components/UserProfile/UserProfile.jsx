import { useEffect, useState } from 'react';
import { IoMdSettings } from "react-icons/io";
import { useSelector } from 'react-redux';
import userProfileManager from '../../api/services/admin/userProfile/userProfile'
import Swal from 'sweetalert2';

export default function ShowClasses({ role }) {
  // Get user ID based on the role
  const user = useSelector((state) => {
    switch (role) {
      case 'Admin':
        return state?.user?.user?.admin?.username || '';
      case 'Teacher':
        return state?.user?.user?.volunteer?.employee_id || '';
      case 'Student':
        return state?.user?.user?.user?.user_id || '';
      case 'Family':
        return state?.user?.user?.familyRegNo || '';
      default:
        return '';
    }
  });

  // State for form inputs
  const [formData, setFormData] = useState({
    userId: user, // Example userId, this will be readOnly
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    Role: role,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'New password and confirm password do not match.',
      });
      return;
    }

    // Show loading message using SweetAlert
    Swal.fire({
      title: 'Updating...',
      text: 'Please wait while we update your password.',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Handle form submission logic (e.g., API call)
    userProfileManager.updateProfilePassword(formData)
      .then((res) => {
        console.log(res);

        // Close the loading message and show success
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.data.message || 'Your password has been updated successfully!',
        });
      })
      .catch((err) => {
        console.log(err.response.data);

        // Close the loading message and show error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data || 'There was an error updating your password. Please try again.',
        });
      });

    console.log("Form Data Submitted:", formData);
  };

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header" style={{ backgroundColor: '#6486f5', color: 'white' }}>
          <h6>
            <IoMdSettings style={{ marginRight: '0.5rem' }} />
            Account Settings {role}
          </h6>
        </div>
        
        {/* Form for Account Settings */}
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '20px' }}>
          
          {/* User ID (Read-Only) */}
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label className="field-label required-bg">User ID*</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Enter User ID"
                className="form-input"
                name="userId"
                value={formData.userId}
                readOnly
                style={{ color: 'gray' }}
              />
            </div>
          </div>

          {/* Current Password */}
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="field-label required-bg">Current Password*</label>
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="Enter Current Password"
                className="form-input"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="field-label required-bg">New Password*</label>
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="Enter New Password"
                className="form-input"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="field-label required-bg">Confirm Password*</label>
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="Confirm New Password"
                className="form-input"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '20px' }}>
            <button 
              type="submit" 
              className="submit-button"
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#6486f5', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
