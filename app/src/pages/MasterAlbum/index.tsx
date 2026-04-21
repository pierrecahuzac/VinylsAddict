import axios from "axios";
import { useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { IoHeartOutline, IoLibrary } from "react-icons/io5";
import { useUser } from "../../contexts/userContext";

import useToast from "../../hooks/useToast";
import type { AlbumData, UserAlbumData } from "../../types/album";

import "./MasterAlbum.scss";
import { useCollection } from "../../hooks/useCollection";

const MasterAlbum = () => {
  const { id } = useParams<{ id: string }>();
  const { userIsLogged } = useUser();
  const { allMetadata, getAllMetadata } = useCollection();
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [userDetails, setUserDetails] = useState<UserAlbumData | null>(null);
  const { onError } = useToast();
  const [modalAddAlbumToUserCollection, setModalAddAlbumToUserCollection] =
    useState(false);
  const [addAlbumToCollection, setAddAlbumToCollection] = useState({
    price: "",
    variantId: "",
    conditionId: "",
  });
  const [albumAddedToCollection, setAlbumAddedToCollection] = useState({
    price: "",
    conditionId: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const albumRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_DEV}/albums/${id}`,
          {
            withCredentials: true,
          },
        );

        setAlbum(albumRes.data);

        if (userIsLogged) {
          const userAlbumRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL_DEV}/users/albums/${id}`,
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
    getAllMetadata();
    fetchData();
  }, [id, userIsLogged]);

  if (!album) return <div>Chargement...</div>;

  const addToUserWishlist = async () => {
    console.log(userIsLogged);
    if (!userIsLogged) {
      onError(
        `Vous devez être connecté à l'application pour utiliser cette fonctionnalité`,
      );
    }

    console.log(id);

    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/wishlists/${id}`,
        {},
        {
          withCredentials: true,
        },
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const openModalAddAlbumToUserCollection = async () => {
    if (!userIsLogged) {
      onError(
        `Vous devez être connecté à l'application pour utiliser cette fonctionnalité`,
      );
    }
    setModalAddAlbumToUserCollection(true);
  };
  const addAlbumToUserCollection = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/collections/${id}`,
        {
          price: albumAddedToCollection.price,
          conditionId: albumAddedToCollection.conditionId,
        },
        {
          withCredentials: true,
        },
      );
      console.log(result);
      setModalAddAlbumToUserCollection(false);
    } catch (error) {
      onError(error.response.data.message);
      //console.log(error.response.data.message);
    }
  };

  const changeDataAlbum = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setAlbumAddedToCollection({
      ...albumAddedToCollection,
      [e.target.name]: e.target.value,
    });
  };

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
            <IoHeartOutline onClick={addToUserWishlist} />
          </div>
          {userIsLogged && (
            <div className="album-card__owned-badge" title="Dans ma collection">
              <IoLibrary onClick={openModalAddAlbumToUserCollection} />
            </div>
          )}
        </div>
        {modalAddAlbumToUserCollection && (
          <div className="modal">
            <div className="modal-content">
              <h2>Ajouter à ma collection</h2>
              <form action="submit">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Prix"
                  name="price"
                  value={albumAddedToCollection.price}
                  onChange={changeDataAlbum}
                />

                <select
                  name="conditionId"
                  value={albumAddedToCollection.conditionId}
                  onChange={changeDataAlbum}
                >
                  <option value="">-- État --</option>
                  {allMetadata?.conditions?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameFR}
                    </option>
                  ))}
                </select>
                <button onClick={(e) => addAlbumToUserCollection(e)}>
                  Ajouter
                </button>
                <button onClick={() => setModalAddAlbumToUserCollection(false)}>
                  Annuler
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterAlbum;
