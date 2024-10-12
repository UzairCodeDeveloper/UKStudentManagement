import React from 'react'
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import CoursesDashboard from '../CoursesDashboard/CoursesDashboard'
import DetailCourse from '../DetailCourse/DetailCourse'
export default function CourseRouting() {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<CoursesDashboard/>}></Route>
            <Route path='/courseDetail' element={<DetailCourse/>}></Route>
        </Routes>
    </Router>
  )
}
