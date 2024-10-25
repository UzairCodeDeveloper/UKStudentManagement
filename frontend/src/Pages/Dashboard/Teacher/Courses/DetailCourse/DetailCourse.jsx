import  { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker'; // Ensure react-datepicker is installed
import 'react-datepicker/dist/react-datepicker.css'; // Import date picker styles
import './DetailedCourse.css'
import { MdOutlinePeopleAlt } from "react-icons/md";
import { SlPeople } from "react-icons/sl";
import { GrResources } from "react-icons/gr";
import { useNavigate, useParams } from 'react-router-dom';
import CourseManager from "../../../../../api/services/teacher/course/courseManager";
export default function DetailCourse() {
  // State to manage course start date selected via DatePicker
  const [startDate, setStartDate] = useState(null);
  const [courseData, setCourseData] = useState({});

  // Course duration constants
  const courseDurationMonths = 14;
  const navigate=useNavigate();
  // Function to generate weeks based on start date and 13-month duration
  const generateWeeks = (startDate) => {
    const weeks = [];
    if (!startDate) return weeks;

    // Calculate the end date as start date + 13 months
    const endDate = dayjs(startDate).add(courseDurationMonths, 'month');

    // Loop over the entire duration (13 months)
    for (let i = 0; i < courseDurationMonths * 4; i++) {
      const weekStart = dayjs(startDate).add(i, 'week');
      if (weekStart.isAfter(endDate)) break; // Stop if we exceed the end date

      const weekEnd = weekStart.add(6, 'day');

      // Dummy tasks for each week
      const tasks = [
        `Task ${i * 3 + 1} for ${weekStart.format('D MMM YYYY')}`,
        `Task ${i * 3 + 2} for ${weekStart.format('D MMM YYYY')}`,
        `Task ${i * 3 + 3} for ${weekStart.format('D MMM YYYY')}`,
      ];

      weeks.push({
        weekStart: weekStart.format('D MMM YYYY'),
        weekEnd: weekEnd.format('D MMM YYYY'),
        weekMonth: weekStart.month() + 1, // Get the month (0-indexed, so +1)
        weekYear: weekStart.year(),
        weekStartDate: weekStart, // Keep the date object for comparisons
        tasks, // Adding the tasks to the week
      });
    }
    return weeks;
  };

  // Weeks and end date calculations
  const weeks = startDate ? generateWeeks(startDate) : [];
  const endDate = startDate ? dayjs(startDate).add(courseDurationMonths, 'month') : null;

  // State for managing the current month being displayed
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  // Get the current month, previous month, and next month based on offset
  const currentMonth = dayjs().add(currentMonthOffset, 'month');
  const nextMonth = currentMonth.add(1, 'month');
  const previousMonth = currentMonth.subtract(1, 'month');

  // Filter weeks to only show those for the current and next month
  const filteredWeeks = weeks.filter(week =>
    (week.weekMonth === currentMonth.month() + 1 && week.weekYear === currentMonth.year()) ||
    (week.weekMonth === nextMonth.month() + 1 && week.weekYear === nextMonth.year())
  );

  // Disable previous and next buttons logic
  const isPreviousDisabled = startDate && currentMonth.isSame(dayjs(startDate), 'month');
  const isNextDisabled = startDate && nextMonth.isSame(endDate, 'month');

  // Current week calculations
  const currentWeekStartDate = dayjs().startOf('week');

  // Accordion toggle state
  const [isAnyAccordionOpen, setIsAnyAccordionOpen] = useState(false);
  const handleAccordionToggle = () => {
    setIsAnyAccordionOpen(prevState => !prevState);
  };

  const params = useParams();
  const id = params.id

  useEffect(()=>{
    CourseManager.getCourseByIdInstructor(id)
    .then(res=>{
      console.log(res.data.classDetails.session.start_date)
      setStartDate(new Date(res.data.classDetails.session.start_date))
      setCourseData(res.data)
    })
    .catch(err=>{
      console.log(err)
    })


    // console.log(id)
  },[])

  return (
    
    <div className="courses-dashboard">
      <h3>{courseData?.course?.course_name}</h3>
      
      {/* DatePicker to select course start date */}
      <div className="date-picker-container" style={{ marginBottom: '20px', display:'none' }}>
        <label>
          {/* Select  */}
          Course Start Date: </label>
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Select a start date"
          isClearable
          disabled={true}
        />
      </div>

      {startDate && (
        <div className="course-overview" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px' }}>
          

          <div className="accordion" id="accordionExample">
            {/* Accordion for Welcome to Course */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button 
                  className="accordion-button" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseOne" 
                  aria-expanded="true" 
                  aria-controls="collapseOne"
                  style={{ fontWeight: '600', fontSize: '22px', backgroundColor: 'none !important'}}
                  onClick={handleAccordionToggle}
                >
                  Welcome to Course
                </button>
              </h2>
              <div 
                id="collapseOne" 
                className="accordion-collapse collapse show" 
                aria-labelledby="headingOne" 
                data-bs-parent="#accordionExample"
                onTransitionEnd={handleAccordionToggle}
              >
                <div className="accordion-body">
                <div className='accordionBox' style={{border:'1px solid #dee2e6',padding:'20px',borderRadius:'10px', }}>
                    <GrResources style={{backgroundColor:'#f7634d', color:'white', fontSize:'3rem',padding:'5px', borderRadius:'5px'}}/>
                    <span style={{fontSize:'1.2rem', marginLeft:'20px'}}><a href='' style={{cursor:'pointer'}} onClick={()=>{navigate(`/courseResources/${id}`)}}>Resources</a></span>
                  </div>
                  <div className='accordionBox' style={{border:'1px solid #dee2e6',padding:'20px',borderRadius:'10px', marginTop:'10px'}}>
                    <MdOutlinePeopleAlt style={{backgroundColor:'#5d63f6', color:'white', fontSize:'3rem',padding:'5px', borderRadius:'5px'}}/>
                    <span style={{fontSize:'1.2rem', marginLeft:'20px'}}><a href='' style={{cursor:'pointer'}} onClick={()=>{navigate('/courseattendance')}}>Attendance</a></span>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Dynamically generated accordions for course weeks */}
            {filteredWeeks.map((week, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading${index + 2}`}>
                  <button 
                    className="accordion-button" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target={`#collapse${index + 2}`} 
                    aria-expanded={currentWeekStartDate.isSame(week.weekStartDate, 'week') ? 'true' : 'false'} 
                    aria-controls={`collapse${index + 2}`}
                    style={{ fontWeight: '500', fontSize: '22px' }}
                    onClick={handleAccordionToggle}
                  >
                    {week.weekStart} - {week.weekEnd}
                    {currentWeekStartDate.isSame(week.weekStartDate, 'week') && 
                      <span className="currently-week" style={{ marginLeft: '20px', fontSize: "12px", backgroundColor: '#0f47ad', color: 'white', fontWeight: '500', padding: '5px', borderRadius: '10px' }}>
                        Currently Week
                      </span>
                    }
                  </button>
                </h2>
                <div 
                  id={`collapse${index + 2}`} 
                  className="accordion-collapse collapse" 
                  aria-labelledby={`heading${index + 2}`} 
                  data-bs-parent="#accordionExample"
                  onTransitionEnd={handleAccordionToggle}
                >
                  <div className="accordion-body">
                    <p>Content for {week.weekStart} - {week.weekEnd}</p>
                    <ul>
                      {week.tasks.map((task, taskIndex) => (
                        <li key={taskIndex}>{task}</li> // Render each task for the week
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Previous/Next Month Navigation */}
          <div className="mt-3 d-flex justify-content-between">
            <button 
              className="btn btn-primary" 
              onClick={() => setCurrentMonthOffset(prev => prev - 1)}
              disabled={isPreviousDisabled}
            >
              Previous Month
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => setCurrentMonthOffset(prev => prev + 1)}
              disabled={isNextDisabled}
            >
              Next Month
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
