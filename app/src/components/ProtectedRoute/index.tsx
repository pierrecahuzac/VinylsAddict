import { Navigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userIsLogged, isLoading } = useUser();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Chargement...</div>;
  }

  if (!userIsLogged) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
