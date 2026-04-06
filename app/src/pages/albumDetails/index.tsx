import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoHeartOutline } from "react-icons/io5";
import { useUser } from "../../contexts/userContext";

import "../../styles/albumDetails.scss";

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

const AlbumDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { userIsLogged } = useUser();

  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [userDetails, setUserDetails] = useState<UserAlbumData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const albumRes = await axios.get(
          `http://192.168.1.181:33000/api/albums/getOneAlbum/${id}`,
          {
            withCredentials: true,
          },
        );
        setAlbum(albumRes.data);

        if (userIsLogged) {
          const userAlbumRes = await axios.get(
            `http://192.168.1.181:33000/api/albums/getUserAlbum/${id}`,
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
    <div className="albumDetails">
      <div className="albumDetails-header">
        <div className="albumDetails-cover">
          <img
            src={album.coverUrl || "https://via.placeholder.com/200"}
            alt={album.title}
          />
        </div>
      </div>

      <div className="albumDetails__datas">
        <div className="albumDetails__infos">
          <div className="albumDetails__title-artist">
            {album.title} - {album.artist}
          </div>
          <div>Année: {album.releaseDate}</div>

          {/* On affiche les détails persos UNIQUEMENT s'ils existent (table pivot) */}
          {userDetails && (
            <>
              <hr />
              <div className="personal-section-title">Mon exemplaire :</div>
              <div>Prix d'achat: {userDetails.price} €</div>
              <div>Couleur: {userDetails.color}</div>
              <div>Condition: {userDetails.condition?.nameFR}</div>
              {userDetails.notes && <div>Note: {userDetails.notes}</div>}
            </>
          )}

          <div className="albumDetails__add-to-wishlist">
            <IoHeartOutline />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetails;
