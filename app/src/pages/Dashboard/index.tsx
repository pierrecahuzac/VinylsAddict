import { useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import axios from "axios";
import { useNavigate } from "react-router";
import useToast from "../../hooks/useToast";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    verifyUserRole();
  }, []);
  useEffect(() => {
    fetchDatas();
  }, []);
  const fetchDatas = async () => {
    const [albums, users] = Promise.all([
      await getAllAbums(),
      await getAllUsers(),
    ]);
    console.log(albums, users);
  };
  const { onError, onSuccess } = useToast();
  const verifyUserRole = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/users/role`,

        { withCredentials: true },
      );
      //   console.log(response);
      //   if (response.data.role !== "ADMIN") {
      //     onError;
      //     navigate("/");
      //   }
    } catch (error) {
      console.log(error.response);
    }
  };
  const getAllAbums = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/albums`,
      );
      console.log(response);
    } catch (error) {
      onError("Impossible de recvupérer la listede tous les albums");
      console.log(error);
    }
  };
  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/users/`,
      );
      console.log(response);
    } catch (error) {
      onError("Impossible de recupérer la listede tous les albums");
      console.log(error);
    }
  };
  return <div className="w-100">dashboard</div>;
};

export default Dashboard;
