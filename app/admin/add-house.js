"use client";
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Ensure this is correctly configured

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AddHouse() {
  const [houseNumber, setHouseNumber] = useState('');
  const [owner, setOwner] = useState('');
  const [externalFunds, setExternalFunds] = useState('');
  const [paidMonths, setPaidMonths] = useState(Array(12).fill(false)); // Array of 12 booleans

  const handleCheckboxChange = (index) => {
    const newPaidMonths = [...paidMonths];
    newPaidMonths[index] = !newPaidMonths[index]; // Toggle the value
    setPaidMonths(newPaidMonths);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await setDoc(doc(db, 'houses', houseNumber), {
        owner,
        paidMonths, // Store the array of booleans
        externalFunds: externalFunds.split(',').map(fund => fund.trim()),
      });
      alert('House data successfully added!');
    } catch (error) {
      console.error('Error adding house data to Firestore:', error);  // Log full error
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
        <div>
          <label className="block mb-1 font-medium">External Funds (Comma-separated)</label>
          <input
            type="text"
            value={externalFunds}
            onChange={(e) => setExternalFunds(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black"
            placeholder="Enter external funds (e.g., Diwali, Ganpati)"
          />
        </div>
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
