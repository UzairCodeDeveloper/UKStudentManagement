import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { IoPersonOutline } from "react-icons/io5";
import { CiHome } from "react-icons/ci";
import { BiBriefcase } from "react-icons/bi";
import { GiNotebook } from "react-icons/gi";
import { CiViewTimeline } from "react-icons/ci";
import { MdOutlineTimer } from "react-icons/md";
import { TfiHandStop } from "react-icons/tfi";
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import AdminHomeDashbboard from './RightsideContent/DefaultDashboard/AdminHomeDashbboard';
import AddStudent from './Student/AddStudent/AddStudent';
import ShowStudents from './Student/ShowStudents/ShowStudents';
import AllClasses from './Classes/AllClasses/AllClasses';
import AddClass from './Classes/AddClass/AddClass';
import Timetable from './TimeTable/Timetable';
import AllSubjects from './Subjects/AllSubjects/AllSubjects';
import AddSubjects from './Subjects/AddSubjects/AddSubjects';
import StudentAttendence from './Attendence/Student/StudentAttendence';
import EmployeeAttendence from './Attendence/Employee/EmployeeAttendence';
import AllEmployee from './Employee/AllEmployee/AllEmployee';
import AddEmployee from './Employee/AddEmployee/AddEmployee';
import UserProfile from '../../../components/UserProfile/UserProfile';
import { ImProfile } from "react-icons/im";
import EditStudent from './Student/EditStudent/EditStudent';
import EditEmployee from './Employee/EditEmployee/EditEmployee';
import AddSession from './Session/AddSession';
import AllSession from './Session/AllSession/AllSession'
import EditSession from './Session/EditSession/EditSession'
export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
 
  
 
 
 

  const Sidebar = () => {
    const [isStudentOpen, setIsStudentOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isSubjectOpen, setIsSubjectOpen] = useState(false);
    const [isAttendenceOpen, setIsAttendenceOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('/');
    const [isSessionOpen, setIsSessionOpen] = useState(false);
    
    
     // State for active link
    return (
      <div className={`sidebar ${isSidebarOpen ? 'hidden ' : 'open'}`}>
        <ul>
          <li>
            <Link to="/" className={`sidebar-item ${activeLink === '/' ? 'active' : ''}`} 
              onClick={() => setActiveLink('/')}>
              <CiHome className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Dashboard</span>
            </Link>
          </li>
          
          <li
            className={`sidebar-item sidebar-item-with-submenu`}
            onClick={() => setIsStudentOpen(!isStudentOpen)}
          >
            <div>
              <IoPersonOutline className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Student</span>
            </div>
            <span className="sidebar-toggle">
              {isStudentOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </li>
          <ul className={`sub-menu ${isStudentOpen ? 'open' : ''}`}>
            <li>
              <Link to="/students" className={`sub-menu-item ${activeLink === '/students' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/students')}>
                All Students
              </Link>
            </li>
            <li>
              <Link to="/add-student" className={`sub-menu-item ${activeLink === '/add-student' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/add-student')}>
                Add Student
              </Link>
            </li>
          </ul>
          <li
            className={`sidebar-item sidebar-item-with-submenu`}
            onClick={() => setIsEmployeeOpen(!isEmployeeOpen)}
          >
            <div>
              <BiBriefcase className="sidebar-icon" style={{ marginRight: '10px' }} /> Employees
            </div>
            <span className="sidebar-toggle">
              {isEmployeeOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </li>
          <ul className={`sub-menu ${isEmployeeOpen ? 'open' : ''}`}>
            <li>
              <Link to="/employees" className={`sub-menu-item ${activeLink === '/employee' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/employee')}>
                All Employees
              </Link>
            </li>
            <li>
              <Link to="/add-employee" className={`sub-menu-item ${activeLink === '/add-employee' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/add-employee')}>
                Add Employee
              </Link>
            </li>
          </ul>
          <li
            className={`sidebar-item sidebar-item-with-submenu`}
            onClick={() => setIsSubjectOpen(!isSubjectOpen)}
          >
            <div>
              <GiNotebook className="sidebar-icon" style={{ marginRight: '10px' }} /> Subjects
            </div>
            <span className="sidebar-toggle">
              {isSubjectOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </li>
          <ul className={`sub-menu ${isSubjectOpen ? 'open' : ''}`}>
            <li>
              <Link to="/subjects" className={`sub-menu-item ${activeLink === '/subjects' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/subjects')}>
                All Subjects
              </Link>
            </li>
            <li>
              <Link to="/add-subject" className={`sub-menu-item ${activeLink === '/add-subject' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/add-subject')} >
                Add Subjects
              </Link>
            </li>
          </ul>
          <li
            className={`sidebar-item sidebar-item-with-submenu`}
            onClick={() => setIsClassOpen(!isClassOpen)}
          >
            <div>
              <GiNotebook className="sidebar-icon" style={{ marginRight: '10px' }} /> Classes
            </div>
            <span className="sidebar-toggle">
              {isClassOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </li>
          <ul className={`sub-menu ${isClassOpen ? 'open' : ''}`}>
            <li>
              <Link to="/classes" className={`sub-menu-item ${activeLink === '/classes' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/classes')}>
                All Classes
              </Link>
            </li>
            <li>
              <Link to="/add-class" className={`sub-menu-item ${activeLink === '/add-class' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/add-class')}>
                Add Class
              </Link>
            </li>
          </ul>

          <li
            className={`sidebar-item sidebar-item-with-submenu`}
            onClick={() => setIsSessionOpen(!isSessionOpen)}
          >
            <div>
              <MdOutlineTimer className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Sessions</span>
            </div>
            <span className="sidebar-toggle">
              {isSessionOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </li>
          <ul className={`sub-menu ${isSessionOpen ? 'open' : ''}`}>
            <li>
              <Link to="/sessions" className={`sub-menu-item ${activeLink === '/students' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/sessions')}>
                All Sessions
              </Link>
            </li>
            <li>
              <Link to="/add-session" className={`sub-menu-item ${activeLink === '/add-session' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/add-session')}>
                Add Session
              </Link>
            </li>
          </ul>







          
          <li
            className={`sidebar-item sidebar-item-with-submenu`}
            onClick={() => setIsAttendenceOpen(!isAttendenceOpen)}
          >
            <div>
              <GiNotebook className="sidebar-icon" style={{ marginRight: '10px' }} /> Attendence
            </div>
            <span className="sidebar-toggle">
              {isAttendenceOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </li>
          <ul className={`sub-menu ${isAttendenceOpen ? 'open' : ''}`}>
            <li>
              <Link to="/student-attendance" className={`sub-menu-item`}>
                Student Attendance
              </Link>
            </li>
            <li>
              <Link to="/employee-attendance" className={`sub-menu-item`}>
                Employee Attendance
              </Link>
            </li>
          </ul>

          <li>
            <Link to="/timetable" className={`sidebar-item ${activeLink === '/timetable' ? 'active' : ''}`} 
              onClick={() => setActiveLink('/timetable')}>
              <CiViewTimeline className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Timetable</span>
            </Link>
          </li>
          {/* <li>
            <Link to="/fees" className={`sidebar-item ${activeLink === '/fees' ? 'active' : ''}`} 
              onClick={() => setActiveLink('/fees')}>
              <BiBriefcase className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Fees</span>
            </Link>


            
          </li> */}
        </ul>
      </div>
    );
  };

  const Content = () => {
    return (
      <Routes>
        <Route path="/" element={<AdminHomeDashbboard />} />
        <Route path="/students" element={<ShowStudents />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/classes" element={<AllClasses />} />
        <Route path="/add-class" element={<AddClass />} />
        <Route path="/subjects" element={<AllSubjects />} />
        <Route path="/add-subject" element={<AddSubjects />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/student-attendance" element={<StudentAttendence />} />
        <Route path="/employee-attendance" element={<EmployeeAttendence />} />
        <Route path="/employees" element={<AllEmployee />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/students/edit/:id" element={<EditStudent/>} />
        <Route path="/employees/edit/:id" element={<EditEmployee/>} />
        <Route path="/add-session" element={<AddSession />} />
        <Route path="/sessions" element={<AllSession />} />
        <Route path="/sessions/edit/:id" element={<EditSession />} />
        <Route path="/fees" element={<div className="content">Fees Management Content</div>} />
        <Route path="*" element={<div className="content">Select an option from the sidebar</div>} />
      </Routes>
    );
  };

  return (
    <Router>
      <div className="admin-dashboard">
        <Header toggleSidebar={toggleSidebar}/>
        <div className="dashboard-layout">
          <Sidebar />
          <div className="content-area">
            <Content />
          </div>
        </div>
      </div>
    </Router>
  );
}
