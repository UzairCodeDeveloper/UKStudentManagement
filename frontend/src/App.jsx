
import Login from './Pages/Login/Login'
import AdminDashboard from './Pages/Dashboard/Admin/AdminDashboard'
import { useSelector } from 'react-redux';



export default function App() {
  const { adminLogin } = useSelector((state) => state.user);


  return (
    <>
      {adminLogin ? (
        // Render AdminDashboard if the user is logged in
        <AdminDashboard />
      ) : (
        // Render Login if the user is not logged in
        <Login />
      )}

      {/* <AdminDashboard/> */}
    </>
  );
}