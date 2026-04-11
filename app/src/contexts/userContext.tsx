import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import axios from "axios";
import useToast from "../hooks/useToast";
import { useNavigate } from "react-router";

interface User {
  id: string;
  email: string;
  username: string;
}

interface UserContextType {
  user: User | null;
  userIsLogged: boolean;
  isLoading: boolean;
  email: string;
  setEmail: (email: string) => void;
  login: (e: React.SyntheticEvent<HTMLFormElement>) => Promise<void>;
  logout: () => Promise<void>;
  checkToken: () => Promise<void>;
  signup: (e: SyntheticEvent<HTMLFormElement>) => Promise<void>;
  

  password: string;
  setPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  passwordConfirmation: string;
  setPasswordConfirmation: (passwordConfirmation: string) => void;
  setUser: (user: User | null) => void;
  setUserIslogged: (isLogged: boolean) => void;
  setErrorMessage: (message: string) => void;
  errorMessage: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userIsLogged, setUserIslogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { onError, onSuccess } = useToast();

  const checkToken = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/user/checkToken`,
        {
          withCredentials: true,
        },
      );
      if (response.status === 200 && response.data.isLogged) {
        setUser(response.data.user);
        setUserIslogged(true);
      }
    } catch (error) {
      // 401 est normal pour un visiteur, on ne logge pas d'erreur
      if (axios.isAxiosError(error) && error.response?.status !== 401) {
        console.error("Erreur technique checkToken");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const login = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if(!email || !password){
        onError("Email ou mot de passe absent.")
        return
      }
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/user/login`,
        { email, password },
        { withCredentials: true },
      );
      if (result.status === 200 && result.data.isLogged) {
        setUser(result.data.user);
        setUserIslogged(true);
        setPassword("");        
        setEmail("");        
        navigate(`/collection/${user?.id}`)
        onSuccess("Heureux de vous revoir !");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        onError(error.response?.data?.message || "Identifiants invalides.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!password || !passwordConfirmation || !email || !username) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/user/signup`,
        { email, password, passwordConfirmation, username },
        { withCredentials: true },
      );

      if (response.status === 201 || response.status === 200) {
        onSuccess("Compte créé avec succès !");
       
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message || "Erreur lors de l'inscription.";
        onError(msg);
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/user/logout`,
        {},
        { withCredentials: true },
      );
      setUser(null);
      setUserIslogged(false);
      setEmail("");
      setPassword("");
      onSuccess("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      onError("Erreur lors de la déconnexion.");
    }
  };

  const value = {
    user,
    userIsLogged,
    isLoading,
    email,
    setEmail,
    login,
    checkToken,


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
    signup,
    logout,
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
