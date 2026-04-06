import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import { useCollection } from "../../hooks/useCollection.ts";
import Album from "../../components/album/index.tsx";
import { useUser } from "../../contexts/userContext.tsx";
import Modale from "../../components/modale/index.tsx";

import "../../styles/albumsPage.scss";

// 1. Définition du type pour l'état local du formulaire
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
  styleId: ""
};

const AlbumsPage = () => {
  const { albums, getAllAlbums, isLoading, getAllMetadata, allMetadata } = useCollection();
  const { userIsLogged } = useUser();
  const navigate = useNavigate();
  const [modaleAddNewAlbum, setModaleAddNewAlbum] = useState(false);
  
  const [album, setAlbum] = useState<AlbumState>(initialAlbumState);

  // 2. Typage explicite du ChangeEvent
  const changeDataAlbum = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  
  // 3. Utilisation de FormEvent pour éviter la dépréciation
  const submitNewAlbum = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...album,
      // Conversion sécurisée pour PostgreSQL via Prisma
      year: album.year ? Number(album.year) : null,
      price: album.price ? Number(album.price) : null,
    };

    try {
      await axios.post(
        "http://192.168.1.181:33000/api/albums/create",
        payload,
        { withCredentials: true }
      );

      // Reset complet via la constante
      setAlbum(initialAlbumState);
      setModaleAddNewAlbum(false);
      getAllAlbums(); // Rafraîchir la liste après l'ajout
    } catch (error) {
      console.error("Erreur création album:", error);
    }
  };

  const openAlbumDetails = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };
  
  return (
    <div className="albums_page_">
      <main className="albums_page__list">
        {isLoading && (
          <p className="status-msg">Chargement des albums...</p>
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
        />
      )}
    </div>
  );
};

export default AlbumsPage;