
import Login from './Pages/Login/Login'
import AdminDashboard from './Pages/Dashboard/Admin/AdminDashboard'
import { useSelector } from 'react-redux';
import TeacherDashboard from './Pages/Dashboard/Teacher/TeacherDashboard';
import StudentDashboard from './Pages/Dashboard/Student/StudentDashboard'
// import FamilyDashboard from './Pages/Dashboard/Family/FamilyDashboard'

export default function App() {
  const { adminLogin,teacherLogin,studentLogin } = useSelector((state) => state.user);


  return (
    <>
      {adminLogin ? (
        // Render AdminDashboard if the user is logged in
        <AdminDashboard />
      ) :teacherLogin?(
        // Render TeacherDashboard if the user is logged in
        <TeacherDashboard/>
      ) :studentLogin?(
        // Render Login if the user is not logged in
        <StudentDashboard/>
      ):(
        <Login />
      )}
      {/* <StudentDashboard/> */}
      {/* <FamilyDashboard/> */}
    </>
  );
}