import axios from "axios";

export const CollectionFunctions = {
  getUserCollection: async () => {
    try {
      await axios.get(`/api/user/albums`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
