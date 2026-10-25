import { useState } from "react";
import api from "../lib/axios";
import type { AllMetadata } from "../types/album";


export const useCollection = () => {
  const [genres, setGenres] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allMetadata, setAllMetadata] = useState<AllMetadata | null>(null);

  const getAllMetadata = async () => {
    setIsLoading(true);
    try {
      const result = await api.get("/metadatas");

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
      const result = await api.get("/genres");
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
      const result = await api.get("/albums");
      setAlbums(result.data);
    } catch (error) {
      console.error("Erreur Albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllUserAlbums = async () => {
    try {
      const result = await api.get("/users/albums");
      
     
      setAlbums(result.data.allUserAlbums);
    } catch { void 0; }
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
