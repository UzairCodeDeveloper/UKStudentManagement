import { Pie } from 'react-chartjs-2';
import img from './person.png';
import img2 from './imge.png'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import './TeacherHomeDashboard.css';

import VolunteerServices from "../../../../api/services/admin/volunteer/volunteerManager"
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


// Register the necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

// Data for the pie chart (Present and Absent)
const attendanceData = {
    labels: ['P', 'A'],
    datasets: [
        {
            label: 'Attendance',
            data: [50, 50], // Example data
            backgroundColor: ['#6688f5', '#f98b94'], // Vibrant colors for Present, Absent
            borderColor: ['#6688f5', '#ff808b'],
            borderWidth: 1,
        },
    ],
};


const events = [
    { id: 1, title: "School Assembly", date: "2024-10-05", description: "All students are required to attend." },
    { id: 2, title: "Parent-Teacher Meeting", date: "2024-10-10", description: "Meet with teachers to discuss student progress." },
    { id: 3, title: "Field Trip to Museum", date: "2024-10-15", description: "A fun educational trip for all classes." },
    
];

export default function TeacherHomeDashboard() {
    // const data = useSelector((state) => state.user.user.volunteer.volunteer_details);
    // console.log(data)

    const [volunteerData] = useState(useSelector((state) => state?.user?.user?.volunteer?.volunteer_details));
    console.log(volunteerData)
    const days_to_commit=volunteerData.days_to_commit;
    const workingAreas=volunteerData.areas_of_working;
    console.log(days_to_commit)
   
    // useEffect(() => {
    //     // Call the API to get the volunteer data
    //     VolunteerServices.getVolunteerById(1)  
    //         .then((response) => {
    //             console.log(response.data);
    //             // Set the volunteer data in the state
    //             setVolunteerData(response.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, []);   



    return (
        <div className="dashboard-container">
            {/* Left Side: Profile Section */}
            <div className="left-section">
                <div className="profile-image">
                    <img src={img} alt="Profile" />
                    <h2 style={{ color: '#fa8b95', fontSize: '1.2rem', marginTop: '20px' }}>{volunteerData.full_name}</h2>
                </div>
                <div className="profile-details">
                    
                    <div className="profile-detail-item">
                        <strong>Employee Role:</strong>
                        <span>Teacher</span>
                    </div>
                    
                    {/* <div className="profile-detail-item">
                        <strong>Father / Husband Name:</strong>
                        <span>John Doe</span>
                    </div> */}
                    <div className="profile-detail-item">
                        <strong>Mobile No:</strong>
                        <span>{volunteerData.contact_number}</span>
                    </div>
                    <div className="profile-detail-item">
                        <strong>DOB:</strong>
                        <span>{new Date(volunteerData.dob).toLocaleDateString()}</span>
                        
                    </div>
                    <div className="profile-detail-item">
                        <strong>Home Address:</strong>
                        <span>{volunteerData.address}</span>
                    </div>
                    <div className="profile-detail-item">
                        <strong>Commit Days</strong>
                        {days_to_commit.map((val,key)=>{
                            return(
                                <span>{`${val}, `} </span>
                            )
                        })}
                        
                    </div>
                    <div className="profile-detail-item">
                        <strong>Working Areas:</strong>
                        {workingAreas.map((val,key)=>{
                            return(
                                <span>{`${val}, `} </span>
                            )
                        })}
                    </div>
                    <div className="profile-detail-item">
                        <strong>Gender:</strong>
                        <span>{volunteerData.gender}</span>
                    </div>
                    <div className="profile-detail-item">
                        <strong>Postal Code</strong>
                        <span>{volunteerData.postal_code}</span>
                    </div>
                    {/* <div className="profile-detail-item">
                        <strong>Blood Group:</strong>
                        <span>O+</span>
                    </div>
                    
                    <div className="profile-detail-item">
                        <strong>Experience:</strong>
                        <span>5 years</span>
                    </div> */}
                </div>

            </div>

            {/* Right Side: Attendance and Calendar Section */}
            <div className="right-section">
                {/* Attendance Section */}
                <div className="Intro">
                    <div>
                        <span className="waving-hand" style={{fontSize:'20px'}}>👋</span>
                        <span style={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }}>
                            Welcome <span style={{ fontWeight: '400' }}>{volunteerData.full_name}</span> to Teacher Portal
                        </span>
                    </div>
                    <div className='TeacherDashboardImage'>
                        <img src={img2} alt='img' className='org-image' /> {/* Adjusted class */}
                    </div>
                </div>

                <h5 className="attendance-report-heading">1. Attendance Report</h5>
                <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                    <div className="attendance-section" style={{ width: '45%' }}>
                        <div className="attendance-details">
                            <div className="attendance-chart small-pie-chart">
                                <Pie data={attendanceData} />
                            </div>
                            <div className="attendance-info">
                                <div className="attendance-summary">
                                    <div className="present attendencebox">
                                        <p style={{ fontWeight: 'bold', fontSize: '12px', marginTop: '5px', }}>PRESENTS</p>
                                        <div className="arrow-container">
                                            <p className="animated-arrow" style={{ marginTop: '-15px', marginRight: '20px' }}>➔</p> {/* Arrow */}
                                            <p>1</p>
                                        </div>
                                    </div>

                                    <div className="absent attendencebox">
                                        <p style={{ fontWeight: 'bold', fontSize: '12px' }}>ABSENTS</p>
                                        <div className="arrow-container">
                                            <p className="animated-arrow" style={{ marginTop: '-15px', marginRight: '20px' }}>➔</p> {/* Arrow */}
                                            <p>1</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Section */}
                    <div className="calendar-section" style={{ width: "50%" }}>

                        <Calendar />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="events-container">
                            <h5 style={{ marginBottom: '20px', fontWeight: '600', color: '#333', fontSize: '18px' }}>
                                Events & Announcements
                            </h5>
                            <ul style={{ listStyleType: 'none', padding: 0, height:'300px', overflow:'auto' }}>
                                {events.map(event => (
                                    <li key={event.id}>
                                        <h6 style={{ margin: '0', color: '#3498db' }}>{event.title}</h6>
                                        <p style={{ margin: '5px 0', color: '#666' }}>{event.description}</p>
                                        <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>{event.date}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
