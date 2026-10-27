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
import { ALBUM_GRID_CLASS } from "../../lib/layout.ts";

import type { AlbumState, AlbumData } from "../../types/album.ts";

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
    useCollection<AlbumData>("albums");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="p-4 flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Catalogue
        </h1>
        <div className="text-gray-400 text-sm font-medium">
          Il y a{" "}
          <span className="text-[#8b5cf6] font-bold">{albums.length}</span>{" "}
          album{albums.length > 1 ? "s" : ""} dans les derniers ajouts.
        </div>
      </header>

      <main className="w-full">
        {isLoading && (
          <div className="flex justify-center py-10">
            <p className="text-[#8b5cf6] animate-pulse font-medium">
              Ouverture des bacs...
            </p>
          </div>
        )}
        {!isLoading && albums.length === 0 && (
          <p className="text-center text-gray-500 py-10 italic">
            Aucun album dans les derniers ajouts.
          </p>
        )}
        {!isLoading && albums.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">Récemment ajoutés</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
              {albums.slice(0, 10).map((item: AlbumData) => (
                <button
                  key={`carousel-${item.id}`}
                  onClick={() => openAlbumDetails(item.id)}
                  className="snap-start shrink-0 w-36 group"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white/5 shadow-lg ring-1 ring-white/5 transition-transform group-hover:scale-[1.02]">
                    <img
                      src={item.coverUrl || "/placeholder.jpg"}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-white line-clamp-1 group-hover:text-[#8b5cf6]">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">{item.artist}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        <h2 className="text-lg font-bold text-white tracking-tight">Tous les albums</h2>
        <div className={ALBUM_GRID_CLASS}>
          {albums.length > 0 &&
            albums?.map((item: AlbumData) => (
              <Album
                id={item.id}
                key={item.id}
                title={item.title}
                artist={item.artist}
                cover={item.coverUrl}
                year={String(item.releaseDate)}
                color={item.color}
                onClick={() => openAlbumDetails(item.id)}
                className="w-full"
              />
            ))}

          {userIsLogged && (
            <button
              className="aspect-square w-full flex flex-col items-center justify-center gap-2 bg-white/5/30 border-2 border-dashed border-white/10 hover:border-[#8b5cf6] hover:bg-white/5/60 rounded-2xl transition-all group overflow-hidden"
              onClick={openModaleAddNewAlbum}
            >
              <div className="w-10 h-10 rounded-full bg-[#0a0a0a] flex items-center justify-center text-gray-500 group-hover:text-[#8b5cf6] group-hover:scale-110 transition-all">
                <IoAddOutline size={24} />
              </div>
              <span className="font-bold text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest text-[10px] text-center px-2">
                Ajouter un vinyle
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
          setAlbum={setAlbum}
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
