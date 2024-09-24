"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Header from './Header';
import './globals.css';

export default function HomePage() {
  const [houses, setHouses] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [longPressedHouse, setLongPressedHouse] = useState(null);
  const [updateData, setUpdateData] = useState({ owner: '', number: '', paidMonths: [] });

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const housesCollection = collection(db, 'houses');
        const housesSnapshot = await getDocs(housesCollection);

        const housesList = housesSnapshot.docs.map(doc => ({
          id: doc.id,
          number: doc.data().number || '',
          paidMonths: doc.data().paidMonths || [],
          owner: doc.data().owner || ''
        }));

        setHouses(housesList);
      } catch (error) {
        console.error("Error fetching houses:", error);
      }
    };

    fetchHouses();
  }, []);

  const handleSearch = (query) => {
    setSearchResult(query.toLowerCase());
    const suggestions = houses.filter(house =>
      house.number.toLowerCase().startsWith(query.toLowerCase())
    );
    setFilteredSuggestions(suggestions);
  };

  const filteredHouses = houses.filter(house => {
    const houseNumber = house.id || '';
    const query = searchResult || '';
    
    return houseNumber.toLowerCase().includes(query.toLowerCase());
  });

  const handleLongPress = (house) => {
    setLongPressedHouse(house);
    setUpdateData({ owner: house.owner, number: house.number, paidMonths: house.paidMonths }); // Fill the form with existing data
  };

  const handleRemove = async (houseId) => {
    const houseRef = doc(db, 'houses', houseId);
    await deleteDoc(houseRef);
    setHouses(houses.filter(house => house.id !== houseId));
    setLongPressedHouse(null); // Close the buttons
  };

  const handleUpdate = async (houseId) => {
    const houseRef = doc(db, 'houses', houseId);
    await updateDoc(houseRef, updateData);
    setHouses(houses.map(house => house.id === houseId ? { ...house, ...updateData } : house));
    setLongPressedHouse(null); // Close the buttons
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <div className="p-6 bg-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sitabag Society</h1>

        {searchResult && filteredSuggestions.length > 0 && (
          <div className="bg-gray-100 shadow-md rounded-lg p-4 max-w-md mx-auto mb-6">
            <h2 className="text-md font-semibold text-gray-700">Suggestions:</h2>
            {filteredSuggestions.map(suggestion => (
              <p key={suggestion.id} className="py-1 text-gray-600">{suggestion.number}</p>
            ))}
          </div>
        )}

        {houses.length === 0 ? (
          <p className="text-center text-gray-500">No houses available.</p>
        ) : filteredHouses.length === 0 ? (
          <p className="text-center text-gray-500">No houses match your search or filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
            {filteredHouses.map(house => (
              <div 
                key={house.id} 
                className="relative" 
                onContextMenu={(e) => { e.preventDefault(); handleLongPress(house); }} // Trigger long press
              >
                <Link href={`/house/${house.id}`} className="block transition transform hover:scale-105">
                  <button className="bg-blue-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 w-full">
                    {house.id}
                  </button>
                </Link>
                {longPressedHouse?.id === house.id && (
                  <div className="absolute top-0 right-0 bg-white shadow-lg rounded p-2 mt-1">
                    <button className="bg-red-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleRemove(house.id)}>
                      Remove
                    </button>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleUpdate(house.id)}>
                      Update
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {longPressedHouse && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Update House Details</h2>
            <input 
              type="text" 
              value={updateData.owner} 
              onChange={(e) => setUpdateData({ ...updateData, owner: e.target.value })} 
              placeholder="Owner Name" 
              className="border p-2 mb-4 w-full"
            />
            <input 
              type="text" 
              value={updateData.number} 
              onChange={(e) => setUpdateData({ ...updateData, number: e.target.value })} 
              placeholder="House Number" 
              className="border p-2 mb-4 w-full"
            />
            <input 
              type="text" 
              value={updateData.paidMonths.join(', ')} // Display paid months as a comma-separated string
              onChange={(e) => setUpdateData({ ...updateData, paidMonths: e.target.value.split(',').map(month => month.trim()) })} 
              placeholder="Paid Months (comma separated)" 
              className="border p-2 mb-4 w-full"
            />
            <div className="flex justify-end">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded" 
                onClick={() => handleUpdate(longPressedHouse.id)}
              >
                Save
              </button>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded ml-2" 
                onClick={() => setLongPressedHouse(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
