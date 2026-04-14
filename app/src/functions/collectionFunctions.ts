import axios from "axios";

export const CollectionFunctions = {
  getUserCollection: async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL_DEV}/user/albums`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
