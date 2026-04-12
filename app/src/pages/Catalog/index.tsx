import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import { useCollection } from "../../hooks/useCollection.ts";
import Album from "../../components/Album/index.tsx";
import { useUser } from "../../contexts/userContext.tsx";
import Modale from "../../components/Modale/index.tsx";
import type { AlbumState } from "../../types/album.ts";

import "./Catalog.scss";



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

const Catalog = () => {
  const { albums, isLoading, getAllAlbums, getAllMetadata, allMetadata } =
    useCollection();
  const { userIsLogged } = useUser();

  const navigate = useNavigate();
  const [modaleAddNewAlbum, setModaleAddNewAlbum] = useState(false);

  const [album, setAlbum] = useState<AlbumState>(initialAlbumState);
  const [addAlbumToCollection, setAddAlbumToCollection] = useState(false);

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
      year: album.year ? Number(album.year) : null,
      price: album.price ? Number(album.price) : null,
      addAlbumToCollection
    };
    console.log(payload);
    
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
    navigate(`/album/${albumId}`);
  };

  return (
    <div className="catalog">
      <main className="catalog__list">
        <h1>Derniers ajouts</h1>
        {isLoading && <p className="status-msg">Chargement des albums...</p>}

        {!isLoading && albums.length === 0 && (
          <p className="status-msg">Aucun album dans votre collection.</p>
        )}

        {albums.length > 0 &&
          albums?.map((item: any) => (
            <Album
              id={item.id}
              key={item.id}
              title={item.title}
              artist={item.artist}
              cover={item.coverUrl}
              year={String(item.releaseDate)}
              onClick={() => openAlbumDetails(item.id)}
            />
          ))}
      </main>

      {userIsLogged && (
        <button
          className="add-button"
          onClick={openModaleAddNewAlbum}
          aria-label="Ajouter un album"
        >
          +
        </button>
      )}

      {modaleAddNewAlbum && (
        <Modale
          submitNewAlbum={submitNewAlbum}
          album={album}
          changeDataAlbum={changeDataAlbum}
          allMetadata={allMetadata}
          setModaleAddNewAlbum={setModaleAddNewAlbum}
          addAlbumToCollection={addAlbumToCollection}
          setAddAlbumToCollection={setAddAlbumToCollection}
        />
      )}
    </div>
  );
};

export default Catalog;
