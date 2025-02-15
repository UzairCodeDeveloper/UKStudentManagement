import { useState, useEffect } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import '../../Classes/AddClass/AddClass.css'; // Ensure you have this CSS file for styles
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"; // Import icons

import ClassManager from "../.././../../../api/services/admin/class/classManager"
import CourseManager from "../../../../../api/services/admin/course/courseManager"
import volunteerManager from '../../../../../api/services/admin/volunteer/volunteerManager'
export default function AddClass() {
  const [selectedClass, setSelectedClass] = useState(''); // State for selected class
  // const [subjectInputs, setSubjectInputs] = useState([{ id: Date.now(), name: '' }]); // State for dynamic subject inputs
  const [subject,setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(''); 

  // Dummy data for classes
  // const classes = ['Class 1', 'Class 2', 'Class 3'];
  const [classes, setClassData] = useState([]);
  const [Teachers, setTeacherData] = useState([]);

  

  
  useEffect(()=>{
    ClassManager.getAllClasses()
    .then((res)=>{
      // console.log(res.data)
      setClassData(res.data);

    })
    .catch((err)=>{
      console.log(err)
    })

    volunteerManager.getAllVolunteers()
    .then((res)=>{
      console.log(res.data)
      setTeacherData(res.data);

    })
    .catch((err)=>{
      console.log(err)
    })
  },[])


  const handleSubmit = (e) => {
    e.preventDefault();

    // Log selected class and subjects
    // console.log({ class_id:selectedClass,
    //   course_name: subject
    //   //  subjects: subjectInputs.map(input => input.name) 
    //   });
      const data ={class_id:selectedClass,
        course_name: subject,
        volunteer_id:selectedTeacher
      }

      CourseManager.createNewClass(data)
      .then((res)=>{
        // console.log(res.data)
        alert("Subjects added successfully")
        setSubject(''); 
        setSelectedClass('');
        setSelectedTeacher('');
      })
      .catch((err)=>{
        console.log(err.response.data.msg)
        alert(err.response.data.msg)
      })
  };

  // const handleAddSubject = () => {
  //   setSubjectInputs([...subjectInputs, { id: Date.now(), name: '' }]); // Add new subject input
  // };

  // const handleRemoveSubject = (id) => {
  //   if (subjectInputs.length > 1) {
  //     setSubjectInputs(subjectInputs.filter(input => input.id !== id)); // Remove specific subject input
  //   }
  // };

  // const handleSubjectChange = (id, value) => {
  //   setSubjectInputs(subjectInputs.map(input => (input.id === id ? { ...input, name: value } : input)));
  // };

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div style={{ backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '30px', boxShadow: '0px 0px 1px 0px gray' }}>
        <h6>Subject <span style={{ fontWeight: '400' }}>| <AiOutlineHome className="sidebar-icon" style={{ marginRight: '5px' }} />- Add Subject</span></h6>
      </div>
      <div className={`classContainer ${isLoading ? 'loading' : ''}`}>
        <div className='classBox'>
          <h5>Add New Subjects</h5>
          <form onSubmit={handleSubmit}>
            {/* Select Class Dropdown */}
            <div className='form-group'>
              <label htmlFor="selectClass" className="field-label required-bg">Select Class*</label>
              <div className="input-wrapper">
                <select
                  id="selectClass"
                  className="form-input"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  required // Mark as required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls, index) => (
                    <option key={index} value={cls._id}>{cls.class_name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='form-group' style={{marginTop:'20px'}}>
              <label htmlFor="selectClass" className="field-label required-bg">Select Teacher*</label>
              <div className="input-wrapper">
                <select
                  id="selectClass"
                  className="form-input"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  required // Mark as required
                >
                  <option value="">Select Teacher</option>
                  {Teachers.map((cls) => (
                    <option key={cls._id} value={cls._id}>{cls.volunteer_details.full_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Subject Inputs */}
            {/* {subjectInputs.map((input, index) => ( */}
              <div 
              // key={input.id} 
              className='form-group AddClassFormGroup'>
                <label htmlFor={`subjectName`} className="field-label required-bg">Subject Name*</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id={`subjectName`}
                    className="form-input"
                    placeholder="Enter Subject name"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required // Mark as required
                  />
                  
                </div>
              </div>
            {/* ))} */}

            {/* Inline Add More and Remove Button */}
            {
              /* 
            <div className='actionsSubject' style={{ display: 'flex', alignItems: 'center', justifyContent:'center' , margin: '5px', gap:"10px" }}>
              <button type="button" className='btn btn-secondary' onClick={handleAddSubject} style={{ display: 'flex', alignItems: 'center',  fontSize:'11px', padding:"2px 10px"}}>
                <AiOutlinePlus style={{ marginRight: '5px' }} /> Add More
              </button>
              <button type="button" className='btn btn-dark' onClick={() => handleRemoveSubject(subjectInputs[subjectInputs.length - 1].id)} disabled={subjectInputs.length <= 1} style={{ display: 'flex', alignItems: 'center',fontSize:"11px", padding:"2px 10px" }}>
                <AiOutlineMinus style={{ marginRight: '5px'}} /> Remove
              </button>
            </div>
*/
}
            <button type="submit" className='submit-button ' style={{marginTop:'20px,',backgroundColor:'#ffc674', fontWeight:'400', color:'black'}}>Assign Subjects</button>
          </form>
        </div>
      </div>
    </div>
  );
}
