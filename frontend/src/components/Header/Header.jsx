import  { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoIosNotifications } from 'react-icons/io';
import { FaUser, FaKey, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/logo.png'; // Adjust logo path if necessary
import './header.css';
import { useDispatch,useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { logoutUser } from '../../Redux/userSlice';
import Loader from '../Loader/Loader';



export default function Header({ toggleSidebar, UserProfile }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const [loading, setLoading] = useState(false); // State to track loading

  const dispatch = useDispatch();

  const handleLogout = async() =>{
    // console.log("first")
    await setLoading(true)
    await setTimeout(()=>{
      dispatch(logoutUser());
    },3000)
    await setLoading(false)
    

  }
  const user = useSelector((state) => state.user.user);
  if (loading) {
    return <Loader />; // Show the loader if loading
  }

 const navigate = useNavigate();

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
        <div className="userName">{user?.admin?.forename || ''}</div>
        <div className="Profile" onClick={toggleDropdown}>
          <img
            src="https://via.placeholder.com/40" // Placeholder for actual profile image
            alt="Profile"
            className="profileImage"
          />
          <div className={`dropdownMenu ${dropdownOpen ? 'show' : ''}`}>
            <div className="dropdownItem" onClick={UserProfile}>
              <FaUser className="dropdownIcon" /> Account Settings
            </div>

            <div className="dropdownItem" onClick={handleLogout}>
              <FaSignOutAlt className="dropdownIcon" /> Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
