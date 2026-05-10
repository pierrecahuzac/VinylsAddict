import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import { useCollection } from "../../hooks/useCollection.ts";

import Modale from "../../components/Modale/index.tsx"; 
import Album from "../../components/Album/index.tsx";

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
  coverUrl: "",
  color: "",
  styleId: "",
  trackCount: "",
  diskCount: "",
};

const MyCollection = () => {
  const { albums, getAllUserAlbums, isLoading, getAllMetadata, allMetadata } =
    useCollection();
  const navigate = useNavigate();
  const [modaleAddNewAlbum, setModaleAddNewAlbum] = useState(false);
  const [album, setAlbum] = useState<AlbumState>(initialAlbumState);
  const [addAlbumToCollection, setAddAlbumToCollection] = useState(true);

  const changeDataAlbum = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setAlbum({
      ...album,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getAllUserAlbums();
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
      trackCount: album.trackCount ? parseInt(album.trackCount) : null,
      diskCount: album.diskCount ? parseInt(album.diskCount) : null,
      addAlbumToCollection: true,
    };

    try {
      await axios.post(
        `/api/albums`,
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
    <div className="p-4 flex flex-col gap-6 bg-gray-900 min-h-full">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Ma Collection</h1>
        {!isLoading && (
          <div className="text-gray-400 text-sm">
            Tu possèdes <span className="text-[#f1c40f] font-bold">{albums.length}</span> album{albums.length > 1 ? "s" : ""} au total.
          </div>
        )}
      </header>

      <main className="w-full">
        {isLoading && (
          <div className="flex justify-center py-10">
            <p className="text-[#f1c40f] animate-pulse">Ouverture des bacs...</p>
          </div>
        )}

        {!isLoading && albums.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
            <p className="italic text-center">Ta collection est vide. Il est temps de chiner !</p>
            <button 
              onClick={openModaleAddNewAlbum}
              className="text-[#f1c40f] hover:underline font-medium"
            >
              Ajouter mon premier disque →
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {albums.length > 0 &&
            albums.map((item: any) => (
              <Album
                id={item?.album?.id}
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

      <button
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#f1c40f] text-gray-900 rounded-full text-3xl font-bold shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-10"
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
          addAlbumToCollection={addAlbumToCollection}
          setAddAlbumToCollection={setAddAlbumToCollection}
          isCollectionContext={true}
        />
      )}
    </div>
  );
};

export default MyCollection;
