import { useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import '../Classes/AddClass/AddClass.css'; // Ensure you have this CSS file for styles
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import AnnouncementApi from '../../../../api/services/admin/Announcement/AnnouncementManager';

export default function AddAnnouncement() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [announcementTo, setAnnouncementTo] = useState('All');

    const handleSubmit = (e) => {
        e.preventDefault();

        const data={
             title, date, description, announcementTo 
        }
        AnnouncementApi.createAnnouncement(data).
        then((res)=>{
            console.log(res)
        })
        .catch((err)=>{
            console.log(err)
        })

        // Log the values
        console.log({ title, date, description, announcementTo });

        // Here, you can handle the form submission (e.g., sending data to an API)
        // For now, we just show a success message using Toastify
        toast.success("Announcement Added Successfully");
    };

    return (
        <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
            <div style={{ backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '30px', boxShadow: '0px 0px 1px 0px gray' }}>
                <h6>Admin <span style={{ fontWeight: '400' }}>| <AiOutlineHome className="sidebar-icon" style={{ marginRight: '5px' }} />- Add Announcement</span></h6>
            </div>
            <div className="classContainer">
                <div className='classBox'>
                    <h5>Add  Announcement</h5>
                    <form onSubmit={handleSubmit}>

                        {/* Title Input */}
                        <div className='form-group AddClassFormGroup'>
                            <label htmlFor="title" className="field-label required-bg">Title*</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="title"
                                    className="form-input"
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required // Mark as required
                                />
                            </div>
                        </div>

                        {/* Date Picker */}
                        <div className='form-group AddClassFormGroup'>
                            <label htmlFor="date" className="field-label required-bg">Date*</label>
                            <div className="input-wrapper">
                                <input
                                    type="date"
                                    id="date"
                                    className="form-input"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Description Textarea */}
                        <div className='form-group AddClassFormGroup'>
                            <label htmlFor="description" className="field-label required-bg">Description*</label>
                            <div className="input-wrapper">
                                <textarea
                                    id="description"
                                    className="form-input"
                                    placeholder="Enter description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Announcement To Dropdown */}
                        <div className='form-group AddClassFormGroup'>
                            <label htmlFor="announcementTo" className="field-label required-bg">Announcement To*</label>
                            <div className="input-wrapper">
                                <select
                                    id="announcementTo"
                                    className="form-input"
                                    value={announcementTo}
                                    onChange={(e) => setAnnouncementTo(e.target.value)}
                                    required
                                >
                                    <option value="All">All</option>
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className='submit-button'>Add Announcement</button>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-center" /> {/* Set position to top-center */}
        </div>
    );
}
