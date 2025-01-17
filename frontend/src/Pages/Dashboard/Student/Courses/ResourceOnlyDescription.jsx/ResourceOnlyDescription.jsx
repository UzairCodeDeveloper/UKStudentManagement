import { useEffect, useState} from 'react';
import { Table } from 'react-bootstrap'; // Importing the Table component from react-bootstrap
import { useParams } from 'react-router-dom';
import ResourceManager from "../../../../../api/services/student/ResourceManager"
import CourseManager from '../../../../../api/services/student/CourseManager'
import Loader from '../../../../../components/Loader/Loader';
export default function ShowClasses() {
  const [submissionTime, setSubmissionTime] = useState('2024-11-17 10:00 AM'); // Store submission time, you can replace this with actual time
  const [isSubmitted, setIsSubmitted] = useState(true); // Force submission to be true (remove the button and submission logic)
  const [description,setDescription]=useState('')
  const [fileLink, setFileLink]=useState('')
  const [title,settitle]=useState('')
  const [loading, setLoading] = useState(true); // State to track loading
  const [filetitle,setfileTitle]=useState("Submitted File")
  const param=useParams()
//   const course=param.course
  const id=param.id
  useEffect(() => {
    // Fetch resource details
    ResourceManager.getResourceByID(id)
      .then((res) => {
        // setResource(res.data.data); // Set resource details
        console.log(res.data.data)
        setDescription(res.data.data.description)
        setSubmissionTime( new Date(res.data.data.createdAt).toLocaleDateString())
        // setFileLink(res.data.data.resource_url)
        if (res.data.data.resource_url) {
          CourseManager.getPreSignedUrl(res.data.data.resource_url).
          then((res)=>{
            setFileLink(res.data.preSignedUrl)
          })
          .catch((err)=>{
            console.log(err)
          })
          setfileTitle("Resource File"); // Set a title for the link
        } else {
          setfileTitle("No File"); // Indicate no file is available
          setFileLink(""); // Clear the file link if no file is present
        }
        settitle(res.data.data.title)
        setLoading(false)
        // setIsSubmitted(res.data.isSubmitted); // Update submission status
        
      })
      .catch((err) => console.log(err));
  }, [id]);
  if (loading) {
    return <Loader />; // Show the loader if loading
  }
  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>
            Course <span className="sub-header"> - Resource</span>
          </h6>
        </div>

        {/* Search Bar */}
        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>{title}</h1>
        </div>

        <div style={{ marginTop: '100px' }}>
          
          <div style={{ marginLeft: '20px', marginTop: '50px' }}>
            <h5>Assignment Description:</h5>
            <p>{description}</p>
          </div>
          <h3 style={{ marginLeft: '20px', marginTop:'50px' }}>Submission Status</h3>

          {/* Submission Status Table */}
          {isSubmitted ? (
            <div style={{ marginTop: '20px', marginLeft: '20px' }}>
              {/* Adjusted Table layout with header column on left and values column on right */}
              <Table bordered hover responsive>
                <tbody>
                  <tr style={{ backgroundColor: '#f1f1f1' }}>
                    <td style={{ fontWeight: 'bold', background: "#f7f7f7" }}>Submission Status</td>
                    <td style={{ backgroundColor: '#cfefcf' }}>Submission Not Required</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>File</td>
                    <td><a href={fileLink} target='_blank' style={{textDecoration:'underlined'}}>{filetitle}</a></td>
                  </tr>
                  <tr style={{ backgroundColor: '#f1f1f1' }}>
                    <td style={{ fontWeight: 'bold' }}>Submission Time</td>
                    <td style={{ backgroundColor: '#cfefcf' }}>{submissionTime}</td>
                  </tr>
                  
                </tbody>
              </Table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
