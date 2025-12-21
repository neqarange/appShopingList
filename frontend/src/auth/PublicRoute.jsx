import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getToken } from "../api";

export default function PublicRoute({ children }) {
  const { user } = useAuth();

  // pokud je přihlášený → nesmí na login/register
  if (user && getToken()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
