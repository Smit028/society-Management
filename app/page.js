"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../lib/firebase'; // Adjust the path as necessary
import { collection, getDocs } from 'firebase/firestore';
import Header from './Header';

export default function HomePage() {
  const [houses, setHouses] = useState([]);
  
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const housesCollection = collection(db, 'houses'); // Adjust the collection name as necessary
        const housesSnapshot = await getDocs(housesCollection);
        
        const housesList = housesSnapshot.docs.map(doc => ({
          id: doc.id, // Get the document ID
          number: doc.data().number, // Get the house number
        }));

        console.log(housesList); // Log the fetched house numbers and IDs
        setHouses(housesList);
      } catch (error) {
        console.error("Error fetching houses:", error);
      }
    };

    fetchHouses();
  }, []);
  
  const [searchResult, setSearchResult] = useState('');

  const handleSearch = (query) => {
    setSearchResult(query);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">sitabag society</h1>
        {houses.length === 0 ? (
          <p>No houses available.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4 mb-4">
            {houses.map(house => (
              <Link key={house.id} href={`/house/${house.id}`} className="block">
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full">
                  {house.id}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
