import React from 'react'
import Login from './Pages/Login/Login'
import AdminDashboard from './Pages/Dashboard/Admin/AdminDashboard'
import AddStudent from './Pages/Dashboard/Admin/RightsideContent/AddStudent/AddStudent'
import ShowStudents from './Pages/Dashboard/Admin/ShowStudents/ShowStudents'

export default function App() {
  return (
     <>
      {/* <Login/> */}
      <AdminDashboard/>
      {/* <ShowStudents/> */}
     </>
  )
}
