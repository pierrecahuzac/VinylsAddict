import axios from "axios";

const DISCOGS_BASE_URL = "https://api.discogs.com";
const USER_AGENT = process.env.DISCOGS_USER_AGENT || "VinylsAddictApp/1.0";
const TOKEN = process.env.DISCOGS_TOKEN;

const discogsClient = axios.create({
  baseURL: DISCOGS_BASE_URL,
  headers: {
    "User-Agent": USER_AGENT,
    ...(TOKEN ? { Authorization: `Discogs token=${TOKEN}` } : {}),
  },
});

export const DiscogsService = {
  search: async ({ query, type = "release", page = 1, per_page = 20 }) => {
    try {
      const response = await discogsClient.get("/database/search", {
        params: {
          q: query,
          type,
          page,
          per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Discogs API Search Error:", error.response?.data || error.message);
      throw new Error("Erreur lors de la recherche sur Discogs.");
    }
  },

  getRelease: async (id) => {
    try {
      const response = await discogsClient.get(`/releases/${id}`);
      return response.data;
    } catch (error) {
      console.error("Discogs API Get Release Error:", error.response?.data || error.message);
      throw new Error("Erreur lors de la récupération de l'album sur Discogs.");
    }
  },
};
