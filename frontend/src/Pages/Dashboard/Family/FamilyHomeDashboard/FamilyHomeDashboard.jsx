import React, { useEffect, useState } from 'react';
import { PiStudent } from "react-icons/pi";
import { AiFillPoundCircle } from "react-icons/ai";
import { BsCalendar2EventFill } from "react-icons/bs";
import { Chart, BarElement, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import './FamilyHomeDashboard.css';
import familyManager from '../../../../api/services/family/FamilyManager'
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../components/Loader/Loader';
import AnnouncementApi from '../../../../api/services/family/Announcement/AnnouncementManager';
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux';
// Register the necessary components for your chart
Chart.register(
  BarElement,  // Register Bar element for bar charts
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// let dataToSend={};
export default function AdminHomeDashbboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [children, setChildren] = useState([]);
  const navigate = useNavigate(); // Hook for navigation
  const [loading, setLoading] = useState(true); // State to track loading
  const [length, setLength] = useState(0);
  const [absenteesData, setAbsenteesData] = useState([]); // To store absentee data
  const [isPopupVisible, setIsPopupVisible] = useState(false); // To toggle the popup visibility
  const [leaveReasons, setLeaveReasons] = useState({}); // To store reasons for leave input
  // const studentIds={"studentIds":["6740de095d03e8e7dc4cfc13","672e0f29f19d5863694acd70","6734d42e0d4ff6940c0715fd"]}
  const [dataToSend, setDataToSend] = useState({});
  const [dueAmount,setDueAmount]=useState(0)
  const [studentIds, setStudentIds] = useState([])
  const [event,setEvent]=useState([])
  const [eventlength, setEventLength] = useState(0);

  const [volunteerData] = useState(useSelector((state) => state?.user?.user?.familyRegNo));
  const data = {
    labels: ['Ali', 'Hamza', 'Saira'],
    datasets: [
      {
        label: 'Performance',
        backgroundColor: ['#5453ab', '#9fa1d8', '#f98e97', '#3498db', '#e74c3c'],
        borderColor: '#ffffff',
        borderWidth: 1,
        hoverBackgroundColor: '#3498db',
        hoverBorderColor: '#ffffff',
        data: [92, 67, 78],
      }
    ]
  };

  useEffect(() => {
    familyManager.getfamilystudents()
      .then((res) => {
        // console.log(res.data.students.length);
        setLength(res.data.students.length);
        const students = res.data.students.map(student => ({
          id: student._id, // Assuming the `id` is present in the object
          name: student.studentData.forename, // Extract the forename

        }));
        let setIds = res.data.students.map(student => student._id);
        setStudentIds(setIds);  // Update the state with student IDs
        // console.log("Student IDs: ", setIds)
        setChildren(students);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []); // Only runs on mount

  useEffect(() => {
    if (studentIds.length > 0) {
      
      familyManager.getAbsentees(studentIds)
        .then((res) => {
          

          // Process the absentee data to group by studentId
          const groupedAbsentees = res.data.reduce((acc, record) => {
            const { studentId, absentDate, attendanceId, status } = record;

            // If studentId is not in the accumulator, initialize it
            if (!acc[studentId]) {
              acc[studentId] = {
                studentId,
                absenteeRecords: [],
              };
            }

            // Add the absentDate and attendanceId to the student's absenteeRecords
            acc[studentId].absenteeRecords.push({ attendanceId, absentDate, status });

            return acc;
          }, {});

          // Convert the grouped object into an array
          const formattedAbsentees = Object.values(groupedAbsentees);

          // Set the formatted absentee data
          setAbsenteesData(formattedAbsentees);

          // Show the popup if there are absentees
          if (formattedAbsentees.length > 0) {
            setIsPopupVisible(true);
          }
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  }, [studentIds]);




  useEffect(()=>{
    setLoading(true);
    AnnouncementApi.getAnnouncement()
    .then((res)=>{
        // console.log(res.data.data)
        setEvent(res.data.data)
        setEventLength(res.data.data.length)
        setLoading(false);
    })
    .catch((err)=>{
        console.log(err)
        setLoading(true);
    })
},[])

  useEffect(()=>{
    familyManager.getFees({ familyRegNo: volunteerData})
    .then((res)=>{
        // console.log(res)
        setDueAmount(res.data.amountDue)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[])

  // Handle input changes for reasons for leave
  const handleReasonChange = (studentId, reason) => {
    setLeaveReasons((prevState) => ({
      ...prevState,
      [studentId]: reason,
    }));
  };


  // Handle saving the leave reasons
  const handleSave = () => {
    const recordsToSave = [];

    absenteesData.forEach(absentee => {
      const reasonForLeave = leaveReasons[absentee.studentId];

      if (reasonForLeave) {
        absentee.absenteeRecords.forEach(record => {
          recordsToSave.push({
            attendanceId: record.attendanceId,
            studentId: absentee.studentId,
            reason_for_leave: reasonForLeave,
          });
        });
      }
    });

    // console.log('Data to save:', recordsToSave);

    // Function to update the attendance reason
    familyManager.updateReason({ attendanceDetails: recordsToSave })
      .then((res) => {
        console.log(res);
        // Show success message with SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Thank You!',
          text: 'Your absent reason has been successfully updated.',
          confirmButtonText: 'Close'
        });
        setIsPopupVisible(false); // Close the popup after success
      })
      .catch((err) => {
        console.log(err);
        // Show error message with SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong. Please try again later.',
          confirmButtonText: 'Close'
        });
      });

    // You can send this data to an API if needed, for example:
    // familyManager.saveAbsenteeReasons(recordsToSave);
  };



  const handleClosePopup = () => {
    setIsPopupVisible(false); // Close the popup
  };

  const events = [
    { id: 1, title: "School Assembly", date: "2024-10-05", description: "All students are required to attend." },
    { id: 2, title: "Parent-Teacher Meeting", date: "2024-10-10", description: "Meet with teachers to discuss student progress." },
    { id: 3, title: "Field Trip to Museum", date: "2024-10-15", description: "A fun educational trip for all classes." },
  ];

  if (loading) {
    return <Loader />; // Show the loader if loading
  }


  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="container-fluid">
        <div className="row">
          {/* Cards Row */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card-dashboard" style={{ backgroundColor: "#5453ab" }}>
              <h5>Enrolled Students</h5>
              <div className="card-inner">
                <PiStudent className="card-icon" />
                <h5>{length}</h5>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card-dashboard" style={{ backgroundColor: "#f98e97" }}>
              <h5>Fees Due</h5>
              <div className="card-inner">
                <AiFillPoundCircle className="card-icon" />
                <h5>{dueAmount}</h5>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card-dashboard" style={{ backgroundColor: '#9fa1d8' }}>
              <h5>Events</h5>
              <div className="card-inner">
                <BsCalendar2EventFill className="card-icon" />
                <h5>{eventlength}</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Child List Row */}
        <div className="row mt-4">
          <div className="col-12">
            <h5 style={{ marginBottom: '20px', fontWeight: '600', color: '#333', fontSize: '18px' }}>
              Children List
            </h5>
            <div className="child-list" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'flex-start'
            }}>
              {children.map(child => (
                <div
                  key={child.id}
                  className="child-box"
                  style={{
                    padding: '10px',
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  }}
                  onClick={() => navigate(`/studentReport/${child.id}`)} // Navigate to the student report
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <PiStudent style={{ marginRight: '10px', fontSize: '18px' }} />
                  <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>{child.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Attendance Chart and Calendar */}
        <div className="row mt-4">
          <div className="col-lg-8 col-md-12 mb-4">
            <div className="chart-container" style={{
              height: '400px',
              width: '100%',
              overflow: 'hidden',
              padding: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              maxWidth: '100%',  // Ensure the chart stays within the container width
            }}>
              <h5 style={{ marginBottom: '20px', fontWeight: '600', color: '#333', fontSize: '18px' }}>
                Child Performance
              </h5>
              <Bar
                data={data}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  layout: {
                    padding: {
                      top: 20,
                      bottom: 20,
                      left: 20,
                      right: 20,
                    }
                  },
                  scales: {
                    x: {
                      ticks: { color: '#333', font: { size: 12 }, maxRotation: 0, autoSkip: true },
                      grid: {
                        display: false,
                      }
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { color: '#333', font: { size: 12 } },
                      grid: {
                        color: '#e0e0e0',
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#333',
                        font: {
                          size: 14
                        }
                      }
                    }
                  }
                }}
                height={300} // Adjust the height to ensure no overflow
              />
            </div>
          </div>

          <div className="col-lg-4 col-md-12 mb-4">
            <div className="calendar-container" style={{
              padding: '30px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              textAlign: 'center',
            }}>
              <h5 style={{ marginBottom: '20px', fontWeight: '600', color: '#333', fontSize: '18px' }}>
                Select Date
              </h5>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="react-calendar"
                tileClassName={({ date, view }) => {
                  if (date.getDate() === new Date().getDate()) {
                    return 'highlight'; // Add a highlight class for today's date
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Events/Announcements Section */}

        <div className="row mt-4">
          <div className="col-12">
            <div className="events-container">
              <h5 style={{ marginBottom: '20px', fontWeight: '600', color: '#333', fontSize: '18px' }}>
                Events & Announcements
              </h5>
              <ul style={{ listStyleType: 'none', padding: 0, height: '300px', overflow: 'auto' }}>
                {event.map(event => (
                  <li key={event._id}>
                    <h6 style={{ margin: '0', color: '#3498db' }}>{event.title}</h6>
                    <p style={{ margin: '5px 0', color: '#666' }}>{event.description}</p>
                    <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>{new Date(event.date).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {isPopupVisible && (
          <div
  className="popup"
  style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    width: "80%",
    maxWidth: "500px",
    maxHeight: "80vh", // Restricts height to viewport
    overflow: "auto", // Show scrollbars only when needed
  }}
>
            <button
              onClick={handleClosePopup}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#333',
              }}
            >
              &times;
            </button>
            <h4>Absentee List</h4>
            {absenteesData.map(absentee => (
              <div key={absentee.studentId} style={{ marginBottom: '10px' }}>
                <h6>{children.find(child => child.id === absentee.studentId)?.name}</h6>
                <p>Dates: {absentee.absenteeRecords.map(record => {
                  const d = new Date(record.absentDate);
                  const formattedDate = d.toLocaleDateString('en-US', {
                    year: '2-digit', // 2-digit year format (e.g., '24' for 2024)
                    month: '2-digit', // 2-digit month (e.g., '10' for October)
                    day: '2-digit', // 2-digit day (e.g., '11')
                  });
                  const status=record.status
                  //const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }); // Get the full weekday name (e.g., 'Monday')

                  return `${formattedDate} (${status}) `;
                }).join(', ')}</p>

                <input
                  type="text"
                  placeholder="Enter reason for leave"
                  value={leaveReasons[absentee.studentId] || ''}
                  onChange={(e) => handleReasonChange(absentee.studentId, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '10px',
                    fontSize: '14px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
            ))}

            <button
              onClick={handleSave}
              style={{
                padding: '10px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
              }}>
              Save Reasons
            </button>

          </div>
        )}


      </div>
    </div>
  );
}
