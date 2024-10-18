
import Login from './Pages/Login/Login'
import AdminDashboard from './Pages/Dashboard/Admin/AdminDashboard'
import { useSelector } from 'react-redux';
import TeacherDashboard from './Pages/Dashboard/Teacher/TeacherDashboard';



export default function App() {
  const { adminLogin,teacherLogin } = useSelector((state) => state.user);


  return (
    <>
      {adminLogin ? (
        // Render AdminDashboard if the user is logged in
        <AdminDashboard />
      ) :teacherLogin?(
        // Render TeacherDashboard if the user is logged in
        <TeacherDashboard/>
      ) :(
        // Render Login if the user is not logged in
        <Login />
      )}


    </>
  );
}