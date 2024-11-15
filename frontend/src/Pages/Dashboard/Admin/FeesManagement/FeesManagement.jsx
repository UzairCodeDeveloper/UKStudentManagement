import React, { useState, useEffect } from 'react';
import Loader from '../../../../components/Loader/Loader';
import Swal from 'sweetalert2';

export default function ShowClasses() {
  const [loading, setLoading] = useState(false);
  const [families, setFamilies] = useState([]); // State for family data
  const [feesInput, setFeesInput] = useState({}); // State to track fees input for each family

  // Dummy data for families with family numbers
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFamilies([
        { id: 1, familyNumber: 'ISM001' },
        { id: 2, familyNumber: 'ISM002' },
        { id: 3, familyNumber: 'ISM003' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle fees input change
  const handleFeesInputChange = (id, value) => {
    setFeesInput((prevFeesInput) => ({
      ...prevFeesInput,
      [id]: value,
    }));
  };

  // Handle form submission with validation
  const handleSubmit = () => {
    // Check if all required feesInput fields have values
    const allFilled = families.every(
      (family) => feesInput[family.id] && feesInput[family.id].trim() !== ''
    );

    if (!allFilled) {
      Swal.fire({
        title: 'Incomplete Input',
        text: 'Please enter fees for all families before submitting.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // If validation passes, log data
    console.log('Submitting Fees Data:', feesInput);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ height: '100%', padding: '20px', backgroundColor: "#f6f7fb", overflow: "auto" }}>
      <div className="classes-container">
        <div className="header">
          <h6>Admin <span className="sub-header">- Fee Management</span></h6>
        </div>

        <div className="container-fluid admission-header text-center" style={{ marginTop: '30px' }}>
          <h1>Family Fees Record</h1>
        </div>

        <div className="table-container" style={{ marginTop: '30px' }}>
          <table 
            className="table" 
            style={{ 
              background: "#fff", 
              color: '#000',
              borderCollapse: 'collapse',
              width: '100%',
            }} 
          >
            <thead>
              <tr>
                <th>Family No</th>
                <th>Fees Due</th>
              </tr>
            </thead>
            <tbody>
              {families.map((family) => (
                <tr key={family.id}>
                  <td>{family.familyNumber}</td>
                  <td>
                    <span style={{ fontWeight: 'bold' }}>£ </span>
                    <input
                      type="number"
                      placeholder=""
                      value={feesInput[family.id] || ''}
                      onChange={(e) => handleFeesInputChange(family.id, e.target.value)}
                      className="fees-due-input"
                      style={{ width: '100px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit button with validation */}
        <div className="submit-button-container" style={{ marginTop: '20px', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
