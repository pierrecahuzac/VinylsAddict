import axios from "axios";
import { useEffect, useState } from "react";
import Album from "../../components/Album";
import { useNavigate } from "react-router";
import type { AlbumData } from "../../types/album";

interface WishlistEntry extends AlbumData {
  wishlistId: string;
}

const MyWishlist = () => {
  const [userWishlist, setUserWishlist] = useState<WishlistEntry[]>([]);
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

  return (
    <div>
      <h1>Ma liste d'envies</h1>
      {userWishlist.length === 0 ? (
        <p>Votre liste d'envies est vide.</p>
      ) : (
        <ul>
          {userWishlist.map((album) => (
            <Album
              id={album.id}
              key={album.wishlistId}
              title={album.title}
              artist={album.artist}
              cover={album.coverUrl}
              year={String(album.releaseDate)}
              onClick={() => openAlbumDetails(album.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyWishlist;
