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
import * as z from "zod";

interface User {
  id: string;
  email: string;
  username: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  role?: string;
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

// Schéma de validation pour l'inscription
const signupSchema = z
  .object({
    username: z
      .string()
      .min(2, "Le nom d'utilisateur doit faire au moins 2 caractères"),
    email: z.email("Format d'email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit faire au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
      .regex(
        /[^A-Za-z0-9]/,
        "Le mot de passe doit contenir au moins un caractère spécial",
      ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirmation"],
  });

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
        `/api/users/checkToken`,
        {
          withCredentials: true,
        },
      );
      if (response.status === 200 && response.data.isLogged) {
        setUser(response.data.user);
        setUserIslogged(true);
      }
    } catch (error) {
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
      if (!email || !password) {
        onError("Email ou mot de passe absent.");
        return;
      }
      const result = await axios.post(
        `/api/users/login`,
        { email, password },
        { withCredentials: true },
      );
      if (result.status === 200 && result.data.isLogged) {
        setUser(result.data.user);
        setUserIslogged(true);
        setPassword("");
        setEmail("");
        navigate(`/collection`);
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

    // Validation avec Zod
    const validation = signupSchema.safeParse({
      username,
      email,
      password,
      passwordConfirmation,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0].message;
      onError(firstError);
      setErrorMessage(firstError);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/users/signup`,
        { email, password, passwordConfirmation, username },
        { withCredentials: true },
      );

      if (response.status === 409) {
        onError("Email existant, merci de vous connecter");
      }
      if (response.status === 201 || response.status === 200) {
        onSuccess("Compte créé avec succès !");
        // Optionnel: on pourrait rediriger vers le login ici
        navigate("/login");
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
        `/api/users/logout`,
        {},
        { withCredentials: true },
      );
      onSuccess("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion API", error);
    } finally {
      setUser(null);
      setUserIslogged(false);
      setEmail("");
      setPassword("");
      navigate("/");
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
