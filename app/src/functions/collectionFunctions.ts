import axios from "axios";
const API_URL = "http://192.168.1.181:33000/api";

export const CollectionFunctions = {
  getUserCollection: async () => {
    try {
      await axios.get(`${API_URL}/user/collection`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
