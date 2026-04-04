import { useEffect, useState } from "react";
import axios from "axios";

import Header from "../../components/header";
import Album from "../../components/album";
// On importe le Hook
import { useCollection } from "../../hooks/useCollection.ts";

import "../../styles/collection.scss";
import NavBar from "../../components/navBar/index.tsx";

const Collection = () => {
  // On "déstructure" ce que le hook nous donne
  const { genres, albums, getAllGenres, getAllAlbums, isLoading } = useCollection();

  const [modaleAddNewAlbum, setModaleAddNewAlbum] = useState(false);

  // Chargement initial des albums
  useEffect(() => {
    getAllAlbums();
  }, []);

  const openModaleAddNewAlbum = () => {
    getAllGenres(); // On récupère les genres pour le <select> de la modale
    setModaleAddNewAlbum(true);
  };

  const submitNewAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://192.168.1.181:33000/api/albums",
        {},
      );
      console.log(result);
      setModaleAddNewAlbum(false);

      getAllAlbums(); // Après l'ajout, on rafraîchit la liste des albums
    } catch (error) {
      console.error(error);
    }
  };

  

  const openAlbumDetails = (albumId: string) => {
    // Ici tu peux faire une redirection vers une page de détails de l'album
    // ou ouvrir une modale avec les infos de l'album
    console.log("Album ID:", albumId);
  }
  return (
    <div className="collection">
      
      <Header />

      <div className="collection_list">
        {isLoading ? (
          <p>Chargement...</p>
        ) : albums.length === 0 ? (
          <p>Aucun album dans votre collection.</p>
        ) : null}
        {/* On boucle sur les albums venant du Hook */}
        {albums.map((album: { id: string; title: string; artist: string; coverUrl: string }) => (
          <Album key={album.id} title={album.title} artist={album.artist} cover={album.coverUrl} onClick={() => openAlbumDetails(album.id)} />
        ))}
      </div>

      <button className="add-button" onClick={openModaleAddNewAlbum}>
        +
      </button>

      {modaleAddNewAlbum && (
        <div className="modale_add_new_album">
          <h2>Ajouter un nouvel album</h2>
          <form className="form_add_new_album" onSubmit={submitNewAlbum}>
            <input type="text" placeholder="Titre de l'album" />
            <input type="text" placeholder="Artiste" />
            <input type="text" placeholder="Année" />

            <select name="genre">
              <option value="">Sélectionner un genre</option>
              {/* On boucle sur les genres venant du Hook */}
              {genres.map((genre: { id: string; name: string }) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>

            <input type="text" placeholder="Prix" />
            <button type="submit">Ajouter</button>
            <button type="button" onClick={() => setModaleAddNewAlbum(false)}>
              Annuler
            </button>
          </form>
        </div>
      )}
      <NavBar/>
    </div>
  );
};

export default Collection;
