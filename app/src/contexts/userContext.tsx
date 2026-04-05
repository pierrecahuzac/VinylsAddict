import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import axios from "axios";

const API_URL = "http://192.168.1.181:33000/api";

interface UserContextType {
  user: any; // Tu pourras remplacer 'any' par ton interface User plus tard
  userIsLogged: boolean;
  isLoading: boolean;
  email: string;
  setEmail: (email: string) => void;
  // ... ajoute ici toutes les variables et fonctions que tu veux partager
  login: (e: React.FormEvent) => Promise<void>;
  checkToken: () => Promise<void>;
  signup: (e: React.FormEvent) => Promise<void>;
  setModaleSignup: (value: boolean) => void;

  modaleLogin: boolean;
  setModaleLogin: (value: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  passwordConfirmation: string;
  setPasswordConfirmation: (passwordConfirmation: string) => void;
  modaleSignup: boolean;
  setUser: (user: any) => void;
  setUserIslogged: (isLogged: boolean) => void;
  setErrorMessage: (message: string) => void;
  errorMessage: string;
}

// 1. On crée le contexte vide au départ
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [modaleLogin, setModaleLogin] = useState(false);
  const [modaleSignup, setModaleSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [userIsLogged, setUserIslogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  // La fameuse fonction checkToken que tu avais dans App.tsx
  // On la met ici pour qu'elle s'exécute une seule fois au démarrage de l'app
  const checkToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/checkToken`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.isLogged) {
        setUser(response.data.user);
        setUserIslogged(true);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Erreur technique :", error);
      } else {
        console.log("Visiteur anonyme (OK)");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const result = await axios.post(
        `${API_URL}/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      console.log(result);
      if (result.status === 200 && result.data.isLogged === true) {
        setPassword("");
        setUser(result.data.user);

        setUserIslogged(true);
        //getUserCollection();
      }
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response.data.message) {
        setErrorMessage(error.response.data.message);
      }
    } finally {
      setModaleLogin(false);
      setIsLoading(false);
    }
  };
  // On expose tout ce qu'on veut rendre disponible
  const value = {
    user,
    userIsLogged,
    isLoading,
    email,
    setEmail,
    login,
    checkToken,
    setModaleLogin,
    setModaleSignup,
    modaleLogin,
    modaleSignup,
    username,
    setUsername,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    setUser,
    setUserIslogged,
    setErrorMessage,
    errorMessage,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUser doit être utilisé à l'intérieur d'un UserProvider",
    );
  }
  return context;
};
