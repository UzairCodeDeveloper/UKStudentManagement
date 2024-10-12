import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { IoPersonOutline } from "react-icons/io5";
import { CiHome } from "react-icons/ci";
import { BiBriefcase } from "react-icons/bi";
import { GiNotebook } from "react-icons/gi";
import { CiViewTimeline } from "react-icons/ci";
import { TfiHandStop } from "react-icons/tfi";
import './Admin.css'; // Ensure you have this CSS file for styles
import AdminHomeDashbboard from './RightsideContent/DefaultDashboard/AdminHomeDashbboard';
import AddStudent from './Student/AddStudent/AddStudent';
import ShowStudents from './Student/ShowStudents/ShowStudents';
import AllClasses from './Classes/AllClasses/AllClasses'; // Import AllClasses component
import AddClass from './Classes/AddClass/AddClass'; // Import AddClass component
import Timetable from './TimeTable/Timetable'; // Import Timetable component
import AllSubjects from './Subjects/AllSubjects/AllSubjects'
import AddSubjects from './Subjects/AddSubjects/AddSubjects'
import StudentAttendence from './Attendence/Student/StudentAttendence';
import EmployeeAttendence from './Attendence/Employee/EmployeeAttendence';
import AllEmployee from './Employee/AllEmployee/AllEmployee';
import AddEmployee from './Employee/AddEmployee/AddEmployee';
import UserForgetPassword from '../../../components/UserForgetPassword/UserForgetPassword';
import UserProfile from '../../../components/UserProfile/UserProfile';
export default function AdminDashboard() {
  const [selectedComponent, setSelectedComponent] = useState('dashboard'); // Set default to 'dashboard'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const handleSelect = (component) => {
    setSelectedComponent(component);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  

  const handleUserProfile = () => {
    setIsUserProfileOpen(true); // You may set this true to ensure it opens
    setSelectedComponent('userProfile'); // Always set this to navigate to the component
  };


  const Sidebar = () => {
    const [isStudentOpen, setIsStudentOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isClassOpen, setIsClassOpen] = useState(false); // New state for Classes
    const [isSubjectOpen, setIsSubjectOpen] = useState(false);
    const [isAttendenceOpen, setIsAttendenceOpen] = useState(false);
    
    const handleToggleStudents = () => {
      setIsStudentOpen(!isStudentOpen);
    };

    const handleToggleEmployees = () => {
      setIsEmployeeOpen(!isEmployeeOpen);
    };

    const handleToggleClasses = () => {
      setIsClassOpen(!isClassOpen); // Toggle for Classes
    };
    const handleToggleSubject = () => {
      setIsSubjectOpen(!isSubjectOpen); // Toggle for Classes
    };
    const handleToggleAttendence = () => {
      setIsAttendenceOpen(!isAttendenceOpen); // Toggle for Classes
    };

    
    
    

    return (
      
      <div className={`sidebar ${isSidebarOpen ? 'hidden ' : 'open'}`}>
      
        <ul>
          <li
            onClick={() => handleSelect('dashboard')}
            className={`sidebar-item ${selectedComponent === 'dashboard' ? 'active' : ''}`}
          >
            <CiHome className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Dashboard</span>
          </li>
          <li
            className={`sidebar-item sidebar-item-with-submenu ${selectedComponent === 'student' ? 'active' : ''}`}
            onClick={handleToggleStudents}
          >
            <div>
              <IoPersonOutline className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Student</span>
            </div>
            <span className="sidebar-toggle">
              {isStudentOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </li>
          <ul className={`sub-menu ${isStudentOpen ? 'open' : ''}`}>
            <li
              onClick={() => {
                handleSelect('allStudents');
                setIsStudentOpen(false); // Close submenu when selecting
              }}
              className={`sub-menu-item ${selectedComponent === 'allStudents' ? 'active' : ''}`}
            >
              All Students
            </li>
            <li
              onClick={() => {
                handleSelect('addStudent');
                setIsStudentOpen(false); // Close submenu when selecting
              }}
              className={`sub-menu-item ${selectedComponent === 'addStudent' ? 'active' : ''}`}
            >
              Add Student
            </li>
          </ul>
          <li
            className={`sidebar-item sidebar-item-with-submenu ${selectedComponent === 'employee' ? 'active' : ''}`}
            onClick={handleToggleEmployees}
          >
            <div>
              <BiBriefcase className="sidebar-icon" style={{ marginRight: '10px' }} /> Employees
            </div>
            <span className="sidebar-toggle">
              {isEmployeeOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </li>
          <ul className={`sub-menu ${isEmployeeOpen ? 'open' : ''}`}>
            <li
              onClick={() => {
                handleSelect('allEmployees');
                setIsEmployeeOpen(false); // Close submenu when selecting
              }}
              className={`sub-menu-item ${selectedComponent === 'allEmployees' ? 'active' : ''}`}
            >
              All Employees
            </li>
            <li
              onClick={() => {
                handleSelect('addEmployee');
                setIsEmployeeOpen(false); // Close submenu when selecting
              }}
              className={`sub-menu-item ${selectedComponent === 'addEmployee' ? 'active' : ''}`}
            >
              Add Employee
            </li>
          </ul>
          

          <li
            className={`sidebar-item sidebar-item-with-submenu ${selectedComponent === 'classes' ? 'active' : ''}`}
            onClick={handleToggleSubject}
          >

                
                



            <div>
              <GiNotebook className="sidebar-icon" style={{ marginRight: '10px' }} /> Subjects
            </div>
            <span className="sidebar-toggle">
              {isSubjectOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </li>
          <ul className={`sub-menu ${isSubjectOpen ? 'open' : ''}`}>
            <li
              onClick={() => {
                handleSelect('allSubjects');
                setIsSubjectOpen(false); // Close submenu when selecting
              }}
              className={`sub-menu-item ${selectedComponent === 'allSubjects' ? 'active' : ''}`}
            >
              All Subjects
            </li>
            <li
              onClick={() => {
                handleSelect('addSubjects');
                setIsClassOpen(false); // Close submenu when selecting
              }}
              className={`sub-menu-item ${selectedComponent === 'addSubjects' ? 'active' : ''}`}
            >
              Add Subjects
            </li>
          </ul>



          <li
            className={`sidebar-item sidebar-item-with-submenu ${selectedComponent === 'classes' ? 'active' : ''}`}
            onClick={handleToggleClasses}
          >

                
                



            <div>
              <GiNotebook className="sidebar-icon" style={{ marginRight: '10px' }} /> Classes
            </div>
            <span className="sidebar-toggle">
              {isClassOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </li>
          <ul className={`sub-menu ${isClassOpen ? 'open' : ''}`}>
            <li
              onClick={() => {
                handleSelect('allClasses');
                setIsClassOpen(false); // Close submenu when selecting
              }}
              className={`sub-menu-item ${selectedComponent === 'allClasses' ? 'active' : ''}`}
            >
              All Classes
            </li>
            <li
              onClick={() => {
                handleSelect('addClass');
                setIsClassOpen(false); // Close submenu when selecting
              }}
              className={`sub-menu-item ${selectedComponent === 'addClass' ? 'active' : ''}`}
            >
              Add Class
            </li>
          </ul>

          <li
            onClick={() => handleSelect('timetable')}
            className={`sidebar-item ${selectedComponent === 'timetable' ? 'active' : ''}`}
          >
            <CiViewTimeline className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Timetable</span>
          </li>
          <li
            className={`sidebar-item sidebar-item-with-submenu ${selectedComponent === 'classes' ? 'active' : ''}`}
            onClick={handleToggleAttendence}
          >

                
                



            <div>
              <GiNotebook className="sidebar-icon" style={{ marginRight: '10px' }} /> Attendence
            </div>
            <span className="sidebar-toggle">
              {isAttendenceOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </li>
          <ul className={`sub-menu ${isAttendenceOpen ? 'open' : ''}`}>
            <li
              onClick={() => {
                handleSelect('studentAttendence');
                setIsAttendenceOpen(false); // Close submenu when selecting
              }}
              className={`sub-menu-item ${selectedComponent === 'allClasses' ? 'active' : ''}`}
            >
              Student Attendence
            </li>
            <li
              onClick={() => {
                handleSelect('employeeAttendence');
                setIsAttendenceOpen(false); // Close submenu when selecting
              }}
              className={`sub-menu-item ${selectedComponent === 'addClass' ? 'active' : ''}`}
            >
              Employee Attendence
            </li>
          </ul>
          
          <li
            onClick={() => handleSelect('fees')}
            className={`sidebar-item ${selectedComponent === 'fees' ? 'active' : ''}`}
          >
            <BiBriefcase className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Fees</span>
          </li>
        </ul>
      </div>
    );
  };

  const Content = () => {
    switch (selectedComponent) {
      case 'dashboard':
        return <AdminHomeDashbboard />;
      case 'allStudents':
        return <ShowStudents />;
      case 'addStudent':
        return <AddStudent />;
      case 'allClasses':
        return <AllClasses />; // Add Classes content
      case 'addClass':
        return <AddClass />; // Add Class form content
      
        case 'allSubjects':
          return <AllSubjects/>; // Add Classes content
        case 'addSubjects':
          return <AddSubjects />;

      case 'timetable':
        return <Timetable />; // Timetable content
      case 'studentAttendence':
        return <StudentAttendence/> 
        case 'employeeAttendence':
        return <EmployeeAttendence/> 
      case 'allEmployees':
        return <AllEmployee/>
      case 'addEmployee':
        return <AddEmployee/>

          case 'userProfile':
            return <UserProfile/>;
      case 'fees':
        return <div className="content">Fees Management Content</div>;
      default:
        return <div className="content">Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <Header toggleSidebar={toggleSidebar}  UserProfile={handleUserProfile}/>
      <div className="dashboard-layout">
        <Sidebar />
        <div className="content-area">
          <Content />
        </div>
      </div>
    </div>
  );
}
