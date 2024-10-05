import React, { useState } from 'react';
import './AddStudent.css';
import { AiOutlineHome } from "react-icons/ai";
export default function AddStudent() {
  // State variables for each input
  const [forename, setForename] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [msuExamCertificate, setMsuExamCertificate] = useState('none');

  // Doctor details
  const [doctorName, setDoctorName] = useState('');
  const [doctorAddress, setDoctorAddress] = useState('');
  const [gpSurgeryContact, setGpSurgeryContact] = useState('');
  const [childAllergic, setChildAllergic] = useState('');
  const [takeMedicine, setTakeMedicine] = useState('No');
  const [learningDifficulty, setLearningDifficulty] = useState('No');
  const [concernAware, setConcernAware] = useState('No');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [childAlergicDetail, setChildAllergicDetail]=useState('')
  const [TakeMedicineDetail, setTakeMedicineDetail]=useState('')
  const [LearningDifficultyDetail, setLearningDifficultyDetail]=useState('')
  const [concernAwareDetail, setConcernAwareDetail]=useState('')
    
  // Guardian details
  const [guardianName, setGuardianName] = useState('');
  const [relationToChild, setRelationToChild] = useState('');
  const [guardianAddress, setGuardianAddress] = useState('');
  const [primaryContactNumber, setPrimaryContactNumber] = useState('');
  const [secondaryContactNumber, setSecondaryContactNumber] = useState('');

  // Interest/Hobby details
  const [hobbyInterest, setHobbyInterest] = useState('');
  const [involvedInSport, setInvolvedInSport] = useState('');
  const [fitForActivity, setFitForActivity] = useState('');

  // Fees Payment details
  const [paymentType, setPaymentType] = useState('');
  const [otherPaymentType, setOtherPaymentType] = useState('');

  // Error messages
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!forename || !surname || !gender || !dob || !doctorName || !doctorAddress || !gpSurgeryContact || !childAllergic || !guardianName || !relationToChild || !guardianAddress || !primaryContactNumber || !primaryContactNumber) {
      setError('Please fill in all required fields.');
      return;
    }

    // If validation passes, you can handle your submission logic here
    const studentData = {
      forename,
      surname,
      gender,
      dob,
      selectedCertificates,
      doctorDetails: {
        doctorName,
        doctorAddress,
        gpSurgeryContact,
        childAllergic,
        childAlergicDetail,
        takeMedicine,
        TakeMedicineDetail,
        learningDifficulty,
        LearningDifficultyDetail,
        concernAware,
        concernAwareDetail,
        medicalInfo,
      },
      guardianDetails: {
        guardianName,
        relationToChild,
        guardianAddress,
        primaryContactNumber,
        secondaryContactNumber,
      },
      interests: {
        hobbyInterest,
        involvedInSport,
        fitForActivity,
      },
      paymentType,
      otherPaymentType,
    };

    // Here, you can send studentData to your backend
    console.log('Student Data:', studentData);

    // Reset the form after submission (optional)
    resetForm();
  };

  const resetForm = () => {
    setForename('');
    setSurname('');
    setGender('');
    setDob('');
    setMsuExamCertificate('none');
    setDoctorName('');
    setDoctorAddress('');
    setGpSurgeryContact('');
    setChildAllergic('');
    setTakeMedicine('No');
    setLearningDifficulty('No');
    setConcernAware('No');
    setMedicalInfo('');
    setGuardianName('');
    setRelationToChild('');
    setGuardianAddress('');
    setPrimaryContactNumber('');
    setSecondaryContactNumber('');
    setHobbyInterest('');
    setInvolvedInSport('');
    setFitForActivity('');
    setPaymentType('');
    setOtherPaymentType('');
    setChildAllergicDetail(''),
    setTakeMedicineDetail(''),
    setLearningDifficultyDetail(''),
    setConcernAwareDetail(''),
    setError(''); // Clear any existing errors
    setSelectedCertificates('')
  };

  const [selectedCertificates, setSelectedCertificates] = useState([]);

  const certificates = [
    { id: 'None', label: 'None' },
    { id: 'book1', label: 'Book 1' },
    { id: 'book2', label: 'Book 2' },
    { id: 'book3', label: 'Book 3' },
    { id: 'book4', label: 'Book 4' },
    { id: 'book5', label: 'Book 5' },
    { id: 'book6', label: 'Book 6' },
    { id: 'book7', label: 'Book 7' },
  ];

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;

    if (checked) {
      // Add the selected certificate to the array
      setSelectedCertificates([...selectedCertificates, id]);
    } else {
      // Remove the certificate from the array if unchecked
      setSelectedCertificates(selectedCertificates.filter(certificate => certificate !== id));
    }
  };

  return (
    <div className="add-student-container">
    <div style={{backgroundColor:'white', padding:'10px', marginBottom:'10px', borderRadius:'30px',boxShadow:'0px 0px 1px 0px gray' }}><h6 >Students <span style={{fontWeight:'400'}}>| <AiOutlineHome className="sidebar-icon" style={{ marginRight: '5px' }} />- Add Students</span></h6></div>
      <div className="container-fluid admission-header text-center " style={{marginTop:'30px'}}>
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
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
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
                />
              </div>
            </div>
</div>
</div>
            {/* MSU EXAM Certificate */}
            <div className="certificate-section">
      <h4 style={{ fontWeight: "bold", fontSize: '15px', borderBottom: '1px solid black', paddingBottom: '10px' }}>
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
            <label htmlFor={certificate.id} className="btn btn-outline-primary">
              {certificate.label}
            </label>
          </div>
        ))}
      </div>

      
    </div>


        {/* Doctor Details Section */}
        <div className="form-section">
          <h4 style={{fontSize:'1rem'}}><span className="section-number" >2</span> Doctor Details</h4>
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
                />
              </div>
            </div>

            {/* GP Surgery Contact Number */}
            <div className="form-group">
              <label className="field-label required-bg">GP Surgery Contact Number*</label>
              <div className="input-wrapper">
                <input 
                  type="tel" 
                  placeholder="Enter Contact Number" 
                  className="form-input" 
                  value={gpSurgeryContact} 
                  onChange={(e) => setGpSurgeryContact(e.target.value)} 
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
                  onChange={(e) => setChildAllergic(e.target.value)} 
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {childAllergic === 'Yes' && (
              <div className="form-group">
                <label className="field-label required-bg">Enter Child Allergies*</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Enter Child Allergies" 
                    className="form-input" 
                    value={childAlergicDetail} 
                    onChange={(e) => setChildAllergicDetail(e.target.value)} 
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
                  onChange={(e) => setTakeMedicine(e.target.value)}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            {takeMedicine === 'Yes' && (
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
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            {learningDifficulty === 'Yes' && (
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
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            {concernAware === 'Yes' && (
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
                />
              </div>
            </div>

            {/* Primary Contact Number */}
            <div className="form-group">
              <label className="field-label required-bg">Primary Contact Number*</label>
              <div className="input-wrapper">
                <input 
                  type="tel" 
                  placeholder="Enter Primary Contact" 
                  className="form-input" 
                  value={primaryContactNumber} 
                  onChange={(e) => setPrimaryContactNumber(e.target.value)} 
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
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
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
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
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
                >
                  <option value="">Select Payment Type</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="bankTransfer">Bank Transfer</option>
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

        {/* Submit Button */}
        <button type="submit" className="submit-button btn btn-primary">Submit</button>
        <div className="form-group">
         
        </div>
      </form>
    </div>
  );
}
