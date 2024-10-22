import { useState, useEffect } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import './AddClass.css'; // Ensure you have this CSS file for styles

import ClassManager from "../.././../../../api/services/admin/class/classManager";
import SessionManager from '../../../../../api/services/admin/session/sessionManager';

export default function AddClass() {
  const [className, setClassName] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetching sessions data
    SessionManager.getAllSessions()
      .then((res) => {
        setSessions(res.data); // Save sessions data to state
        setIsLoading(false); // Stop loading
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log class name and selected session
    console.log({ className, selectedSession });

    // Example API call (adjust based on your API structure)
    ClassManager.createNewClass({ class_name: className, session: selectedSession })
      .then((res) => {
        setClassName('');
        setSelectedSession(''); // Reset selected session
        alert(res.data.msg);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.msg);
      });
  };

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div style={{ backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '30px', boxShadow: '0px 0px 1px 0px gray' }}>
        <h6>Class <span style={{ fontWeight: '400' }}>| <AiOutlineHome className="sidebar-icon" style={{ marginRight: '5px' }} />- Add Class</span></h6>
      </div>
      <div className={`classContainer ${isLoading ? 'loading' : ''}`}>
        <div className='classBox'>
          <h5>Add New Class</h5>
          <form onSubmit={handleSubmit}>
            {/* Class Name */}
            <div className='form-group AddClassFormGroup'>
              <label htmlFor="className" className="field-label required-bg">Class Name*</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="class_name"
                  className="form-input"
                  placeholder="Enter class name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required // Mark as required
                />
              </div>
            </div>

            {/* Session Dropdown */}
            <div className='form-group AddClassFormGroup'>
              <label htmlFor="session" className="field-label required-bg">Select Session*</label>
              <div className="input-wrapper">
                <select
                  id="session"
                  className="form-input"
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  required
                >
                  <option value="" disabled>Select session</option>
                  {sessions.map((session) => (
                    <option key={session._id} value={session._id}>
                      {session.session_year} 
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className='submit-button'>Add Class</button>
          </form>
        </div>
      </div>
    </div>
  );
}
