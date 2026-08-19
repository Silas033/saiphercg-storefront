//\src\components\SearchBar.jsx
import React from "react";

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div style={{ padding: "1rem", textAlign: "center", backgroundColor: "transparent" }}>
      <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: "0.5rem",
          width: "60%",
          maxWidth: "500px",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}

export default SearchBar;




