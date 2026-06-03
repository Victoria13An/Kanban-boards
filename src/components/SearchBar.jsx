import React from "react";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <input 
      type="text"
      placeholder="🔍 Поиск задач..." 
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{
        width: "100%",
        padding: "10px 15px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        fontSize: "16px",
        outline: "none",
        boxSizing: "border-box"
      }}
    />
  );
}