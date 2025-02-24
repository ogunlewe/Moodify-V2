import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search songs or artists..."
        className="w-full sm:w-64 px-4 py-2 rounded-full border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button type="submit" className="hidden"></button>
    </form>
  );
};

export default SearchBar;