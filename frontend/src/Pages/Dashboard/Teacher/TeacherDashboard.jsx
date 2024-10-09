import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import { CiHome } from "react-icons/ci";
import { TiHomeOutline } from "react-icons/ti";
import { GiNotebook } from "react-icons/gi";
import { CiViewTimeline } from "react-icons/ci";
import { BsPersonCheckFill } from "react-icons/bs";
import '../Admin/Admin.css'; // Ensure you have this CSS file for styles
import AdminHomeDashbboard from './TeacherHomeDashboard/TeacherHomeDashboard';
import Timetable from '../Admin/TimeTable/Timetable';
import CoursesDashboard from './Courses/CoursesDashboard/CoursesDashboard';
export default function AdminDashboard() {
  const [selectedComponent, setSelectedComponent] = useState('dashboard'); // Set default to 'dashboard'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleSelect = (component) => {
    setSelectedComponent(component);
  };
  const toggleSidebar = () => {
    console.log('hwllo');
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  const Sidebar = () => {


    

    useEffect(()=>{
      console.log("hello world")
    },[])
    

    return (
      
      <div className={`sidebar ${isSidebarOpen ? 'hidden ' : 'open'}`}>
      
        <ul>
          <li
            onClick={() => handleSelect('dashboard')}
            className={`sidebar-item ${selectedComponent === 'dashboard' ? 'active' : ''}`}
          >
            <TiHomeOutline className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Dashboard</span>
          </li>
          




          <li
            onClick={() => handleSelect('Courses')}
            className={`sidebar-item ${selectedComponent === 'Courses' ? 'active' : ''}`}
          >
            <GiNotebook className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Courses</span>
          </li>

          <li
            onClick={() => handleSelect('timetable')}
            className={`sidebar-item ${selectedComponent === 'timetable' ? 'active' : ''}`}
          >
            <CiViewTimeline className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>TimeTable</span>
          </li>
        
          <li
            onClick={() => handleSelect('attendence')}
            className={`sidebar-item ${selectedComponent === 'attendence' ? 'active' : ''}`}
          >
            <BsPersonCheckFill className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Attendence</span>
          </li>

        </ul>
      </div>
    );
  };

  const Content = () => {
    switch (selectedComponent) {
      case 'dashboard':
        return <AdminHomeDashbboard />;
      case 'Courses':
        return <CoursesDashboard/>
     
      case 'attendence':
        return ""; // Add Classes content
      

      case 'timetable':
        return <Timetable />; // Timetable content
      
      default:
        return <div className="content">Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <Header toggleSidebar={toggleSidebar} />
      <div className="dashboard-layout">
        <Sidebar />
        <div className="content-area">
          <Content />
        </div>
      </div>
    </div>
  );
}
