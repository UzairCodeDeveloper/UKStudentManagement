import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { IoBookSharp } from "react-icons/io5";
dayjs.extend(isBetween); // Extend with the isBetween plugin
import DatePicker from 'react-datepicker'; // Ensure react-datepicker is installed
import 'react-datepicker/dist/react-datepicker.css'; // Import date picker styles
import './DetailedCourse.css';
import { MdOutlinePeopleAlt } from "react-icons/md";
import { LuFolderSymlink } from "react-icons/lu";

import { GrResources } from "react-icons/gr";
import { useNavigate, useParams } from 'react-router-dom';
import CourseManager from "../../../../../api/services/teacher/course/courseManager";
import Loader from '../../../../../components/Loader/Loader';

export default function DetailCourse() {
  // State to manage course start date selected via DatePicker
  const [startDate, setStartDate] = useState(null);
  const [courseData, setCourseData] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true)
  const [bookLink,setbookLink] =useState('')
  // Course duration constants
  const courseDurationMonths = 15;
  const navigate = useNavigate();

  // Function to generate weeks based on start date and 13-month duration
  const generateWeeks = (startDate) => {
    const weeks = [];
    if (!startDate) return weeks;
  
    // Calculate the end date as start date + courseDurationMonths * 4 weeks
    const endDate = dayjs(startDate).add(courseDurationMonths, 'month');
  
    // Adjust startDate to the start of the week (you can set it to the start of Monday, for example)
    const firstDayOfWeek = dayjs(startDate).startOf('week'); // Set to the start of the week (Sunday by default)
  
    // Loop over the entire duration (courseDurationMonths * 4 weeks)
    for (let i = 0; i < courseDurationMonths * 4; i++) {
      const weekStart = firstDayOfWeek.add(i, 'week').startOf('day'); // Ensure week starts at 00:00
      const weekEnd = weekStart.add(6, 'day').endOf('day'); // Ensure week ends at 23:59:59
  
      // Initialize an empty tasks array for this week
      const weeklyTasks = [];
  
      // Check tasks for the current week
      tasks.forEach((task) => {
        const taskDate = dayjs(task?.due_date);
  
        // Check if task falls within the current week (inclusive)
        if (taskDate.isBetween(weekStart, weekEnd, null, '[]')) {
          weeklyTasks.push({
            id: task._id, // Include the task ID
            title: task.title, // Include the task title
            submissionStatus: task.submissionRequired,
          });
        }
      });
  
      weeks.push({
        weekStart: weekStart.format('D MMM YYYY'),
        weekEnd: weekEnd.format('D MMM YYYY'),
        weekMonth: weekStart.month() + 1, // Get the month (0-indexed, so +1)
        weekYear: weekStart.year(),
        weekStartDate: weekStart, // Keep the date object for comparisons
        tasks: weeklyTasks, // Assigning weekly tasks
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
    (week.weekStartDate.isSame(currentMonth, 'month') || week.weekStartDate.isSame(nextMonth, 'month')) ||
    (week.weekStartDate.add(6, 'day').isSame(currentMonth, 'month') || week.weekStartDate.add(6, 'day').isSame(nextMonth, 'month'))
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
  const id = params.id;
  // console.log(id)
  useEffect(() => {

    CourseManager.getBookLink({role:"Teacher", courseId:id})
    .then((res)=>{
      
      setbookLink(res.data.bookLink)
    })
    .catch((err)=>{
      // console.log(err)
    })



    setLoading(true); // Set loading to true before fetching
    // Fetch the course and resources separately
CourseManager.getCourseByIdInstructor(id)
.then(courseRes => {
  // Set the course data
  console.log(courseRes.data.classDetails.session.start_date);
  setStartDate(new Date(courseRes.data.classDetails.session.start_date));
  setCourseData(courseRes.data);
})
.catch(err => {
  console.error('Error fetching course data:', err);
  // Optionally handle error case for course fetch
  setCourseData(null);  // or some fallback value if necessary
})
.finally(() => {
  setLoading(false); // Set loading to false once course data is fetched
});



// Fetch the resources separately
CourseManager.getResourcesByCourse(id)
.then(resourcesRes => {
  const filteredResources = resourcesRes.data.data.filter(resource =>
    !['BOOK', 'SYLLABUS', 'OUTLINE'].includes(resource.resource_type)
  );

  if (filteredResources.length === 0) {
    // If no valid resources are found, you can handle it here
    console.log("No resources found for this course.");
    setTasks([]);  // or set default task data if required
  } else {
    // Otherwise, set the resources as tasks
    setTasks(filteredResources); 
  }
})
.catch(err => {
  console.error('Error fetching resources:', err);
  // Optionally handle error case for resources fetch
  setTasks([]);  // or some fallback value if needed
});

  }, [id]);

  if (loading) {
    return <Loader />; // Show loader while loading
  }



  const getUrl=(value)=>{
    CourseManager.getPreSignedUrl(value)
    .then((res)=>{
      window.open(res.data.preSignedUrl, '_blank');
    })
    .catch((err)=>{
      console.log("Failed to Fetch Resource")
    })
  }
  return (
    <div className="courses-dashboard">
      <h3>{courseData?.course?.course_name}</h3>

      {/* DatePicker to select course start date */}
      <div className="date-picker-container" style={{ marginBottom: '20px', display: 'none' }}>
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
                  style={{ fontWeight: '600', fontSize: '22px', backgroundColor: 'none !important' }}
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
                  <div className='accordionBox' style={{ border: '1px solid #dee2e6', padding: '20px', borderRadius: '10px' }}>
                    <GrResources style={{ backgroundColor: '#f7634d', color: 'white', fontSize: '3rem', padding: '5px', borderRadius: '5px' }} />
                    <span style={{ fontSize: '1.2rem', marginLeft: '20px' }}><a href='' style={{ cursor: 'pointer' }} onClick={(e) => {
                      e.preventDefault(); // Prevent the default anchor behavior
                      navigate(`/courseResources/${id}`); // Use navigate to change route
                    }}>Resources</a></span>
                  </div>
                  <div className='accordionBox' style={{ border: '1px solid #dee2e6', padding: '20px', borderRadius: '10px', marginTop: '10px' }}>
                    <LuFolderSymlink style={{ backgroundColor: '#5d63f6', color: 'white', fontSize: '3rem', padding: '5px', borderRadius: '5px' }} />
                    <span style={{ fontSize: '1.2rem', marginLeft: '20px' }}><a href='' style={{ cursor: 'pointer' }} onClick={(e) => {
                      e.preventDefault(); // Prevent the default anchor behavior
                      navigate(`/handouts/${id}`); // Use navigate to change route
                    }}>Handouts</a></span>
                  </div>
                  <div className='accordionBox' style={{ border: '1px solid #dee2e6', padding: '20px', borderRadius: '10px', marginTop: '10px' }}>
                    <IoBookSharp style={{ backgroundColor: '#ff6514', color: 'white', fontSize: '3rem', padding: '5px', borderRadius: '5px' }} />
                    <span style={{ fontSize: '1.2rem', marginLeft: '20px' }}><a href='' style={{ cursor: 'pointer' }} onClick={(e) => {
                      e.preventDefault(); // Prevent the default anchor behavior
                      getUrl(bookLink)
                    }}>BOOK</a></span>
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
                    {currentWeekStartDate.isSame(week.weekStartDate, 'week') && (
                      <span
                        className="currently-week"
                        style={{
                          marginLeft: '20px',
                          fontSize: '12px',
                          backgroundColor: '#0f47ad',
                          color: 'white',
                          fontWeight: '500',
                          padding: '5px',
                          borderRadius: '10px',
                        }}
                      >
                        Current Week
                      </span>
                    )}
                  </button>
                </h2>
                <div
                  id={`collapse${index + 2}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading${index + 2}`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    {/* Displaying tasks for the week */}
                    {week.tasks.length > 0 ? (
                      <ul>
                        {week.tasks.map((task, taskIndex) => (
                          <li key={task.id} style={{ listStyle: 'none' }}>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                // Conditionally navigate based on submissionStatus
                                if (task.submissionStatus === 'Yes') {
                                  navigate(`/resourcegrading/${task.id}`); // Navigate to resource grading if status is 'Yes'
                                } else {
                                  navigate(`/resource/${courseData?.course?.course_name}/${task.id}`); // Navigate to /resource if status is 'No'
                                }
                              }}
                            >
                              <GrResources style={{ color: '#f7634d', marginRight: '5px' }} />
                              {task.title} {/* Access the title of the task */}
                            </a>
                          </li>
                        ))}

                      </ul>
                    ) : (
                      <p>No tasks available for this week.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

          </div>
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
