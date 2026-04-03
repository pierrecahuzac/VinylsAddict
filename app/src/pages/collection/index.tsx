import { useEffect, useState } from "react";
import axios from "axios";

import Header from "../../components/header";
import Thumbnail from "../../components/thumbnail";

import "../../styles/collection.scss";

const Collection = () => {
  const getAllGenres = async () => {

    try {
      const result = await axios.get("http://192.168.1.181:30000/genres");
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAlbums = async () => {
    try {
      const result = await axios.get("http://localhost:30000/albums");
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  fetchAlbums();
  useEffect(() => {}, []);
  const [modaleAddNewAlbum, setModaleAddNewAlbum] = useState(false);
  const openModaleAddNewAlbum = () => {
    getAllGenres();
    setModaleAddNewAlbum(true);
  };
  const submitNewAlbum = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:30000/albums", {});
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="collection">
      <h1>Vinyles addict</h1>
      <Header />
      <div className="collection_list">
        <Thumbnail />
        <Thumbnail />
        <Thumbnail />
        <Thumbnail />
        <Thumbnail />
      </div>
      <button onClick={openModaleAddNewAlbum}>+</button>
      {modaleAddNewAlbum && (
        <div className="modale_add_new_album">
          <h2>Ajouter un nouvel album</h2>
          <form
            className="form_add_new_album"
            onSubmit={(e) => submitNewAlbum(e)}
          >
            <input type="text" placeholder="Titre de l'album" />
            <input type="text" placeholder="Artiste" />
            <input type="text" placeholder="Année" />
            <select name="genre" id="">
              <option value="">Sélectionner un genre</option>
              <option value="rock">Rock</option>
              <option value="jazz">Jazz</option>
              <option value="classique">Classique</option>
            </select>
            <input type="text" placeholder="Prix" />
            <button type="submit">Ajouter</button>
            <button type="button" onClick={() => setModaleAddNewAlbum(false)}>
              Annuler
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Collection;
