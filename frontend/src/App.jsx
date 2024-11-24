import Login from './Pages/Login/Login';
import AdminDashboard from './Pages/Dashboard/Admin/AdminDashboard';
import { useSelector } from 'react-redux';
import TeacherDashboard from './Pages/Dashboard/Teacher/TeacherDashboard';
import StudentDashboard from './Pages/Dashboard/Student/StudentDashboard';
import FamilyDashboard from './Pages/Dashboard/Family/FamilyDashboard';

export default function App() {
  const { adminLogin, teacherLogin, studentLogin, familyLogin } = useSelector((state) => state.user);

  return (
    <>
      {adminLogin ? (
        <AdminDashboard />
      ) : teacherLogin ? (
        <TeacherDashboard />
      ) : studentLogin ? (
        <StudentDashboard />
      ) : familyLogin ? ( 
        <FamilyDashboard />
      ) : (
        <Login />
      )}
    </>
  );
}
