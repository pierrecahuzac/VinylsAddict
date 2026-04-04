import { useState } from "react";
import axios from "axios";

const API_URL = "http://192.168.1.181:33000/api";

export const useUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [modaleLogin, setModaleLogin] = useState(false);
  const [modaleSignup, setModaleSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [userIsLogged, setUserIslogged] = useState(false);

  const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      });
      console.log(result);
      if (result.status === 200 && result.data.isLogged === true) {
        setPassword("");
        setUser(result.data.user);
        setUserIslogged(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setModaleLogin(false);
    }
  };
  const signup = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${API_URL}/user/signup`, {
        email,
        password,
        passwordConfirmation,
      });
      console.log(result);
    } catch (error) {
      if (error.response) {
        console.log(
          "Message d'erreur du serveur :",
          error.response.data.message,
        );
        console.log("Statut HTTP :", error.response.status);
      } else {
        
        console.log("Erreur :", error.message);
      }
    } finally {
      setModaleLogin(false);
    }
  };
  return {
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    modaleLogin,
    setModaleLogin,
    modaleSignup,
    setModaleSignup,
    user,
    setUser,
    userIsLogged,
    setUserIslogged,
    login,
    signup,
  };
};
