import { useState, useEffect } from "react";
import axios from "axios";


const SearchBar = () => {
  const [query, setQuery] = useState("");

  useEffect(() => {
  
    if (query.length < 3) return; 

  
    const delayDebounceFn = setTimeout(async () => {
      try {
        await axios.get(
          `https://api.discogs.com/database/search?q=${query}&token=TON_TOKEN_DISCOGS`
        );
       
      } catch (error) {
        console.error("Erreur recherche :", error);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]); 

  return (
    <div className="flex w-full justify-center">
      <input
        className="h-[30px] w-4/5 rounded-lg mx-5 pl-4"
        type="text"
        placeholder="Rechercher un artiste, un album..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;