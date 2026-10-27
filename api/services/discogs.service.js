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

const RELEASE_CACHE_TTL = 60 * 60 * 1000;
const RELEASE_CACHE_MAX_SIZE = 200;
const releaseCache = new Map();

const EDITION_COLORS = [
  "black", "white", "red", "blue", "green", "yellow", "orange", "purple",
  "pink", "gold", "silver", "grey", "gray", "brown", "clear", "transparent",
  "translucent", "opaque", "turquoise", "violet", "maroon", "beige", "cream",
  "ivory", "teal", "magenta", "lavender", "multicolor",
];

const GENERIC_FORMAT_WORDS = new Set([
  "vinyl", "lp", "album", "single", "ep", "maxi", "maxi-single", "stereo",
  "mono", "12\"", "10\"", "7\"", "33 ⅓ rpm", "45 rpm", "78 rpm",
]);

const buildEdition = (release) => {
  const vinylFormat =
    (release.formats || []).find((format) => /vinyl/i.test(format.name || "")) ||
    release.formats?.[0] ||
    {};
  const descriptions = vinylFormat.descriptions || [];
  const haystack = [vinylFormat.text, ...descriptions]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const color = EDITION_COLORS.find((word) =>
    new RegExp(`\\b${word}\\b`).test(haystack),
  );
  const editionDetails = [vinylFormat.text, ...descriptions]
    .filter(Boolean)
    .filter((detail) => !GENERIC_FORMAT_WORDS.has(detail.toLowerCase()))
    .filter(
      (detail, index, list) =>
        list.findIndex((item) => item.toLowerCase() === detail.toLowerCase()) ===
        index,
    );

  const label = release.labels?.[0];

  return {
    id: release.id,
    color: color ? color.charAt(0).toUpperCase() + color.slice(1) : "",
    edition: editionDetails.join(" • "),
    year: release.year || "",
    country: release.country || "",
    label: label?.name || "",
    catno: label?.catno || "",
  };
};

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
    const key = String(id);
    const cached = releaseCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    try {
      const response = await discogsClient.get(`/releases/${key}`);
      releaseCache.set(key, {
        data: response.data,
        expiresAt: Date.now() + RELEASE_CACHE_TTL,
      });
      if (releaseCache.size > RELEASE_CACHE_MAX_SIZE) {
        releaseCache.delete(releaseCache.keys().next().value);
      }
      return response.data;
    } catch (error) {
      console.error("Discogs API Get Release Error:", error.response?.data || error.message);
      throw new Error("Erreur lors de la récupération de l'album sur Discogs.");
    }
  },

  getEditions: async (ids) => {
    const uniqueIds = [...new Set(ids.map(String))].slice(0, 10);
    const editions = [];

    for (let index = 0; index < uniqueIds.length; index += 3) {
      const batch = uniqueIds.slice(index, index + 3);
      const results = await Promise.all(
        batch.map(async (id) => {
          try {
            const release = await DiscogsService.getRelease(id);
            return buildEdition(release);
          } catch {
            return null;
          }
        }),
      );
      editions.push(...results.filter(Boolean));
    }

    return editions;
  },

  getImage: async (url) => {
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new Error("URL d'image invalide.");
    }

    const isDiscogsHost =
      parsedUrl.hostname === "discogs.com" ||
      parsedUrl.hostname.endsWith(".discogs.com");
    if (!["https:", "http:"].includes(parsedUrl.protocol) || !isDiscogsHost) {
      throw new Error("URL d'image non autorisée.");
    }

    const response = await discogsClient.get(parsedUrl.toString(), {
      responseType: "arraybuffer",
    });

    return {
      data: response.data,
      contentType: response.headers["content-type"] || "image/jpeg",
    };
  },
};
