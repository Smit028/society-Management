// app/house/[houseNumber]/page.js
"use client"
import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase'; // Adjust the path as necessary
import { doc, getDoc } from 'firebase/firestore';

export default function HouseDetails({ params }) {
    const { houseNumber } = params; // Access the dynamic parameter
    const [houseData, setHouseData] = useState(null);
  
    useEffect(() => {
      const fetchHouseData = async () => {
        const docRef = doc(db, 'houses', houseNumber);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setHouseData(docSnap.data());
        } else {
          console.log("No such house found!");
        }
      };
      fetchHouseData();
    }, [houseNumber]);
  
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      return (
        <div className="p-6 bg-white shadow-md rounded-lg text-black">
          <h1 className="text-2xl font-bold mb-4">House Number: {houseNumber}</h1>
          {houseData ? (
            <div>
              <p className="text-lg">Owner: <span className="font-semibold">{houseData.owner}</span></p>
              
              <div className="mt-4">
                <h2 className="text-xl font-bold">Maintenance Status</h2>
                <ul className="space-y-2">
                  {houseData.paidMonths.map((isPaid, index) => (
                    <li key={index} className={`flex items-center ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                      {isPaid ? '✔️' : '❌'} {monthNames[index]} - {isPaid ? 'Paid' : 'Pending'}
                    </li>
                  ))}
                </ul>
              </div>
      
              <div className="mt-4">
                <h2 className="text-xl font-bold">External Funds</h2>
                <ul className="list-disc list-inside space-y-1">
                  {houseData.externalFunds.length ? houseData.externalFunds.map((fund, index) => (
                    <li key={index}>{fund}</li>
                  )) : <li>No external funds</li>}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-lg">Loading...</p>
          )}
        </div>
      );
      
  }
  
