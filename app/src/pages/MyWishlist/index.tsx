import axios from "axios";
import { useEffect, useState } from "react";
import Album from "../../components/Album";
import { useNavigate } from "react-router";
import type { AlbumData } from "../../types/album";
import { IoTrash } from "react-icons/io5";
import { useUser } from "../../contexts/userContext";

interface WishlistEntry extends AlbumData {
  wishlistId: string;
}

import './MyWishlist.scss'

const MyWishlist = () => {
  const [userWishlist, setUserWishlist] = useState<WishlistEntry[]>([]);
  const { user } = useUser();
  const [modaleDeleteFromWWishlist, setModaleDeleteFromWishlist] =
    useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserWishlist = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/wishlists`,
        {
          withCredentials: true,
        },
      );

      setUserWishlist(result.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la liste d'envies",
        error,
      );
    }
  };

  useEffect(() => {
    fetchUserWishlist();
  }, []);

  const openAlbumDetails = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };
  const submitDeleteAlbumFromWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>,
    albumId: string,
  ) => {
    console.log("coucou");

    e.preventDefault();
    if (!userWishlist) return;
    try {
      const result = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/wishlists/${albumId}`,
        {
          withCredentials: true,
        },
      );
      console.log(result);
      if (result.status === 200) {
        setModaleDeleteFromWishlist(false);
        await fetchUserWishlist();
        navigate(`/wishlist/${user?.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'album :", error);
    }
  };
  return (
    <div>
      <div>Tu as {userWishlist.length} album{userWishlist.length > 1 ? "s" : ""} dans ta wishlist.</div>
      {userWishlist.length === 0 ? (
        <p>Votre liste d'envies est vide.</p>
      ) : (
        <ul className="wishlist-albums">
          {userWishlist.map((album) => (
            <>
              <Album
                id={album.id}
                data-id={album.id}
                key={album.wishlistId}
                title={album.title}
                artist={album.artist}
                cover={album.coverUrl}
                year={String(album.releaseDate)}
                onClick={() => openAlbumDetails(album.id)}
              />
              <IoTrash
                onClick={() => {
                  setAlbumToDelete(album.id);
                  setModaleDeleteFromWishlist(true);
                }}
              />
            </>
          ))}
        </ul>
      )}
      {modaleDeleteFromWWishlist && albumToDelete && (
        <div className="modale-delete">
          <p>Êtes-vous sûr de vouloir supprimer cet album ?</p>
          <button
            onClick={(e) => submitDeleteAlbumFromWishlist(e, albumToDelete)}
          >
            Supprimer
          </button>
          <button onClick={() => setAlbumToDelete(null)}>Annuler</button>
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
