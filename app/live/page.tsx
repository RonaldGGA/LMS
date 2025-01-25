"use client";

import React, { useState } from "react";

// Sample data for search
const data = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Fig",
  "Grape",
  "Kiwi",
  "Lemon",
  "Mango",
];

const LiveSearch = () => {
  const [query, setQuery] = useState("");

  // Filter the data based on query
  const filteredResults = data.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1>Live Search Example</h1>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {filteredResults.length > 0 ? (
          filteredResults.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li>No results found</li>
        )}
      </ul>
    </div>
  );
};

export default LiveSearch;
