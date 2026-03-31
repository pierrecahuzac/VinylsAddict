import { useState } from "react";
import axios from "axios";
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchAlbum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const callApi = async (searchTerm: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const result = await axios.get(
        `https://api.discogs.com/database/search?q=${searchTerm}&key=YOUR`,
      );
      console.log(result);
    } catch (error) {}
  };
  return (
    <div>
      SearchBar
      <input type="text" onChange={searchAlbum} />
      <button onClick={() => callApi(searcTerm)}>Search</button>
    </div>
  );
};

export default SearchBar;
