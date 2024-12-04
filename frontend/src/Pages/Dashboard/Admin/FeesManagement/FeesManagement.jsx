import React, { useState, useEffect } from 'react';
import Loader from '../../../../components/Loader/Loader';
import Swal from 'sweetalert2';

import FeesManager from '../../../../api/services/admin/Fees/FeesManager';

export default function ShowClasses() {
  const [loading, setLoading] = useState(false);
  const [families, setFamilies] = useState([]); // State for family data
  const [feesInput, setFeesInput] = useState({}); // State to track fees input for each family

  // Handle fees input change
  const handleFeesInputChange = (id, key, value) => {
    setFeesInput((prevFeesInput) => ({
      ...prevFeesInput,
      [id]: {
        ...prevFeesInput[id],
        [key]: value, // Update either `paidAmount` or `dueAmount` for the specific family
      },
    }));
  };

  // Handle form submission with validation
  const handleSubmit = async () => {
    // Validate that all inputs are filled
    const allFilled = families.every((family) => {
      const inputValues = feesInput[family.id];
      return (
        inputValues &&
        inputValues.paidAmount?.toString().trim() !== '' &&
        inputValues.dueAmount?.toString().trim() !== ''
      );
    });

    if (!allFilled) {
      Swal.fire({
        title: 'Incomplete Input',
        text: 'Please enter fees for all families before submitting.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // Prepare the fee update payload
    const feeUpdates = families.map((family) => ({
      familyRegNo: family.familyRegNo,
      paidAmount: parseFloat(feesInput[family.id]?.paidAmount), // Convert `paidAmount` to number
      dueAmount: parseFloat(feesInput[family.id]?.dueAmount), // Convert `dueAmount` to number
    }));

    try {
      // Call API to update fees
      const response = await FeesManager.updateRecord({ feeUpdates });
      Swal.fire({
        title: 'Success',
        text: response.data.message, // Show the success message from the API
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });

      // Clear the input fields after submission
      // setFeesInput({});
    } catch (error) {
      console.error('Error updating fees:', error);
      Swal.fire({
        title: 'Error',
        text: 'There was an error updating fees.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    FeesManager.getFeesRecord()
      .then((res) => {
        setFamilies(res.data.families);
        console.log(res.data.families);
        // Initialize feesInput with family `paidAmount` and `dueAmount` values
        const initialFeesInput = {};
        res.data.families.forEach((family) => {
          initialFeesInput[family.id] = {
            paidAmount: family.paidAmount || '', // Use `paidAmount` from API
            dueAmount: family.amountDue || '', // Use `dueAmount` from API
          };
        });
        setFeesInput(initialFeesInput);

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching fees record:', err);
        setLoading(false);
      });
  }, []);

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
                <th>Fees Paid</th>
                <th>Fees Due</th>
              </tr>
            </thead>
            <tbody>
              {families.map((family) => (
                <tr key={family.id}> {/* Use unique family id here */}
                  <td>{family.familyRegNo}</td>
                  <td>
                    <span style={{ fontWeight: 'bold' }}>£ </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={feesInput[family.id]?.paidAmount || ''}
                      onChange={(e) =>
                        handleFeesInputChange(family.id, 'paidAmount', e.target.value)
                      }
                      className="fees-due-input"
                      style={{ width: '100px' }}
                    />
                  </td>
                  <td>
                    <span style={{ fontWeight: 'bold' }}>£ </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={feesInput[family.id]?.dueAmount || ''}
                      onChange={(e) =>
                        handleFeesInputChange(family.id, 'dueAmount', e.target.value)
                      }
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
