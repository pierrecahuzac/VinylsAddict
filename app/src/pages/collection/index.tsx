import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Header from "../../components/header";
import Album from "../../components/album";
import NavBar from "../../components/navBar/index.tsx";
import { useCollection } from "../../hooks/useCollection.ts";

import "../../styles/collection.scss";

const Collection = () => {
  const { albums, getAllAlbums, isLoading, getAllMetadata, allMetadata } =
    useCollection();
  const navigate = useNavigate();
  const [modaleAddNewAlbum, setModaleAddNewAlbum] = useState(false);

  // État initial de l'album
  const [album, setAlbum] = useState({
    artist: "",
    title: "",
    year: "",
    genreId: "",
    conditionId: "",
    variantId: "",
    formatId: "",
    price: "",
    coverUrl: "",
    color: "",
  });

  // Handler générique pour Input et Select
  const changeDataAlbum = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setAlbum({
      ...album,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getAllAlbums();
  }, []);

  const openModaleAddNewAlbum = () => {
    getAllMetadata();
    setModaleAddNewAlbum(true);
  };

  const submitNewAlbum = async (e: React.FormEvent) => {
    e.preventDefault();

    // Lead Dev Tip: On convertit les strings en nombres avant l'envoi pour Prisma
    const payload = {
      ...album,
      year: album.year ? parseInt(album.year) : null,
      price: album.price ? parseFloat(album.price) : null,
    };

    try {
      await axios.post(
        "http://192.168.1.181:33000/api/albums/create",
        payload,
        {
          withCredentials: true,
        },
      );

      // Reset du formulaire et refresh
      setAlbum({
        artist: "",
        title: "",
        year: "",
        genreId: "",
        conditionId: "",
        variantId: "",
        formatId: "",
        price: "",
        coverUrl: "",
        color: "",
      });
      setModaleAddNewAlbum(false);
      getAllAlbums();
    } catch (error) {
      console.error("Erreur création album:", error);
    }
  };

  const openAlbumDetails = (albumId: string) => {
    console.log("Navigation vers l'album :", albumId);
    navigate(`/album/${albumId}`);
  };

  return (
    <div className="collection">
      <Header />

      <main className="collection_list">
        {isLoading && (
          <p className="status-msg">Chargement de la collection...</p>
        )}

        {!isLoading && albums.length === 0 && (
          <p className="status-msg">Aucun album dans votre collection.</p>
        )}

        {albums.map((item: any) => (
          <Album
            id={item.id}
            key={item.id}
            title={item.title}
            artist={item.artist}
            cover={item.coverUrl}
            // La prop onClick est bien passée ici
            onClick={() => openAlbumDetails(item.id)}
          />
        ))}
      </main>

      {/* Bouton d'ajout flottant */}
      <button
        className="add-button"
        onClick={openModaleAddNewAlbum}
        aria-label="Ajouter un album"
      >
        +
      </button>

      {/* Modale d'ajout */}
      {modaleAddNewAlbum && (
        <div className="modale_add_new_album">
          <div className="modale_content">
            <h2>Ajouter un vinyle</h2>
            <form onSubmit={submitNewAlbum}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Titre"
                  name="title"
                  value={album.title}
                  onChange={changeDataAlbum}
                  required
                />
                <input
                  type="text"
                  placeholder="Artiste"
                  name="artist"
                  value={album.artist}
                  onChange={changeDataAlbum}
                  required
                />
              </div>

              <input
                type="text"
                placeholder="URL Image (Cover)"
                name="coverUrl"
                value={album.coverUrl}
                onChange={changeDataAlbum}
              />

              <div className="form-row">
                <input
                  type="number"
                  placeholder="Année"
                  name="year"
                  value={album.year}
                  onChange={changeDataAlbum}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Prix"
                  name="price"
                  value={album.price}
                  onChange={changeDataAlbum}
                />
              </div>

              <select
                name="formatId"
                value={album.formatId}
                onChange={changeDataAlbum}
              >
                <option value="">-- Format --</option>
                {allMetadata?.formats?.map((f: any) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>

              <select
                name="conditionId"
                value={album.conditionId}
                onChange={changeDataAlbum}
              >
                <option value="">-- État du disque --</option>
                {allMetadata?.conditions?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.nameFR || c.nameEN}
                  </option>
                ))}
              </select>

              <select
                name="variantId"
                value={album.variantId}
                onChange={changeDataAlbum}
              >
                <option value="">-- Variante --</option>
                {allMetadata?.variants?.map((v: any) => (
                  <option key={v.id} value={v.id}>
                    {v.nameFR || v.nameEN}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Couleur précise"
                name="color"
                value={album.color}
                onChange={changeDataAlbum}
              />

              <select
                name="genreId"
                value={album.genreId}
                onChange={changeDataAlbum}
              >
                <option value="">-- Genre --</option>
                {allMetadata?.genres?.map((g: any) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <div className="buttons">
                <button type="submit" className="btn-save">
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setModaleAddNewAlbum(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default Collection;
