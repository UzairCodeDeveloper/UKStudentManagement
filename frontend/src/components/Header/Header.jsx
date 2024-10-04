import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoIosNotifications } from 'react-icons/io';
import { FaUser, FaKey, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/logo.png'; // Adjust logo path if necessary
import './header.css';

export default function Header({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  return (
    <div className="container-fluid headerContainer">
      <div className="headerLeft">
        <div className="headerLogo">
          <img src={logo} alt="CompanyLogo" />
        </div>
        <div className="HamIcon" onClick={toggleSidebar}>
          <GiHamburgerMenu style={{ color: 'white' }} />
        </div>
      </div>
      <div className="headerRight">
        <div className="HamIcon" onClick={toggleNotificationDropdown}>
          <IoIosNotifications style={{ color: 'white' }} />
          <div className={`notificationDropdown ${notificationDropdownOpen ? 'show' : ''}`}>
            {/* Dummy Notification Data */}
            <div className="notificationItem">New message from John Doe</div>
            <div className="notificationItem">Your profile was updated</div>
            <div className="notificationItem">You have a new follower</div>
          </div>
        </div>
        <div className="userName">John Doe</div>
        <div className="Profile" onClick={toggleDropdown}>
          <img
            src="https://via.placeholder.com/40" // Placeholder for actual profile image
            alt="Profile"
            className="profileImage"
          />
          <div className={`dropdownMenu ${dropdownOpen ? 'show' : ''}`}>
            <div className="dropdownItem">
              <FaUser className="dropdownIcon" /> Account
            </div>
            <div className="dropdownItem">
              <FaKey className="dropdownIcon" /> Change Password
            </div>
            <div className="dropdownItem">
              <FaSignOutAlt className="dropdownIcon" /> Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
