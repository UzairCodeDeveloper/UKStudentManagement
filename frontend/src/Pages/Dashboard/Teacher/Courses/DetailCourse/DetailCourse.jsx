import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'; // Ensure dayjs is installed for date manipulation
import './DetailedCourse.css'
export default function DetailCourse() {
  const navigate = useNavigate();
  
  // Sample data for course resources
  const courseResources = [
    { name: 'Syllabus', link: '#' },
    { name: 'Course Schedule', link: '#' },
    { name: 'Lecture Notes', link: '#' },
  ];

  // Function to generate weeks starting from a specific start date
  const generateWeeks = (startDate, numWeeks) => {
    const weeks = [];
    for (let i = 0; i < numWeeks; i++) {
      const weekStart = dayjs(startDate).add(i, 'week');
      const weekEnd = dayjs(startDate).add(i, 'week').add(6, 'day');
      weeks.push({
        weekStart: weekStart.format('D MMM'),
        weekEnd: weekEnd.format('D MMM'),
        weekMonth: weekStart.month() + 1, // Get the month (0-indexed, so +1)
        weekStartDate: weekStart, // Keep the date object for filtering
      });
    }
    return weeks;
  };

  // Define start date and number of weeks
  const numWeeks = 12; // Example: 12 weeks of course content
  const startDate = dayjs().subtract(1, 'month'); // Start from last month to include weeks for previous month
  const weeks = generateWeeks(startDate, numWeeks);

  // State to show/hide previous month's weeks
  const [showPreviousMonth, setShowPreviousMonth] = useState(false);

  // State to track if any accordion is open
  const [isAnyAccordionOpen, setIsAnyAccordionOpen] = useState(false);

  // Get current month and next month
  const currentMonth = dayjs().month() + 1; // 0-indexed, so add 1
  const nextMonth = (currentMonth % 12) + 1; // Wrap to next month

  // Get the current week's start date
  const currentWeekStartDate = dayjs().startOf('week');

  // Filter weeks for the current month and the next month
  const currentAndNextMonthWeeks = weeks.filter(
    week => week.weekMonth === currentMonth || week.weekMonth === nextMonth
  );

  // Filter weeks for the previous month
  const previousMonth = dayjs().subtract(1, 'month').month() + 1;
  const previousMonthWeeks = weeks.filter(week => week.weekMonth === previousMonth);

  // Function to handle accordion toggle
  const handleAccordionToggle = () => {
    setIsAnyAccordionOpen(prevState => !prevState);
  };

  return (
    <div className='courses-dashboard'>
      <h3>Parallel Distributed Computing</h3>
      
      {/* Accordion for Welcome to Course */}
      <div className="course-overview" style={{backgroundColor:'white', padding:'30px', borderRadius:'20px'}}>
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button 
                className="accordion-button" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#collapseOne" 
                aria-expanded="true" 
                aria-controls="collapseOne"
                style={{fontWeight:'500', fontSize:'22px', backgroundColor:'none !important'}}
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
                <ul>
                  {courseResources.map((resource, index) => (
                    <li key={index}>
                      <a href={resource.link}>{resource.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Dynamically generated accordions for current and next month's weeks */}
          {currentAndNextMonthWeeks.map((week, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`heading${index + 2}`}>
                <button 
                  className="accordion-button" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target={`#collapse${index + 2}`} 
                  aria-expanded={currentWeekStartDate.isSame(week.weekStartDate, 'week') ? 'true' : 'false'} 
                  aria-controls={`collapse${index + 2}`}
                  style={{fontWeight:'500', fontSize:'22px'}}
                  onClick={handleAccordionToggle}
                >
                  {week.weekStart} - {week.weekEnd}
                  {currentWeekStartDate.isSame(week.weekStartDate, 'week') && 
                    <span className="currently-week" style={{marginLeft:'20px', fontSize:"12px", backgroundColor:'#0f47ad',color:'white',fontWeight:'500', padding:'5px', borderRadius:'10px'}}> Currently Week</span>
                  }
                </button>
              </h2>
              <div 
                id={`collapse${index + 2}`} 
                className={`accordion-collapse collapse ${currentWeekStartDate.isSame(week.weekStartDate, 'week') ? 'show' : ''}`} 
                aria-labelledby={`heading${index + 2}`} 
                data-bs-parent="#accordionExample"
                onTransitionEnd={handleAccordionToggle}
              >
                <div className="accordion-body">
                  <p>Content for {week.weekStart} - {week.weekEnd}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Show previous month's weeks when button is clicked */}
          {showPreviousMonth && previousMonthWeeks.map((week, index) => (
            <div className="accordion-item" key={index + currentAndNextMonthWeeks.length}>
              <h2 className="accordion-header" id={`heading${index + 2 + currentAndNextMonthWeeks.length}`}>
                <button 
                  className="accordion-button" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target={`#collapse${index + 2 + currentAndNextMonthWeeks.length}`} 
                  aria-expanded="false" 
                  aria-controls={`collapse${index + 2 + currentAndNextMonthWeeks.length}`}
                  onClick={handleAccordionToggle}
                >
                  {week.weekStart} - {week.weekEnd}
                </button>
              </h2>
              <div 
                id={`collapse${index + 2 + currentAndNextMonthWeeks.length}`} 
                className="accordion-collapse collapse" 
                aria-labelledby={`heading${index + 2 + currentAndNextMonthWeeks.length}`} 
                data-bs-parent="#accordionExample"
                onTransitionEnd={handleAccordionToggle}
              >
                <div className="accordion-body">
                  <p>Content for {week.weekStart} - {week.weekEnd}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button to toggle previous month's weeks */}
        {!showPreviousMonth && (
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => setShowPreviousMonth(true)}
          >
            Show Previous Month
          </button>
        )}
      </div>
    </div>
  );
}
