import { useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import '../Classes/AddClass/AddClass.css'; // Ensure you have this CSS file for styles
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

import SessionManager from '../../../../api/services/admin/session/sessionManager';

export default function AddClass() {
    const [year, setYear] = useState('');
    const [startDate, setStartDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Function to calculate the end date (1.2 years from start date)
    const calculateEndDate = (start) => {
        if (!start) return '';
        const startDateObj = new Date(start);
        startDateObj.setFullYear(startDateObj.getFullYear() + 1); // Add 1 year
        startDateObj.setMonth(startDateObj.getMonth() + 2); // Add 2 months
        return startDateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Compute end date from the selected start date
        const endDate = calculateEndDate(startDate);

        // Log year, start date, and computed end date
        console.log({ year, startDate, endDate });

        // Example API call (adjust based on your API structure)
        SessionManager.createSession({ session_year: year, start_date: startDate, end_date: endDate })
            .then((res) => {
                setYear('');
                setStartDate(''); // Reset fields
                toast.success(res.data.msg); // Show success message
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.msg); // Show error message
            });
    };

    // Function to get the minimum date based on the selected year
    const getMinDate = () => {
        if (!year) return ''; // Return empty if year is not set
        const currentYear = new Date().getFullYear();
        if (year < currentYear) {
            return `${year}-01-01`; // Minimum date is January 1 of the entered year
        } else if (year == currentYear) {
            return new Date().toISOString().split('T')[0]; // If current year, set to today
        }
        return ''; // Future years can have no min date
    };

    return (
        <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
            <div style={{ backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '30px', boxShadow: '0px 0px 1px 0px gray' }}>
                <h6>Session <span style={{ fontWeight: '400' }}>| <AiOutlineHome className="sidebar-icon" style={{ marginRight: '5px' }} />- Add Session</span></h6>
            </div>
            <div className={`classContainer ${isLoading ? 'loading' : ''}`}>
                <div className='classBox'>
                    <h5>Add New Session</h5>
                    <form onSubmit={handleSubmit}>

                        {/* Year Input */}
                        <div className='form-group AddClassFormGroup'>
                            <label htmlFor="year" className="field-label required-bg">Year*</label>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    id="year"
                                    className="form-input"
                                    placeholder="Enter year"
                                    value={year}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 4) { // Limit to 4 digits
                                            setYear(value);
                                        }
                                    }}
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
                                    
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className='submit-button'>Add Session</button>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-center" /> {/* Set position to top-center */}
        </div>
    );
}
