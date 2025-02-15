import { useState } from 'react';
import { AiOutlineHome } from "react-icons/ai";
import ClassManager from "../.././../../../api/services/admin/volunteer/volunteerManager"
import Swal from "sweetalert2";
export default function AddStudent() {
    // State variables for each input
    const [FullName, setFullName] = useState('');
    const [ContactNumber, setContactNumber] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [FullAddress, setFullAddress] = useState('')
    const [MonthlyCommit, setMonthlyCommit] = useState(false)
    const [PostCode, setPostCode] = useState('')

    // Voluntering  details

    const [WorkingCommit, setWorkingCommit] = useState('');

    const [Schedule, setSchedule] = useState('');

    const [PreviousTeachingExperience, setPreviousTeachingExperience] = useState(false);

    const [ScheduleDetail, setScheduleDetail] = useState('')
    const [PreviousExperienceDetail, setPreviousExperienceDetail] = useState('')
    const [BriefExperienceDetail, setBriefExperienceDetail] = useState('')
    const [firstAidCertificate, setFirstAidCertificate] = useState(false)
    const [interestInJoining, setInterestInJoining] = useState(false);
    const [alreadyTeacher, setAlreadyTeacher] = useState(false);
    const [FirstAid, setFirstAid] = useState(false);

    const [error, setError] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation

        if (!interestInJoining || !alreadyTeacher) {
            alert('Please agree to all terms and conditions.');
            return;
        }
        // If validation passes, you can handle your submission logic here
        const volunteerData = {
            volunteer_details: {
                full_name: FullName,
                address: FullAddress,
                contact_number: ContactNumber,
                gender,
                dob,
                postal_code: PostCode,
                working_commitment: WorkingCommit,
                schedule: Schedule,
                schedule_detail: ScheduleDetail,
                days_to_commit: DaystoCommit,
                areas_of_working: Areasofworking,
                age_group: AgeGroup,
                qualification: {
                    previous_experience: PreviousTeachingExperience,
                    previous_experience_detail: PreviousExperienceDetail,
                    first_aid_qualified: FirstAid,
                    first_aid_certificate: firstAidCertificate,
                    brief_details: BriefExperienceDetail,
                },
            },
            already_teacher: alreadyTeacher,
            interest_in_joining: interestInJoining,
        };

        console.log(volunteerData);

        ClassManager.createNewVolunteer(volunteerData)
            .then((res) => {
                console.log(res.data.volunteer)


                const {employee_id,password} = res.data.volunteer;

                // Build the message for SweetAlert
                const alertMessage = `
                 <strong>Volunteer ID:</strong> ${employee_id} <br />
                 <strong>Password:</strong> ${password} <br />
                
                 `;

                // Show SweetAlert with the response data
                Swal.fire({
                    title: "Volunteer Added Successfully!",
                    html: alertMessage, // Display the HTML content
                    icon: "success",
                    confirmButtonText: "OK",
                });




                resetform();
                // alert("Volunteer added successfully")
            })
            .catch((err) => {
                console.log(err.response.data.msg)
                alert(err.response.data.msg)
                setError(err.response.data.msg)
            })

        // Reset the form after submission (optional)




    };

    const resetform = () => {
        setFullName('');
        setFullAddress('');
        setGender('');
        setDob('');
        setContactNumber('');
        setPostCode('');
        setWorkingCommit('');
        setSchedule('');
        setScheduleDetail('');
        setDaystoCommit('');
        setAreasofworking('');
        setAgeGroup('');
        setPreviousExperienceDetail('');
        setPreviousTeachingExperience('');
        setFirstAid('');
        setBriefExperienceDetail('');
        setMonthlyCommit(false)
    };


    const [selectedCertificates, setSelectedCertificates] = useState([]);
    const [DaystoCommit, setDaystoCommit] = useState([]);
    const [Areasofworking, setAreasofworking] = useState([]);
    const [AgeGroup, setAgeGroup] = useState([]);


    const DaystoCommitSchedule = [
        { id: 'Monday Evening', label: 'Monday Evening' },
        { id: 'Tuesday Evening', label: 'Tuesday Evening' },
        { id: 'Wednesday Evening', label: 'Wednesday Evening' },
        { id: 'Thursday Evening', label: 'Thursday Evening' },
        { id: 'Friday Evening', label: 'Friday Evening' },
        { id: 'Saturday', label: 'Saturday' },
        { id: 'Sunday', label: 'Sunday' },

    ];

    const AreaofTeachingSchedule = [
        { id: 'Quran', label: 'Quran' },
        { id: 'Aqaid', label: 'Aqaid' },
        { id: 'Fiqh', label: 'Fiqh' },
        { id: 'IslamicHistory', label: 'Islamic History' },
        { id: 'BiritishValues', label: 'Biritish Values' },
        { id: 'SportsActivity', label: 'Sports Activity' },
        { id: 'EventPlaning', label: 'Event Planning' },
        { id: 'Maintenance', label: 'Maintenance' },
        { id: 'Administration', label: 'Administration' },
        { id: 'CommunityCohesion', label: 'Community Cohesion' }

    ];

    const AgeGroupsSchedule = [
        { id: '5to8years', label: '5 to 8 Years Olds' },
        { id: '9to12years', label: '9 to 12 Years Olds' },
        { id: '12orover', label: '12 or Over' },
        { id: 'Adults', label: 'Adults' },


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

    const handleCheckboxDaystoCommitChange = (event) => {
        const { id, checked } = event.target;

        if (checked) {
            // Add the selected certificate to the array
            setDaystoCommit([...DaystoCommit, id]);
        } else {
            // Remove the certificate from the array if unchecked
            setDaystoCommit(DaystoCommit.filter(certificate => certificate !== id));
        }
    };

    const handleCheckboxAreasChange = (event) => {
        const { id, checked } = event.target;

        if (checked) {
            // Add the selected certificate to the array
            setAreasofworking([...Areasofworking, id]);
        } else {
            // Remove the certificate from the array if unchecked
            setAreasofworking(Areasofworking.filter(certificate => certificate !== id));
        }
    };

    const handleCheckboxAgeGroupChange = (event) => {
        const { id, checked } = event.target;

        if (checked) {
            // Add the selected certificate to the array
            setAgeGroup([...AgeGroup, id]);
        } else {
            // Remove the certificate from the array if unchecked
            setAgeGroup(AgeGroup.filter(certificate => certificate !== id));
        }
    };

    const weeklycommitments = (e) => {
        if (e.target.value === "No") {
            setWorkingCommit(e.target.value)
            setMonthlyCommit(true)
        }
        else {
            setWorkingCommit(e.target.value)
        }
    }
    return (
        <div className="add-student-container">
            <div style={{ backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '30px', boxShadow: '0px 0px 1px 0px gray' }}><h6 >Employees <span style={{ fontWeight: '400' }}>| <AiOutlineHome className="sidebar-icon" style={{ marginRight: '5px' }} />- Add Employee</span></h6></div>
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
                    <h4><span className="section-number">1</span>Employee Information</h4>
                    <div className="form-grid">
                        {/* Forename */}
                        <div className="form-group">
                            <label className="field-label required-bg">FullName*</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Enter Forename"
                                    className="form-input"
                                    value={FullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="field-label required-bg">Address*</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Enter Address"
                                    className="form-input"
                                    value={FullAddress}
                                    onChange={(e) => setFullAddress(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div className="form-group">
                            <label className="field-label required-bg">Contact Number*</label>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    placeholder="Enter Contact"
                                    className="form-input"
                                    value={ContactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
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
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="field-label required-bg">Post Code*</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Enter PostCode"
                                    className="form-input"
                                    value={PostCode}
                                    onChange={(e) => setPostCode(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                    </div>
                </div>



                {/* Voluteering Section */}
                <div className="form-section">
                    <h4 style={{ fontSize: '1rem' }}><span className="section-number" >2</span> Voluntering Details</h4>
                    <div className="form-grid">
                        {/* Doctor Name */}
                        <div className="form-group">
                            <label className="field-label required-bg">Working Commit Weekly*</label>
                            <div className="input-wrapper">
                                <select
                                    className="form-input"
                                    value={WorkingCommit}
                                    onChange={weeklycommitments}
                                    required
                                >
                                    <option value="">Select Hours</option>
                                    <option value="2 Hours">2 Hours</option>
                                    <option value="Upto 4 Hours">Upto to 4 Hours</option>
                                    <option value="Upto 6 Hours">Upto to 6 Hours</option>
                                    <option value="Upto 8 Hours">Upto to 8 Hours</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>



                        {MonthlyCommit && (
                            <div className="form-group">
                                <label className="field-label required-bg">Schedule*</label>
                                <div className="input-wrapper">
                                    <select
                                        className="form-input"
                                        value={Schedule}
                                        onChange={(e) => setSchedule(e.target.value)}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Fortnightly">Fortnightly</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>
                        )}




                        {(Schedule === "Fortnightly" || Schedule === "Monthly") && (
                            <div className="form-group">
                                <label className="field-label required-bg">Enter Hours*</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Enter Hours"
                                        className="form-input"
                                        value={ScheduleDetail}
                                        onChange={(e) => setScheduleDetail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <label className="certificate-label required-bg" style={{ fontSize: '12px' }}>Days To Commit</label>

                        <div className="checkbox-list btn-group" role="group" aria-label="MSU Certificate Toggle Button Group">
                            {DaystoCommitSchedule.map((certificate) => (
                                <div key={certificate.id} className="checkbox-item" >
                                    <input
                                        type="checkbox"
                                        id={certificate.id}
                                        value={certificate.id}
                                        checked={DaystoCommit.includes(certificate.id)}
                                        onChange={handleCheckboxDaystoCommitChange}
                                        className="btn-check"
                                        autoComplete="off"


                                    />
                                    <label htmlFor={certificate.id} className="btn btn-outline-primary" style={{ border: '2px solid #7b5fed' }}>
                                        {certificate.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>



                    <div style={{ marginTop: '20px' }}>
                        <label className="certificate-label required-bg" style={{ fontSize: '12px' }}>Areas Of Working or Interested</label>

                        <div className="checkbox-list btn-group" role="group" aria-label="MSU Certificate Toggle Button Group">
                            {AreaofTeachingSchedule.map((certificate) => (
                                <div key={certificate.id} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        id={certificate.id}
                                        value={certificate.id}
                                        checked={Areasofworking.includes(certificate.id)}
                                        onChange={handleCheckboxAreasChange}
                                        className="btn-check"
                                        autoComplete="off"

                                    />
                                    <label htmlFor={certificate.id} className="btn btn-outline-primary" style={{ border: '2px solid #7b5fed' }}>
                                        {certificate.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>




                    <div style={{ marginTop: '20px' }}>
                        <label className="certificate-label required-bg" style={{ fontSize: '12px' }}>Age Group</label>

                        <div className="checkbox-list btn-group" role="group" aria-label="MSU Certificate Toggle Button Group">
                            {AgeGroupsSchedule.map((certificate) => (
                                <div key={certificate.id} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        id={certificate.id}
                                        value={certificate.id}
                                        checked={AgeGroup.includes(certificate.id)}
                                        onChange={handleCheckboxAgeGroupChange}
                                        className="btn-check"
                                        autoComplete="off"

                                    />
                                    <label htmlFor={certificate.id} className="btn btn-outline-primary" style={{ border: '2px solid #7b5fed' }}>
                                        {certificate.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>





                </div>

                {/* Guardian Details Section */}
                <div className="form-section">
                    <h4><span className="section-number">3</span> Qualifications / Experience</h4>
                    <div className="form-grid">

                        <div className="form-group">
                            <label className="field-label required-bg">Previous Experience*</label>
                            <div className="input-wrapper">
                                <select
                                    className="form-input"
                                    value={PreviousTeachingExperience}
                                    onChange={(e) => setPreviousTeachingExperience(e.target.value)}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value={false}>No</option>
                                    <option value={true}>Yes</option>
                                </select>
                            </div>
                        </div>

                        {PreviousTeachingExperience === 'Yes' && (
                            <div className="form-group">
                                <label className="field-label required-bg">Enter Previous Experience Details*</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Enter Details"
                                        className="form-input"
                                        value={PreviousExperienceDetail}
                                        onChange={(e) => setPreviousExperienceDetail(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="field-label required-bg">First Aid Qualified</label>
                            <div className="input-wrapper">
                                <select
                                    className="form-input"
                                    value={FirstAid}
                                    onChange={(e) => setFirstAid(e.target.value)}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value={false}>No</option>
                                    <option value={true}>Yes</option>
                                </select>
                            </div>
                        </div>

                        {/* Render file input if FirstAid is "Yes" */}
                        {FirstAid === 'Yes' && (
                            <div className="form-group">
                                <label className="field-label required-bg">UploadCertification*</label>
                                <div className="input-wrapper">
                                    <input style={{ fontSize: '10px', }}
                                        type="file"

                                        className="form-input"
                                        onChange={(e) => setFirstAidCertificate(e.target.files[0])} // Handle file input
                                    />
                                </div>
                            </div>
                        )}






                    </div>
                    <div className="form-group" style={{ marginTop: "20px" }}>
                        <label className="field-label required-bg">Brief Details*</label>
                        <div className="input-wrapper">
                            <textarea
                                type="text"
                                placeholder="Enter Detail"
                                className="form-input"
                                value={BriefExperienceDetail}
                                onChange={(e) => setBriefExperienceDetail(e.target.value)}
                                style={{ height: '40px', borderRadius: "20px", padding: '6px 8px' }}
                                required
                            />
                        </div>
                    </div>
                </div>








                {/* Already a teacher / volunteer */}
                <div className="form-section">
                    <h4><span className="section-number">4</span> Terms and Conditions</h4>
                    <div className="form-section-container">

                        {/* Expressing interest */}
                        <div className="form-group">
                            <h6 className="question-text">
                                <input
                                    type="checkbox"
                                    checked={interestInJoining}
                                    onChange={(e) => setInterestInJoining(e.target.checked)}
                                    required
                                />
                                <span style={{ marginLeft: '10px' }}>
                                    I am expressing my interest to join IMAM Organisation UK
                                </span>
                            </h6>
                        </div>

                        {/* Already a teacher / volunteer */}
                        <div className="form-group">
                            <h6 className="question-text">
                                <input
                                    type="checkbox"
                                    checked={alreadyTeacher}
                                    onChange={(e) => setAlreadyTeacher(e.target.checked)}
                                    required
                                />
                                <span style={{ marginLeft: '10px' }}>
                                    I am already a teacher / volunteer and have been requested to complete this form.
                                </span>
                            </h6>
                            <h6 className="question-text">
                                I understand the admission is subject to payment of fees. I also understand the fee is payable regardless of the student's absenteeism.
                                <br />
                                Please sign to confirm below:
                            </h6>
                        </div>

                        {/* Submit Button */}

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
