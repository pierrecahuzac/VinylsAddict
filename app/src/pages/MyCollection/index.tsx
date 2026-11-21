import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import { useCollection } from "../../hooks/useCollection.ts";
import type { UserAlbumData } from "../../types/album.ts";

import Modale from "../../components/Modale/index.tsx";
import AddAlbumFab from "../../components/AddAlbumFab/index.tsx";
import Album from "../../components/Album/index.tsx";
import { ALBUM_GRID_CLASS } from "../../lib/layout.ts";

interface AlbumState {
  artist: string;
  title: string;
  year: string;
  genreId: string;
  conditionId: string;
  variantId: string;
  formatId: string;
  price: string;
  editionSize?: string;
  copyNumber?: string;
  gifted: boolean;
  coverUrl: string;
  color: string;
  styleId: string;
  trackCount: string;
  diskCount: string;
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
  gifted: false,
  coverUrl: "",
  color: "",
  styleId: "",
  trackCount: "",
  diskCount: "",
  editionSize: "",
  copyNumber: "",
};

const MyCollection = () => {
  const { albums, getAllUserAlbums, isLoading, getAllMetadata, allMetadata } =
    useCollection<UserAlbumData>("userAlbums");
  const navigate = useNavigate();
  const [modaleAddNewAlbum, setModaleAddNewAlbum] = useState(false);
  const [album, setAlbum] = useState<AlbumState>(initialAlbumState);
  const [addAlbumToCollection, setAddAlbumToCollection] = useState(true);

  const changeDataAlbum = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setAlbum((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    setAlbum((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "price" && (value === "0" || value === "0.0" || value === "0.00")
        ? { gifted: true }
        : {}),
    }));
  };

  useEffect(() => {
    getAllUserAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      price: album.price !== "" ? parseFloat(album.price) : null,
      trackCount: album.trackCount ? parseInt(album.trackCount) : null,
      diskCount: album.diskCount ? parseInt(album.diskCount) : null,
      editionSize: album.editionSize ? parseInt(album.editionSize) : null,
      copyNumber: album.copyNumber ? album.copyNumber.trim() : null,
      addAlbumToCollection: true,
      gifted: album.gifted,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/albums`,
        payload,
        { withCredentials: true },
      );

      setAlbum(initialAlbumState);
      setModaleAddNewAlbum(false);
      getAllUserAlbums();
    } catch (error) {
      console.error("Erreur création album:", error);
    }
  };

  const openAlbumDetails = (albumId: string) => {
    navigate(`/collection/album/${albumId}`);
  };

  return (
    <div className="p-4 flex flex-col gap-6 bg-[#0a0a0a] min-h-full max-w-6xl mx-auto w-full">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Ma Collection</h1>
        {!isLoading && (
          <div className="text-gray-400 text-sm">
            Tu possèdes <span className="text-[#8b5cf6] font-bold">{albums.length}</span> album{albums.length > 1 ? "s" : ""} au total.
          </div>
        )}
      </header>

      <main className="w-full">
        {isLoading && (
          <div className="flex justify-center py-10">
            <p className="text-[#8b5cf6] animate-pulse">Ouverture des bacs...</p>
          </div>
        )}

        {!isLoading && albums.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
            <p className="italic text-center">Ta collection est vide. Il est temps de chiner !</p>
            <button 
              onClick={openModaleAddNewAlbum}
              className="text-[#8b5cf6] hover:underline font-medium"
            >
              Ajouter mon premier disque →
            </button>
          </div>
        )}

        <div className={ALBUM_GRID_CLASS}>
          {albums.length > 0 &&
            albums.map((item: UserAlbumData) => (
              <Album
                id={item.id}
                key={item.id}
                title={item?.album?.title}
                artist={item?.album?.artist}
                cover={item?.album?.coverUrl}
                year={String(item?.album?.releaseDate)}
                onClick={() => openAlbumDetails(item.id)}
                className="w-full"
              />
            ))}
        </div>
      </main>

      <AddAlbumFab onClick={openModaleAddNewAlbum} />

      {modaleAddNewAlbum && (
        <Modale
          submitNewAlbum={submitNewAlbum}
          album={album}
          changeDataAlbum={changeDataAlbum}
          setAlbum={setAlbum}
          allMetadata={allMetadata}
          setModaleAddNewAlbum={setModaleAddNewAlbum}
          addAlbumToCollection={addAlbumToCollection}
          setAddAlbumToCollection={setAddAlbumToCollection}
          isCollectionContext={true}
        />
      )}
    </div>
  );
};

export default MyCollection;
