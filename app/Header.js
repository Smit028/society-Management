"use client"
import { useState } from 'react';
import Link from 'next/link';

export default function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery); // Trigger the search action
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
      <h1 className="text-2xl font-bold mb-2 md:mb-0">Society Management</h1>
      <form onSubmit={handleSearch} className="flex items-center w-full md:w-auto mb-2 md:mb-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-l border border-gray-300 focus:outline-none w-full md:w-48"
          placeholder="Search House Number"
        />
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded-r hover:bg-blue-700">
          Search
        </button>
      </form>
      <Link href="/admin">
        <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">
          Add New House
        </button>
      </Link>
    </header>
  );
}
