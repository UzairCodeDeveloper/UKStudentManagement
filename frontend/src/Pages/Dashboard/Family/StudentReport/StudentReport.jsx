import { Pie } from 'react-chartjs-2';
import img from './person.png';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import './StudentReport.css';

import { useState } from 'react';

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

// Events and Announcements data
const events = [
    { id: 1, title: "School Assembly", date: "2024-10-05", description: "All students are required to attend." },
    { id: 2, title: "Parent-Teacher Meeting", date: "2024-10-10", description: "Meet with teachers to discuss student progress." },
    { id: 3, title: "Field Trip to Museum", date: "2024-10-15", description: "A fun educational trip for all classes." },
];

// Behavioral Status data with percentage and emoji based on performance
const behavioralStatus = {
    percentage: 85, // Example percentage
};

// Determine the emoji based on the behavioral percentage
const getBehavioralEmoji = (percentage) => {
    if (percentage >= 90) return "😁";
    if (percentage >= 75) return "😊";
    if (percentage >= 50) return "😐";
    if (percentage >= 25) return "😟";
    return "😢";
};

// Grades data for subjects
const grades = [
    { subject: "Quran", performance: 85 },
    { subject: "Fiqah", performance: 70 },
    { subject: "Tamjeed", performance: 90 },
];

// Function to get stars based on performance
const getStars = (performance) => {
    const stars = Math.round(performance / 20);
    return "⭐".repeat(stars) || "No Rating";
};

export default function TeacherHomeDashboard() {
    return (
        <div className="dashboard-container">
            {/* Left Side: Profile Section */}
            <div className="left-section">
                <div className="profile-image">
                    <img src={img} alt="Profile" />
                    <h2 style={{ color: '#fa8b95', fontSize: '1.2rem', marginTop: '20px' }}>Ali</h2>
                </div>
                <div className="profile-details">
                    <div className="profile-detail-item"><strong>Role:</strong><span>Student</span></div>
                    <div className="profile-detail-item"><strong>Mobile No:</strong><span>9308590238</span></div>
                    <div className="profile-detail-item"><strong>DOB:</strong><span>12/12/2002</span></div>
                    <div className="profile-detail-item"><strong>Home Address:</strong><span>UK</span></div>
                    <div className="profile-detail-item"><strong>Gender:</strong><span>Male</span></div>
                    <div className="profile-detail-item"><strong>Postal Code:</strong><span>50342</span></div>
                </div>
            </div>

            {/* Right Side: Attendance, Calendar, Behavioral Status, and Grades Sections */}
            <div className="right-section">
                
                <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                    <div className="attendance-section" style={{ width: '45%' }}>
                    <h5 className="attendance-report-heading">1. Attendance Report</h5>
                        <div className="attendance-details">
                            <div className="attendance-chart small-pie-chart">
                                <Pie data={attendanceData} />
                            </div>
                            <div className="attendance-info">
                                <div className="attendance-summary">
                                    <div className="present attendencebox">
                                        <p style={{ fontWeight: 'bold', fontSize: '12px', marginTop: '5px' }}>PRESENTS</p>
                                        <div className="arrow-container">
                                            <p className="animated-arrow" style={{ marginTop: '-15px', marginRight: '20px' }}>➔</p>
                                            <p>1</p>
                                        </div>
                                    </div>
                                    <div className="absent attendencebox">
                                        <p style={{ fontWeight: 'bold', fontSize: '12px' }}>ABSENTS</p>
                                        <div className="arrow-container">
                                            <p className="animated-arrow" style={{ marginTop: '-15px', marginRight: '20px' }}>➔</p>
                                            <p>1</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Behavioral Status Section */}
                    <div className="behavioral-status-section " style={{ width: '45%', marginTop: '0px' }}>
                        <h5 className="status-heading attendance-report-heading">2. Behavioral Status</h5>
                        <div className="status-box">
                            <p style={{ fontSize: '7rem', textAlign: 'center' }}>{getBehavioralEmoji(behavioralStatus.percentage)}</p>
                            <p style={{ fontWeight: 'bold', textAlign: 'center', color: '#666' }}>{behavioralStatus.percentage}%</p>
                        </div>
                    </div>
                    {/* Grades Section */}
                    <div className="grades-section attendance-section" style={{ width: '50%', marginTop: '20px' }}>
                        <h5 className="grades-heading attendance-report-heading">3. Grades</h5>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {grades.map((grade, index) => (
                                <li key={index} style={{ marginBottom: '10px' }}>
                                    <p style={{ fontWeight: 'bold', color: '#3498db' }}>{grade.subject}</p>
                                    <p style={{ color: '#f1c40f' }}>{getStars(grade.performance)} ({grade.performance}%)</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Calendar Section */}
                    <div className="calendar-section" style={{ width: "50%" }}>
                        <Calendar />
                    </div>
                </div>

                
            </div>
        </div>
    );
}
