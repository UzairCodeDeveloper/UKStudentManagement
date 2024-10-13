import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function DetailCourse() {
  const navigate=useNavigate();
  return (
    <div>DetailCourse
    <button className='btn btn-primary' onClick={()=>{navigate('/Attendance')}}>click</button>
    </div>

  )
}
