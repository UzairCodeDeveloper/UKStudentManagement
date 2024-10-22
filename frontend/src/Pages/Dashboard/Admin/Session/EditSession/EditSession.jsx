import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai";
import '../../Classes/AddClass/AddClass.css'; // Ensure you have this CSS file for styles
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import SessionManager from '../../../../../api/services/admin/session/sessionManager';

export default function EditSession() {
    const { id } = useParams();
    const navigate = useNavigate(); // Added navigate for redirect
    const [year, setYear] = useState('');
    const [startDate, setStartDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if id is valid
        if (!id) {
            toast.error("Invalid session ID."); // Show error if ID is invalid
            navigate("/sessions");
            return;
        }

        // Fetch session data by ID
        setIsLoading(true); // Start loading
        SessionManager.getSessionById(id)
            .then((res) => {
                console.log(res.data);
                // Set state with fetched data
                setYear(res.data.session_year); // Set year
                setStartDate(res.data.start_date.split('T')[0]); // Set start date (formatted)
            })
            .catch((e) => {
                console.log(e);
                toast.error("Error fetching session data."); // Show error if fetching fails
            })
            .finally(() => {
                setIsLoading(false); // Stop loading
            });
    }, [id, navigate]); // Include navigate in the dependency array

    // Function to calculate the end date (1.2 years from start date)
    const calculateEndDate = (start) => {
        if (!start) return '';
        const startDateObj = new Date(start);
        startDateObj.setFullYear(startDateObj.getFullYear() + 1); // Add 1 year
        startDateObj.setMonth(startDateObj.getMonth() + 2); // Add 2 months
        return startDateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    const handleYearChange = (e) => {
        const selectedYear = e.target.value;
        setYear(selectedYear);

        // Validate and reset start date if it's from the previous year
        const currentYear = new Date().getFullYear();
        if (selectedYear < currentYear) {
            setStartDate(''); // Reset start date if the year is in the past
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        // Check if the start date is valid based on the selected year
        const selectedStartYear = new Date(startDate).getFullYear();
        if (selectedStartYear < year) {
            toast.error("Start date cannot be from a previous year.");
            setIsLoading(false); // Stop loading
            return;
        }

        // Compute end date from the selected start date
        const endDate = calculateEndDate(startDate);

        // Log year, start date, and computed end date
        console.log({ year, startDate, endDate });

        // API call to update session
        SessionManager.updateSession(id, { session_year: year, start_date: startDate, end_date: endDate })
            .then((res) => {
               
                setTimeout(() => {
                    navigate("/sessions");
                }, 3000); // Redirect after successful update
                toast.success(res.data.msg); // Show success message
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response?.data?.msg || "An error occurred"); // Show error message
            })
            .finally(() => {
                setIsLoading(false); // Stop loading
            });
    };

    // Function to get the minimum date based on the selected year
    const getMinDate = () => {
        const currentYear = new Date().getFullYear();
        if (year && year < currentYear) {
            return `${year}-01-01`; // Return the first day of the selected year
        }
        return ''; // No minimum date if the selected year is the current year or later
    };

    return (
        <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
            <div style={{ backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '30px', boxShadow: '0px 0px 1px 0px gray' }}>
                <h6>Session <span style={{ fontWeight: '400' }}>| <AiOutlineHome className="sidebar-icon" style={{ marginRight: '5px' }} />- Edit Session</span></h6>
            </div>
            <div className={`classContainer ${isLoading ? 'loading' : ''}`}>
                <div className='classBox'>
                    <h5>Edit Session</h5>
                    <form onSubmit={handleSubmit}>
                        {/* Year Input */}
                        <div className='form-group AddClassFormGroup'>
                            <label htmlFor="year" className="field-label required-bg">Year*</label>
                            <div className="input-wrapper">
                                <input
                                    type="number" // Changed to number for better input handling
                                    id="year"
                                    className="form-input"
                                    placeholder="Enter year"
                                    value={year}
                                    onChange={handleYearChange} // Update handler
                                    required // Mark as required
                                />
                            </div>
                        </div>

                        {/* Start Date Picker */}
                        <div className='form-group AddClassFormGroup'>
                            <label htmlFor="startDate" className="field-label required-bg">Start Date*</label>
                            <div className="input-wrapper">
                                <input
                                    type="date"
                                    id="startDate"
                                    className="form-input"
                                    value={startDate}
                                    min={getMinDate()} // Set minimum date dynamically
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className='submit-button' disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Session'}
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-center" /> {/* Set position to top-center */}
        </div>
    );
}
