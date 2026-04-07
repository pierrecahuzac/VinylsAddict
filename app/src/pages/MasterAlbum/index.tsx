import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoHeartOutline, IoLibrary } from "react-icons/io5";
import { useUser } from "../../contexts/userContext";

import "./MasterAlbum.scss";

interface AlbumData {
  title: string;
  artist: string;
  coverUrl: string;
  releaseDate?: number;
}

interface UserAlbumData {
  price?: number;
  color?: string;
  condition?: { nameFR: string };
  notes?: string;
}

const MasterAlbum = () => {
  const { id } = useParams<{ id: string }>();
  const { userIsLogged } = useUser();

  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [userDetails, setUserDetails] = useState<UserAlbumData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const albumRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_DEV}/albums/getOneAlbum/${id}`,
          {
            withCredentials: true,
          },
        );
        setAlbum(albumRes.data);

        if (userIsLogged) {
          const userAlbumRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL_DEV}/albums/getUserAlbum/${id}`,
            {
              withCredentials: true,
            },
          );
          setUserDetails(userAlbumRes.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    fetchData();
  }, [id, userIsLogged]);

  if (!album) return <div>Chargement...</div>;

  return (
    <div className="master-album">
      <div className="master-album-header">
        <div className="master-album-cover">
          <img
            src={album.coverUrl || "https://via.placeholder.com/200"}
            alt={album.title}
          />
        </div>
      </div>

      <div className="master-album__datas">
        <div className="master-album__infos">
          <div className="master-album__title-artist">
            {album.title} - {album.artist}
          </div>
          <div>Année: {album.releaseDate}</div>

          {userDetails && (
            <>
              <hr />

              <div>Couleur: {userDetails.color}</div>
            </>
          )}

          <div className="master-album__add-to-wishlist">
            <IoHeartOutline />
          </div>
          {userIsLogged && (
            <div className="album-card__owned-badge" title="Dans ma collection">
              <IoLibrary />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterAlbum;
