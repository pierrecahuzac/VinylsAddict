import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import { useCollection } from "../../hooks/useCollection.ts";

import Modale from "../../components/Modale/index.tsx"; 
import Album from "../../components/Album/index.tsx";

import "./MyCollection.scss";

interface AlbumState {
  artist: string;
  title: string;
  year: string;
  genreId: string;
  conditionId: string;
  variantId: string;
  formatId: string;
  price: string;
  coverUrl: string;
  color: string;
  styleId: string;
}

const initialAlbumState: AlbumState = {
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
  styleId: "",
};

const MyCollection = () => {
  const { albums, getAllAlbums, isLoading, getAllMetadata, allMetadata } =
    useCollection();
  const navigate = useNavigate();
  const [modaleAddNewAlbum, setModaleAddNewAlbum] = useState(false);
  const [album, setAlbum] = useState<AlbumState>(initialAlbumState);

  const changeDataAlbum = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  const submitNewAlbum = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...album,
      year: album.year ? parseInt(album.year) : null,
      price: album.price ? parseFloat(album.price) : null,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/albums/create`,
        payload,
        { withCredentials: true },
      );

      setAlbum(initialAlbumState);
      setModaleAddNewAlbum(false);
      getAllAlbums();
    } catch (error) {
      console.error("Erreur création album:", error);
    }
  };

  const openAlbumDetails = (albumId: string) => {
    navigate(`/collection/album/${albumId}`);
  };

  return (
    <div className="my-collection">
      <main className="my-collection_list">
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
            year={item.releaseDate}
            onClick={() => openAlbumDetails(item.id)}
          />
        ))}
      </main>

      <button
        className="add-button"
        onClick={openModaleAddNewAlbum}
        aria-label="Ajouter un album"
      >
        +
      </button>

      {modaleAddNewAlbum && (
        <Modale
          submitNewAlbum={submitNewAlbum}
          album={album}
          changeDataAlbum={changeDataAlbum}
          allMetadata={allMetadata}
          setModaleAddNewAlbum={setModaleAddNewAlbum}
        />
      )}
    </div>
  );
};

export default MyCollection;
