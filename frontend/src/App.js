import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import DetailPage from "./pages/DetailPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./auth/PrivateRoute";
import PublicRoute from "./auth/PublicRoute";

import { useAuth } from "./auth/AuthContext";
import { useTheme } from "./hooks/useTheme";
import { useLanguage } from "./hooks/useLanguage";
import { useState } from "react";
import AddListModal from "./components/AddListModal";
import UserMenu from "./components/UserMenu";

function Header() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, changeLang, t } = useLanguage();
  const [view, setView] = useState("active");
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const switchView = (v) => {
    setView(v);
    navigate("/?view=" + v);
  };

  return (
    <>
      <header
        className="
          w-full bg-gray-900 text-white shadow-lg
          px-4 sm:px-6 py-4
          flex flex-col gap-4
          lg:flex-row lg:items-center lg:justify-between
        "
      >
        {/* LEFT */}
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🛒</span>
            <span className="text-xl sm:text-2xl font-bold">
              {t.title}
            </span>
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => switchView("active")}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base ${
                view === "active"
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {t.active}
            </button>

            <button
              onClick={() => switchView("archived")}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base ${
                view === "archived"
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {t.archived}
            </button>
          </div>

          {view === "active" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 sm:px-4 py-2 bg-blue-600 rounded-full text-sm sm:text-base"
            >
              + {t.addList}
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => changeLang(lang === "cs" ? "en" : "cs")}
            className="px-3 py-2 bg-gray-700 rounded-full"
          >
            {lang === "cs" ? "🇨🇿" : "🇬🇧"}
          </button>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-3 py-2 bg-gray-700 rounded-full"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <UserMenu />
        </div>
      </header>

      {showAddModal && (
        <AddListModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => navigate(0)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/detail/:id"
          element={
            <PrivateRoute>
              <DetailPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

