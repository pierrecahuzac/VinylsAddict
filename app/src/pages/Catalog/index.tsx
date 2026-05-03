import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import { useCollection } from "../../hooks/useCollection.ts";
import { useUser } from "../../contexts/userContext.tsx";

import Album from "../../components/Album/index.tsx";
import Modale from "../../components/Modale/index.tsx";
import { IoAddOutline } from "react-icons/io5";

import type { AlbumState } from "../../types/album.ts";

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

  const submitNewAlbum = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...album,
      year: album.year ? Number(album.year) : null,
      price: album.price ? Number(album.price) : null,
      trackCount: album.trackCount ? Number(album.trackCount) : null,
      diskCount: album.diskCount ? Number(album.diskCount) : null,
      addAlbumToCollection,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/albums`,
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

  const openModaleAddNewAlbum = () => {
    getAllMetadata();
    setModaleAddNewAlbum(true);
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Catalogue</h1>
        <div className="text-gray-400 text-sm font-medium">
          Il y a{" "}
          <span className="text-[#f1c40f] font-bold">{albums.length}</span>{" "}
          album{albums.length > 1 ? "s" : ""} dans les derniers ajouts.
        </div>
      </header>

      <main className="w-full">
        {isLoading && (
          <div className="flex justify-center py-10">
            <p className="text-[#f1c40f] animate-pulse font-medium">
              Ouverture des bacs...
            </p>
          </div>
        )}
        {!isLoading && albums.length === 0 && (
          <p className="text-center text-gray-500 py-10 italic">
            Aucun album dans les derniers ajouts.
          </p>
        )}
        <div className="flex flex-col gap-3">
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
                className="w-full"
              />
            ))}

          {userIsLogged && (
            <button
              className="w-full h-20 mt-2 flex items-center justify-center gap-3 bg-gray-800/30 border-2 border-dashed border-gray-700 hover:border-[#f1c40f] hover:bg-gray-800/60 rounded-xl transition-all group overflow-hidden"
              onClick={openModaleAddNewAlbum}
            >
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-500 group-hover:text-[#f1c40f] group-hover:scale-110 transition-all">
                <IoAddOutline size={24} />
              </div>
              <span className="font-bold text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest text-xs">
                Ajouter un nouveau vinyle
              </span>
            </button>
          )}
        </div>
      </main>

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
