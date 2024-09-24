"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value); // Update state with the current input value
    onSearch(value); // Trigger the search action in real-time
  };

  return (
    <header className="bg-black text-white p-4 flex flex-col md:flex-row justify-between items-center">
      <h1 className="text-3xl font-bold mb-2 md:mb-0">Society Management</h1>
      <form className="flex items-center w-full md:w-auto mb-2 md:mb-0">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange} // Update search query on input change
          className="px-4 py-2 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out w-full md:w-48 bg-gray-800 text-white"
          placeholder="Search House Number"
        />
        <Link href="/admin">
          <button type="button" className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 transition duration-300 ease-in-out">
            Add New House
          </button>
        </Link>
      </form>
    </header>
  );
}
