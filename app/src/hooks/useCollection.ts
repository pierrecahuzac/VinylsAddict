import { useState } from "react";
import axios from "axios";

const API_URL = "http://192.168.1.181:33000/api";

export const useCollection = () => {
  const [genres, setGenres] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allMetadata, setAllMetadata] = useState(null); // Si tu veux stocker les métadonnées

  const getAllMetadata = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(`${API_URL}/metadata/getAllMetadatas`);
     
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
      const result = await axios.get(`${API_URL}/genres/getAll`);
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
      const result = await axios.get(`${API_URL}/albums/getAll`);
      setAlbums(result.data);
    } catch (error) {
      console.error("Erreur Albums:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  return { genres, albums, getAllGenres, getAllAlbums , isLoading, getAllMetadata, allMetadata };
};