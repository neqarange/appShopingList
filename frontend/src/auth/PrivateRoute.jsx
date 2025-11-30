import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getToken } from "../api";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  // pokud není validní token = logout
  if (!user || !getToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
