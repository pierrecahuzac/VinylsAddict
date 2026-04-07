import { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBar.scss";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  useEffect(() => {
  
    if (query.length < 3) return; 

  
    const delayDebounceFn = setTimeout(async () => {
      try {
        const result = await axios.get(
          `https://api.discogs.com/database/search?q=${query}&token=TON_TOKEN_DISCOGS`
        );
        console.log("Résultats Discogs :", result.data.results);
      } catch (error) {
        console.error("Erreur recherche :", error);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]); 

  return (
    <div className="searchBar-container">
      <input
        className="searchBar"
        type="text"
        placeholder="Rechercher un artiste, un album..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;