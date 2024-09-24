"use client";
import { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Ensure this is correctly configured

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AddHouse() {
  const [houseNumber, setHouseNumber] = useState('');
  const [owner, setOwner] = useState('');
  const [externalFunds, setExternalFunds] = useState([{ name: '', price: '' }]);
  const [paidMonths, setPaidMonths] = useState(Array(12).fill(false)); // Array of 12 booleans

  // Handle changes to external fund inputs
  const handleFundChange = (index, field, value) => {
    const newFunds = [...externalFunds];
    newFunds[index][field] = value;
    setExternalFunds(newFunds);
  };

  // Add a new external fund input
  const handleAddFund = () => {
    setExternalFunds([...externalFunds, { name: '', price: '' }]);
  };

  // Remove an external fund input
  const handleRemoveFund = (index) => {
    const newFunds = externalFunds.filter((_, i) => i !== index);
    setExternalFunds(newFunds);
  };

  const handleCheckboxChange = (index) => {
    const newPaidMonths = [...paidMonths];

    // Toggle the clicked month
    newPaidMonths[index] = !newPaidMonths[index];

    // If the month is checked, check all preceding months
    if (newPaidMonths[index]) {
      for (let i = 0; i <= index; i++) {
        newPaidMonths[i] = true;
      }
    }
    // If the month is unchecked, uncheck all succeeding months
    else {
      for (let i = index; i < newPaidMonths.length; i++) {
        newPaidMonths[i] = false;
      }
    }

    setPaidMonths(newPaidMonths);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if house already exists in Firestore
    const houseDocRef = doc(db, 'houses', houseNumber);
    const houseDoc = await getDoc(houseDocRef);

    if (houseDoc.exists()) {
      alert('House number already exists! Please use a different house number.');
      return; // Exit early if duplicate is found
    }

    try {
      // Add new house data to Firestore
      await setDoc(houseDocRef, {
        owner,
        paidMonths, // Store the array of booleans
        externalFunds: externalFunds.filter(fund => fund.name.trim() !== '').map(fund => ({
          name: fund.name.trim(),
          price: parseFloat(fund.price) || 0, // Convert price to a number
        })),
      });
      alert('House data successfully added!');
      setHouseNumber(''); // Reset form
      setOwner('');
      setExternalFunds([{ name: '', price: '' }]);
      setPaidMonths(Array(12).fill(false));
    } catch (error) {
      console.error('Error adding house data to Firestore:', error);
      alert('Failed to add house data. Check console for details.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add House Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">House Number</label>
          <input
            type="text"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded text-black"
            placeholder="Enter house number"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Owner Name</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded text-black"
            placeholder="Enter owner name"
          />
        </div>

        {/* External Funds Section */}
        <div>
          <h2 className="mt-4 text-lg font-semibold">External Funds</h2>
          {externalFunds.map((fund, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={fund.name}
                onChange={(e) => handleFundChange(index, 'name', e.target.value)}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded text-black"
                placeholder="Fund name (e.g., Diwali)"
              />
              <input
                type="number"
                value={fund.price}
                onChange={(e) => handleFundChange(index, 'price', e.target.value)}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded text-black"
                placeholder="Price"
              />
              {index > 0 && (
                <button type="button" onClick={() => handleRemoveFund(index)} className="text-red-500">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddFund} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
            Add Another Fund
          </button>
        </div>

        {/* Maintenance Status */}
        <div>
          <h2 className="mt-4 text-lg font-semibold">Maintenance Status</h2>
          {months.map((month, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                checked={paidMonths[index]}
                onChange={() => handleCheckboxChange(index)}
                className="mr-2"
              />
              <label className="font-medium">{month}</label>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add House
        </button>
      </form>
    </div>
  );
}
