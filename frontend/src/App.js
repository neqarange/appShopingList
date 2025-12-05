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

import { useAuth } from "./auth/AuthContext";
import { useTheme } from "./hooks/useTheme";
import { useLanguage } from "./hooks/useLanguage";
import { useState } from "react";
import AddListModal from "./components/AddListModal";

function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, changeLang, t } = useLanguage();
  const [view, setView] = useState("active");
  const [showAddModal, setShowAddModal] = useState(false);

  const navigate = useNavigate();

  const switchView = (v) => {
    setView(v);
    navigate("/?view=" + v);
  };

  if (!user) return null;

  return (
    <>
      <header className="w-full px-6 py-4 bg-gray-900 text-white shadow-lg flex justify-between items-center">
        {/* LEFT – LOGO + SWITCH + ADD LIST */}
        <div className="flex items-center gap-6">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🛒</span>
            <span className="text-2xl font-bold tracking-tight hover:opacity-80">
              {t.title}
            </span>
          </Link>

          {/* ACTIVE / ARCHIVED */}
          <div className="flex gap-2 ml-6">
            <button
              onClick={() => switchView("active")}
              className={`px-4 py-2 rounded-full transition ${
                view === "active"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {t.active}
            </button>

            <button
              onClick={() => switchView("archived")}
              className={`px-4 py-2 rounded-full transition ${
                view === "archived"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {t.archived}
            </button>
          </div>

          {/* ADD LIST – only when ACTIVE */}
          {view === "active" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 ml-4 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
            >
              + {t.addList}
            </button>
          )}
        </div>

        {/* RIGHT – LANGUAGE, THEME, USER */}
        <div className="flex items-center gap-4">
          {/* LANGUAGE */}
          <div
            onClick={() => changeLang(lang === "cs" ? "en" : "cs")}
            className="relative w-20 h-9 bg-gray-700 rounded-full cursor-pointer flex items-center px-2 transition border border-gray-600"
          >
            <div
              className={`absolute top-1 bottom-1 w-7 bg-white rounded-full shadow transition-transform duration-300 ${
                lang === "cs" ? "translate-x-0" : "translate-x-10"
              }`}
            ></div>

            <span className="w-1/2 text-center z-10 text-sm">🇨🇿</span>
            <span className="w-1/2 text-center z-10 text-sm">🇬🇧</span>
          </div>

          {/* THEME */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition flex items-center gap-2"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {/* USER */}
          <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-full shadow border border-gray-700">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Name + Email */}
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-gray-400">{user.email}</span>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition shadow"
              title={t.logout}
            >
              <span className="text-white text-lg leading-none">−</span>
            </button>
          </div>
        </div>
      </header>

      {/* MODAL */}
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
