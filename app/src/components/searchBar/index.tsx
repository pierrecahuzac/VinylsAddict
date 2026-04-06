import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/searchBar.scss";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Si la barre est vide, on ne fait rien
    if (query.length < 3) return; 

    // On prépare le minuteur
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

    // NETTOYAGE : Si l'utilisateur tape une autre lettre avant les 500ms, 
    // on annule le minuteur précédent. C'est ça le vrai Debounce !
    return () => clearTimeout(delayDebounceFn);
  }, [query]); // S'exécute à chaque fois que 'query' change

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