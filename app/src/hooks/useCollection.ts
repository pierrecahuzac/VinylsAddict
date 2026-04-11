import { useState } from "react";
import axios from "axios";

export const useCollection = () => {
  const [genres, setGenres] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allMetadata, setAllMetadata] = useState(null);

  const getAllMetadata = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/metadata/getAllMetadatas`,
      );

      setAllMetadata(result.data);
    } catch (error) {
      console.error("Erreur Métadonnées:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllGenres = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/genres/getAll`,
      );
      setGenres(result.data);
    } catch (error) {
      console.error("Erreur Genres:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllAlbums = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/albums/getAllAlbums`,
      );
      setAlbums(result.data);
    } catch (error) {
      console.error("Erreur Albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllUserAlbums = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/albums/getAllUserAlbums`,
        {
          withCredentials: true,
        },
      );
      console.log(result.data);
      setAlbums(result.data);
    } catch (error) {}
  };

  return {
    genres,
    albums,
    getAllGenres,
    getAllAlbums,
    getAllUserAlbums,
    isLoading,
    getAllMetadata,
    allMetadata,
  };
};
