import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function CoursesDashboard() {
  const navigate=useNavigate()
  return (

    
    <div>CoursesDashboard
    
    <button className='btn btn-primary' onClick={()=>{navigate('/DetailedCourse')}}>click</button>
    </div>
  )
}
