import React, { useState } from 'react';
import { PiStudent } from "react-icons/pi";
import { Bar } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import './FamilyHomeDashboard.css';
import { BiBriefcase } from "react-icons/bi";
import { HiCurrencyDollar } from "react-icons/hi";
import { BsCalendar2EventFill } from "react-icons/bs";
import { Chart, BarElement, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

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

export default function AdminHomeDashbboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Data for the attendance chart
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

  // Sample events data
  const events = [
    { id: 1, title: "School Assembly", date: "2024-10-05", description: "All students are required to attend." },
    { id: 2, title: "Parent-Teacher Meeting", date: "2024-10-10", description: "Meet with teachers to discuss student progress." },
    { id: 3, title: "Field Trip to Museum", date: "2024-10-15", description: "A fun educational trip for all classes." },
  ];

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow:"auto" }}>
      <div className="container-fluid">
        <div className="row">
          {/* Cards Row */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card-dashboard" style={{ backgroundColor: "#5453ab" }}>
              <h5>Enrolled Students</h5>
              <div className="card-inner">
                <PiStudent className="card-icon" />
                <h5>2</h5>
              </div>
            </div>
          </div>

          

          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card-dashboard" style={{ backgroundColor: "#f98e97" }}>
              <h5>Fees Due</h5>
              <div className="card-inner">
                <HiCurrencyDollar className="card-icon" />
                <h5>20</h5>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card-dashboard" style={{ backgroundColor: '#9fa1d8' }}>
              <h5>Upcoming Events</h5>
              <div className="card-inner">
                <BsCalendar2EventFill className="card-icon" />
                <h5>2</h5>
              </div>
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
              <ul style={{ listStyleType: 'none', padding: 0,  height:'300px', overflow:'auto'}}>
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

      {/* Additional CSS for custom styling */}

    </div>
  );
}
