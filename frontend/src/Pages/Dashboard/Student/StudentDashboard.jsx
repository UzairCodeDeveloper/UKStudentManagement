import  {  useState } from 'react';
import Header from '../../../components/Header/Header';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { TiHomeOutline } from "react-icons/ti";
import { GiNotebook } from "react-icons/gi";
import { CiViewTimeline } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import { BsPersonCheckFill } from "react-icons/bs";
import '../Admin/Admin.css'; // Ensure you have this CSS file for styles
import CoursesDashboard from './Courses/CoursesDashboard/CoursesDashboard';
import UserProfile from '../../../components/UserProfile/UserProfile';
import StudentHomeDashboard from './StudentHomeDashboard/StudentHomeDashboard';
import StudentAttendance from './Attendance/StudentAttendance';
import SubmissionPortal from './Courses/SubmissionPortal/SubmissionPortal';
import DetailCourse from './Courses/DetailedCourse/DetailCourse';
import ResourceOnlyDescription from './Courses/ResourceOnlyDescription.jsx/ResourceOnlyDescription'
import CourseResources from './Courses/CourseResources/CourseResources'
export default function AdminDashboard() {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };


  

  

  const Sidebar = () => {
    const [activeLink, setActiveLink] = useState('/');

    

    
    

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
          <li>
          <Link to="/user-profile" className={`sidebar-item ${activeLink === '/user-profile' ? 'active' : ''}`} 
              onClick={() => setActiveLink('/user-profile')}>
              <IoMdSettings className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Settings</span>
            </Link>
            </li>
          <li></li>
            <Link to="/courses" className={`sidebar-item ${activeLink === '/courses' ? 'active' : ''}`} 
              onClick={() => setActiveLink('/courses')}>
              <GiNotebook className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Courses</span>
            </Link>
            </li>
            <li>
            <Link to="/attendence" className={`sidebar-item ${activeLink === '/attendence' ? 'active' : ''}`} 
              onClick={() => setActiveLink('/attendence')}>
              <BsPersonCheckFill className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>Attendance</span>
            </Link>
            </li>
            <li>
            <Link to="/timetable" className={`sidebar-item ${activeLink === '/timetable' ? 'active' : ''}`} 
              onClick={() => setActiveLink('/timetable')}>
              <CiViewTimeline className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>TimeTable</span>
            </Link>
            </li>

            {/* <li>
            <Link to="/SubmissionPortal" className={`sidebar-item ${activeLink === '/SubmissionPortal' ? 'active' : ''}`} 
              onClick={() => setActiveLink('/SubmissionPortal')}>
              <CiViewTimeline className="sidebar-icon" style={{ marginRight: '10px' }} /> <span>SubmissionPortal</span>
            </Link>
            </li> */}
            







        </ul>
      </div>
    );
  };

  // const Content = () => {
  //   switch (selectedComponent) {
  //     case 'dashboard':
  //       return <AdminHomeDashbboard />;
  //     case 'Courses':
  //       // return <CoursesDashboard/>
  //       return <CourseRouting/>
     

      
  //         case 'userProfile':
  //           return <UserProfile/>

  //     case 'attendence':
  //       return <TeachersAttendence/>
      

  //     case 'timetable':
  //       return <Timetable />; // Timetable content
      
  //     default:
  //       return <div className="content">Select an option from the sidebar</div>;
  //   }
  // };

  const Content = () => {
    return (
      <Routes>
        <Route path="/" element={<StudentHomeDashboard />} />
        <Route path="/courses" element={<CoursesDashboard />} />
        <Route path="/user-profile" element={<UserProfile role='Student'/>} />
        <Route path="/attendence" element={<StudentAttendance/>} />
        <Route path="/SubmissionPortal" element={<SubmissionPortal/>} />
        <Route path="/DetailedCourse/:id" element={<DetailCourse />} />
        <Route path="/submit/:id" element={<SubmissionPortal />} />
        <Route path="/resources/:id" element={<ResourceOnlyDescription />} />
        <Route path="/courseResources/:id" element={<CourseResources/>} />
        {/* <Route path="/timetable" element={<Timetable />} />
        <Route path="/courseResources/:id" element={<CourseResources/>} />
        <Route path="/addresource/:id" element={<AddResource/>} />
        <Route path="/courseResources/edit/:id" element={<EditResource/>} />
        <Route path="/courseattendance" element={<CourseAttendance/>} />
        <Route path="/resourcegrading" element={<ResourceGrading/>} /> */}
        <Route path="*" element={<StudentHomeDashboard/>} />
      </Routes>
    );
  };

  // return (
  //   <div className="admin-dashboard">
  //     <Header toggleSidebar={toggleSidebar} UserProfile={handleUserProfile}/>
  //     <div className="dashboard-layout">
  //       <Sidebar />
  //       <div className="content-area">
  //         <Content />
  //       </div>
  //     </div>
  //   </div>
  // );

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
