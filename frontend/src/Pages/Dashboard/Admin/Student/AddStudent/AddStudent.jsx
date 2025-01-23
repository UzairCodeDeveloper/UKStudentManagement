import  { useEffect, useState } from 'react';
import './AddStudent.css';
import { AiOutlineHome } from "react-icons/ai";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClassManager from "../../../../../api/services/admin/class/classManager"

import StudentServices from "../../../../../api/services/admin/student/studentManager";
import Loader from '../../../../../components/Loader/Loader';
import Swal from "sweetalert2";
export default function AddStudent() {
  // State variables for each input
  const [forename, setForename] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [classes, setClasses] = useState('');
  const [familyRegNo, setFamilyRegNo]=useState('')
  const [familyRegNoData, setFamilyRegNoData] = useState([]); // Store the dropdown data
  const [selectedOption, setSelectedOption] = useState(""); // Track dropdown selection
  const [isAddingNew, setIsAddingNew] = useState(false); // Toggle "New" input visibility
  // Doctor details
  const [doctorName, setDoctorName] = useState('');
  const [doctorAddress, setDoctorAddress] = useState('');
  const [gpSurgeryContact, setGpSurgeryContact] = useState('');
  const [childAllergic, setChildAllergic] = useState(false);
  const [takeMedicine, setTakeMedicine] = useState(false);
  const [learningDifficulty, setLearningDifficulty] = useState(false);
  const [concernAware, setConcernAware] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState('');
  const [childAlergicDetail, setChildAllergicDetail] = useState('')
  const [TakeMedicineDetail, setTakeMedicineDetail] = useState('')
  const [LearningDifficultyDetail, setLearningDifficultyDetail] = useState('')
  const [concernAwareDetail, setConcernAwareDetail] = useState('')
  
  const [selectedCertificates, setSelectedCertificates] = useState([]);

  // Guardian details
  const [guardianName, setGuardianName] = useState('');
  const [relationToChild, setRelationToChild] = useState('');
  const [guardianAddress, setGuardianAddress] = useState('');
  const [primaryContactNumber, setPrimaryContactNumber] = useState('');
  const [secondaryContactNumber, setSecondaryContactNumber] = useState('');
  const [email,setemail]=useState('')

  // Interest/Hobby details
  const [hobbyInterest, setHobbyInterest] = useState('');
  const [involvedInSport, setInvolvedInSport] = useState(false);
  const [fitForActivity, setFitForActivity] = useState(false);

  // Fees Payment details
  const [paymentType, setPaymentType] = useState('');
  const [otherPaymentType, setOtherPaymentType] = useState('');

  // Authorisation and Declaration
  const [photoConsent, setPhotoConsent] = useState('');

  // State for signature input
  const [signature, setSignature] = useState('');
  // Error messages
  const [error, setError] = useState('');
  const [classData,setClassData]=useState([]);

  const [loading, setLoading] = useState(true); // State to track loading
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!forename || !surname || !gender || !dob || !doctorName || !doctorAddress || !gpSurgeryContact  || !guardianName || !relationToChild || !guardianAddress || !primaryContactNumber || !primaryContactNumber  || !email) {
      setError('Please fill in all required fields.');
      return;
    }

    // If validation passes, you can handle your submission logic here
    const studentData = {
      familyRegNo,
      forename,
      surname,
      gender,
      dob, // Ensure this is in "YYYY-MM-DD" format
      class_id: classes,
      role:'student', 
      msuExamCertificate: selectedCertificates,
      doctorDetails: {
          doctorName,
          doctorAddress,
          gpSurgeryContact,
          childAllergic,
          childAlergicDetail,
          takeMedicine,
          takeMedicineDetail: TakeMedicineDetail, // Correct the casing here
          learningDifficulty,
          learningDifficultyDetail: LearningDifficultyDetail, // Correct the casing here
          concernAware,
          concernAwareDetail,
          medicalInfo,
      },
      guardianDetails: {
          guardianName,
          relationToChild,
          guardianAddress,
          email,
          primaryContactNumber,
          secondaryContactNumber,
      },
      interests: {
          hobbyInterest,
          involvedInSport,
          fitForActivity,
      }
  };
  
  
  // console.log(selectedCertificates)
  
//  console.log(studentData)

 StudentServices.createStudent(studentData)
 .then((res) => {
   // Stop loading spinner or indicator
   setLoading(false);

   // Extract the response data
   const { user_id, password, familyRegNo, familyPassword, isNewFamily } = res.data;

   // Build the message for SweetAlert
   const alertMessage = `
     <strong>Student ID:</strong> ${user_id} <br />
     <strong>Password:</strong> ${password} <br />
     ${isNewFamily ? `<strong>Family ID:</strong> ${familyRegNo} <br />
     <strong>Family Password:</strong> ${familyPassword} <br />` : ""}
   `;

   // Show SweetAlert with the response data
   Swal.fire({
     title: "Student Added Successfully!",
     html: alertMessage, // Display the HTML content
     icon: "success",
     confirmButtonText: "OK",
   });

   // Reset the form
   resetForm();
 })
 .catch((err) => {
   // Stop loading spinner or indicator
   setLoading(false);

   // Log error message
   const errorMsg = err.response?.data?.msg || "Error occurred";

   // Show error toast notification
   toast.error(errorMsg, {
     position: "top-center",
   });
 });


  };

  const resetForm = () => {
    setFamilyRegNo('');
    setForename('');
    setSurname('');
    setGender('');
    setDob('');
    // setMsuExamCertificate([]);
    setClasses('');
    setDoctorName('');
    setDoctorAddress('');
    setGpSurgeryContact('');
    setChildAllergic(false);
    setTakeMedicine(false);
    setLearningDifficulty(false);
    setConcernAware(false);
    setMedicalInfo('');
    setGuardianName('');
    setRelationToChild('');
    setGuardianAddress('');
    setemail('')
    setPrimaryContactNumber('');
    setSecondaryContactNumber('');
    setHobbyInterest('');
    setInvolvedInSport(false);
    setFitForActivity(false);
    setPaymentType('');
    setOtherPaymentType('');
    setChildAllergicDetail(false),
      setTakeMedicineDetail(false),
      setLearningDifficultyDetail(''),
      setConcernAwareDetail(''),
      setError(''); // Clear any existing errors
    setSelectedCertificates([]),
    setSignature(''),
    setPhotoConsent('')

  };


  const certificates = [
    { id: 'None', label: 'None' },
    { id: 'Book 1', label: 'Book 1' },
    { id: 'Book 2', label: 'Book 2' },
    { id: 'Book 3', label: 'Book 3' },
    { id: 'Book 4', label: 'Book 4' },
    { id: 'Book 5', label: 'Book 5' },
    { id: 'Book 6', label: 'Book 6' },
    { id: 'Book 7', label: 'Book 7' },
  ];

  const handleCheckboxChange = (event) => {

    const { id, checked } = event.target;
    console.log(event.target)
    if (checked) {
      // Add the selected certificate to the array
      setSelectedCertificates([...selectedCertificates, id]);
    } else {
      // Remove the certificate from the array if unchecked
      setSelectedCertificates(selectedCertificates.filter(certificate => certificate !== id));
    }
  };

  useEffect(()=>{
    setLoading(true);
    ClassManager.getAllClasses()
    .then((res)=>{
      
      setClassData(res.data);
      setLoading(false);

    })
    .catch((err)=>{
      console.log(err)
      setLoading(false);
    })
  },[])

  useEffect(() => {
    // Fetch familyRegNo data from API
    StudentServices.getAllFamilyNo()
      .then((res) => {
        const families = res.data.families.map((family) => family.familyRegNo);
        setFamilyRegNoData(families);

        // Set the last familyRegNo as default selected option
        if (families.length > 0) {
          setSelectedOption(families[families.length - 1]);
          setFamilyRegNo(families[families.length - 1]); // Default value for familyRegNo
        }
      })
      .catch((err) => {
        console.log("Error fetching familyRegNo:", err);
      });
  }, []);

  const handleSelectChange = (e) => {
    const value = e.target.value;

    if (value === "New") {
      // Show the input field for new Family RegNo
      setIsAddingNew(true);
      setFamilyRegNo(""); // Clear the value for manual input
    } else {
      // Use selected Family RegNo from dropdown
      setIsAddingNew(false);
      setFamilyRegNo(value); // Update Family RegNo with selected value
    }

    setSelectedOption(value);
  };


  if (loading) {
    return <Loader />; // Show the loader if loading
  }

  return (
    <div className="add-student-container">
      <div style={{ backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '30px', boxShadow: '0px 0px 1px 0px gray' }}><h6 >Students <span style={{ fontWeight: '400' }}>| <AiOutlineHome className="sidebar-icon" style={{ marginRight: '5px' }} />- Add Students</span></h6></div>
      <div className="container-fluid admission-header text-center " style={{ marginTop: '30px' }}>
        <h1>Admission Form</h1>
        <div className="form-indicators">
          <span className="required-indicator">Required*</span>
          <span className="optional-indicator">Optional</span>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Student Information Section */}
        <div className="form-section">
          <h4><span className="section-number">1</span> Student Information</h4>
          <div className="form-grid">
          


          {/* Dropdown to select Family RegNo */}
      <div className="form-group">
        <label className="field-label required-bg">Family Reg No*</label>
        <div className="input-wrapper">
          <select
            className="form-input"
            value={selectedOption}
            onChange={handleSelectChange}
            required
          >
            {/* <option value="">Select Family Reg No</option> */}
            {familyRegNoData.map((regNo, index) => (
              <option key={index} value={regNo}>
                {regNo}
              </option>
            ))}
            <option value="New">New</option>
          </select>
        </div>
      </div>

      {/* Input field for adding new Family RegNo */}
      {isAddingNew && (
        <div className="form-group">
          <label className="field-label required-bg">Enter New Family Reg No*</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter Registration No"
              className="form-input"
              value={familyRegNo}
              onChange={(e) => setFamilyRegNo(e.target.value)}
              required
            />
          </div>
        </div>
      )}
            {/* Forename */}
            <div className="form-group">
              <label className="field-label required-bg">Forename*</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter Forename"
                  className="form-input"
                  value={forename}
                  onChange={(e) => setForename(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Surname */}
            <div className="form-group">
              <label className="field-label required-bg">Surname*</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter Surname"
                  className="form-input"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="form-group">
              <label className="field-label required-bg">Gender*</label>
              <div className="input-wrapper">
                <select
                  className="form-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label className="field-label required-bg">Date of Birth*</label>
              <div className="input-wrapper">
                <input
                  type="date"
                  className="form-input"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="field-label required-bg">Class*</label>
              <div className="input-wrapper">
                <select
                  className="form-input"
                  value={classes}
                  onChange={(e) => setClasses(e.target.value)}
                  required
                >
                  <option value="">Select Class</option>
                  {classData.map((val,key)=>{
                    return(
                      <option key={key} value={val._id}>{val.class_name}</option>
                    )
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* MSU EXAM Certificate */}
        <div className="certificate-section">
        <h4 style={{ fontWeight: 'bold', fontSize: '15px', borderBottom: '1px solid black', paddingBottom: '10px' }}>
          <span className='section-number'>2</span> MSU Certificates
        </h4>
        <label className="certificate-label required-bg" style={{ fontSize: '12px' }}>MSU EXAM Certificate</label>

        <div className="checkbox-list btn-group" role="group" aria-label="MSU Certificate Toggle Button Group">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="checkbox-item">
              <input
                  type="checkbox"
                  id={certificate.id}
                  value={certificate.id}
                  checked={selectedCertificates.includes(certificate.id)}
                  onChange={handleCheckboxChange}
                  className="btn-check"
                  autoComplete="off"
                  
                />
              <label htmlFor={certificate.id} className="btn btn-outline-primary" style={{border:'2px solid #7b5fed'}}>
                {certificate.label}
              </label>
            </div>
          ))}
        </div>
        </div>

        {/* Doctor Details Section */}
        <div className="form-section">
          <h4 style={{ fontSize: '1rem' }}><span className="section-number" >2</span> Doctor Details</h4>
          <div className="form-grid">
            {/* Doctor Name */}
            <div className="form-group">
              <label className="field-label required-bg">Doctor Name*</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter Doctor Name"
                  className="form-input"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="field-label required-bg">Address*</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter Address"
                  className="form-input"
                  value={doctorAddress}
                  onChange={(e) => setDoctorAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* GP Surgery Contact Number */}
            <div className="form-group">
              <label className="field-label required-bg">GP Surgery Contact Number*</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  placeholder="Enter Contact Number"
                  className="form-input"
                  value={gpSurgeryContact}
                  onChange={(e) => setGpSurgeryContact(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Child Allergic */}
            <div className="form-group">
              <label className="field-label required-bg">Child Allergies*</label>
              <div className="input-wrapper">
                <select
                  className="form-input"
                  value={childAllergic}
                  onChange={(e) => setChildAllergic(e.target.value === "true")}
                  required
                >
                  <option value="">Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>

            {childAllergic && (
              <div className="form-group">
                <label className="field-label required-bg">Enter Child Allergies*</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter Child Allergies"
                    className="form-input"
                    value={childAlergicDetail}
                    onChange={(e) => setChildAllergicDetail(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Take Medicine */}
            <div className="form-group">
              <label className="field-label required-bg">Does the child take medicine?*</label>
              <div className="input-wrapper">
                <select
                  className="form-input"
                  value={takeMedicine}
                  onChange={(e) => setTakeMedicine(e.target.value === "true")} 
                  required
                >
                <option value="">Select</option>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
            </div>

            {takeMedicine  && (
              <div className="form-group">
                <label className="field-label required-bg">Enter Medicine Details*</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter Medicine Details"
                    className="form-input"
                    value={TakeMedicineDetail}
                    onChange={(e) => setTakeMedicineDetail(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Learning Difficulty */}
            <div className="form-group">
              <label className="field-label required-bg">Learning Difficulty?*</label>
              <div className="input-wrapper">
                <select
                  className="form-input"
                  value={learningDifficulty}
                  onChange={(e) => setLearningDifficulty(e.target.value)}
                >
                <option value="">Select</option>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
            </div>

            {learningDifficulty  && (
              <div className="form-group">
                <label className="field-label required-bg">Enter Learning Difficulty Details*</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter Learning Difficulty Details"
                    className="form-input"
                    value={LearningDifficultyDetail}
                    onChange={(e) => setLearningDifficultyDetail(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Concern Aware */}
            <div className="form-group">
              <label className="field-label required-bg">Is the child aware of any concerns?*</label>
              <div className="input-wrapper">
                <select
                  className="form-input"
                  value={concernAware}
                  onChange={(e) => setConcernAware(e.target.value)}
                  required
                >
                <option value="">Select</option>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
            </div>

            {concernAware  && (
              <div className="form-group">
                <label className="field-label required-bg">Enter Concern Details*</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter Concern Details"
                    className="form-input"
                    value={concernAwareDetail}
                    onChange={(e) => setConcernAwareDetail(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Medical Info */}
            <div className="form-group">
              <label className="field-label optional-bg">Medical Information</label>
              <div className="input-wrapper">
                <input
                  placeholder="Enter Medical Information"
                  className="form-input"
                  value={medicalInfo}
                  onChange={(e) => setMedicalInfo(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>




          </div>
        </div>

        {/* Guardian Details Section */}
        <div className="form-section">
          <h4><span className="section-number">3</span> Guardian Details</h4>
          <div className="form-grid">
            {/* Guardian Name */}
            <div className="form-group">
              <label className="field-label required-bg">Guardian Name*</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter Guardian Name"
                  className="form-input"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Relation to Child */}
            <div className="form-group">
              <label className="field-label required-bg">Relation to Child*</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter Relation"
                  className="form-input"
                  value={relationToChild}
                  onChange={(e) => setRelationToChild(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Guardian Address */}
            <div className="form-group">
              <label className="field-label required-bg">Guardian Address*</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter Address"
                  className="form-input"
                  value={guardianAddress}
                  onChange={(e) => setGuardianAddress(e.target.value)}
                  required
                />
              </div>
            </div>


            <div className="form-group">
              <label className="field-label required-bg">Email*</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter Email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Primary Contact Number */}
            <div className="form-group">
              <label className="field-label required-bg">Primary Contact Number*</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  placeholder="Enter Primary Contact"
                  className="form-input"
                  value={primaryContactNumber}
                  onChange={(e) => setPrimaryContactNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Secondary Contact Number */}
            <div className="form-group">
              <label className="field-label optional-bg">Secondary Contact Number</label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  placeholder="Enter Secondary Contact"
                  className="form-input"
                  value={secondaryContactNumber}
                  onChange={(e) => setSecondaryContactNumber(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="form-section">
          <h4><span className="section-number">4</span> Interests/Hobbies</h4>
          <div className="form-grid">
            {/* Hobby/Interest */}
            <div className="form-group">
              <label className="field-label optional-bg">Hobby/Interest</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter Hobby/Interest"
                  className="form-input"
                  value={hobbyInterest}
                  onChange={(e) => setHobbyInterest(e.target.value)}
                />
              </div>
            </div>

            {/* Involved in Sport */}
            <div className="form-group">
              <label className="field-label optional-bg">Involved in Sports</label>
              <div className="input-wrapper">
                <select
                  className="form-input"
                  value={involvedInSport}
                  onChange={(e) => setInvolvedInSport(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>

            {/* Fit for Activity */}
            <div className="form-group">
              <label className="field-label optional-bg">Fit for Activity</label>
              <div className="input-wrapper">
                <select
                  className="form-input"
                  value={fitForActivity}
                  onChange={(e) => setFitForActivity(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Fees Payment Section */}
        <div className="form-section">
          <h4><span className="section-number">5</span> Fees Payment</h4>
          <div className="form-grid">
            {/* Payment Type */}
            <div className="form-group">
              <label className="field-label required-bg">Payment Type*</label>
              <div className="input-wrapper">
                <select
                  className="form-input"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  required
                >
                  <option value="">Select Payment Type</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Direct Debit</option>
                  <option value="bankTransfer">Standing Order</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Other Payment Type */}
            {paymentType === 'other' && (
              <div className="form-group">
                <label className="field-label optional-bg">Please Specify</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter Payment Type"
                    className="form-input"
                    value={otherPaymentType}
                    onChange={(e) => setOtherPaymentType(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="form-section">
          <h4><span className="section-number">6</span>Authorisation and Declaration</h4>
          <div className="form-section-container">



            <div className="form-group">
              <h6 className="question-text">
                1. Students may be photographed or recorded on video to be published on the website, used on IMAM social media accounts, released to the press, or used to celebrate their academic/sporting success.
              </h6>
              <h6 className="question-text">
                Are you prepared to allow photographs or videos to be taken of your child for the aforementioned purpose?
              </h6>
              <div className="radio-option-group" >
                <label style={{ color: 'black' }}>
                  <input type="radio" name="photoConsent" value="yes"  checked={photoConsent==='yes'} onChange={(e)=>setPhotoConsent(e.target.value)} required/>
                  Yes
                </label>
                
                <label style={{ color: 'black' }}>
                  <input type="radio" name="photoConsent" value="no"  checked={photoConsent==='no'} onChange={(e)=>setPhotoConsent(e.target.value)}/>
                  No
                </label>
              </div>
            </div>

            <div className="form-group">
              <h6 className="question-text">
                2. I confirm that the information given on the form is, to the best of my knowledge, true and complete. I will ensure that if any of the information given changes (e.g., medical conditions), I will inform the Madrassah.
              </h6>
              <h6 className="question-text">
                I understand the admission is subject to payment of fees. I also understand the fee is payable regardless of the student's absenteeism.
                <br />
                Please sign to confirm below:
              </h6>
              <div className="signature-input">
                <label htmlFor="signature" style={{color:'black'}}>Signature:</label>
                <input type="text" id="signature" name="signature" placeholder="Enter your signature" value={signature} onChange={(e) => setSignature(e.target.value) } required/>
              </div>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button btn btn-primary">Submit</button>
        <div className="form-group">

        </div>
      </form>
    </div>
  );
}
