import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { TiHomeOutline } from "react-icons/ti";
import { IoMdSettings } from "react-icons/io";
import '../Admin/Admin.css';
import UserProfile from '../../../components/UserProfile/UserProfile';
import FamilyHomeDashboard from './FamilyHomeDashboard/FamilyHomeDashboard';
import StudentReport from './StudentReport/StudentReport'
import { PiStudentFill } from "react-icons/pi";
import FamilyManager from '../../../api/services/family/FamilyManager'
export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const Sidebar = () => {
    const [activeLink, setActiveLink] = useState('/');
    
   


    useEffect(()=>{
      FamilyManager.getfamilystudents().then
      ((res)=>{
        // console.log(res.data)
      })
      .catch((err)=>[
        console.log(err)
      ])
    },[])
    
    return (
      <div className={`sidebar ${isSidebarOpen ? 'hidden ' : 'open'}`}>
        <ul>
          <li>
            <Link to="/" className={`sidebar-item ${activeLink === '/' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/')}>
                <TiHomeOutline className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Dashboard</span>
            </Link>
          </li>

          

          <li>
            <Link to="/settings" className={`sidebar-item ${activeLink === '/settings' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/settings')}>
                <IoMdSettings className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const Content = () => {
    return (
      <Routes>
        <Route path="/" element={<FamilyHomeDashboard />} />
        <Route path="/studentReport/:id" element={<StudentReport/>} />
        <Route path="/settings" element={<UserProfile role='Family' />} />
        <Route path="*" element={<FamilyHomeDashboard />} />
      </Routes>
    );
  };

  return (
    <Router>
      <div className="admin-dashboard">
        <Header toggleSidebar={toggleSidebar} />
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
