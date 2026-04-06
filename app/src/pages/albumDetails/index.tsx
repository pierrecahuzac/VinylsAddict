import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface AlbumProps {
  title: string;
  artist: string;
  cover?: string;
  onClick: () => void;
}
import "../../styles/albumDetails.scss";
const AlbumDetails = ({ title, artist, cover }: AlbumProps) => {
  const albumId = useParams();
  console.log(albumId.id);
  const [albumDetails, setAlbumDetails] = useState({
    coverUrl: "",
    artist: "",
    title: "",
  });
  const getAlbumDetails = async () => {
    try {
      const result = await axios.get(
        `http://192.168.1.181:33000/api/albums/getOneAlbum/${albumId.id}`,
      );
      setAlbumDetails(result.data);
    } catch (error) {
      console.dir(error);
    }
  };
  useEffect(() => {
    getAlbumDetails();
  }, []);
  return (
    <div
      className="albumDetails"
      
    >
      <div className="albumDetails-header">
        <div className="albumDetails-cover">
          <img
            src={albumDetails?.coverUrl || "https://via.placeholder.com/200"}
            alt={title}
          />
        </div>
      </div>

      <div className="albumDetails__datas">
        <div className="albumDetails__infos">
          <div className="albumDetails__title-artist">{albumDetails?.title} - {albumDetails?.artist}</div>
          {/* <div>{albumDetails.artist}</div> */}
          <div>Année: {albumDetails?.releaseDate}</div>         
          <div>Prix: {albumDetails?.price} €</div>
          <div>Couleur: {albumDetails?.color}</div>
          <div>Condition: {albumDetails?.condition?.nameFR}</div>
          <div>Code barres: 3598342352</div>

        </div>
      </div>
    </div>
  );
};

export default AlbumDetails;
