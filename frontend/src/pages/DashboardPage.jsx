import { useEffect, useState } from "react";
import ListCard from "../components/Dashboard/ListCard";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import AddListModal from "../components/AddListModal.jsx";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";

export default function DashboardPage() {
  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("active"); // active | archived

  const { theme, setTheme } = useTheme();
  const { lang, changeLang, t } = useLanguage();
  const navigate = useNavigate();

  const refreshLists = () => {
    api.getLists()
      .then(setLists)
      .catch(console.error);
  };

  useEffect(() => {
    refreshLists();
  }, []);

  const filtered = lists.filter((list) =>
    view === "active" ? !list.archived : list.archived
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">

      {/* Nadpis */}
      <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-4">
        {view === "active" ? "🛒 " + t.title : "📦 " + t.archivedLists}
      </h1>

      {/* Horní lišta */}
      <div className="flex justify-between items-center mb-6">

        {/* LEVÁ STRANA: active / archived / add list */}
        <div className="flex gap-3">

          {/* Active */}
          <button
            onClick={() => setView("active")}
            className={`px-4 py-2 rounded-lg shadow transition 
              ${view === "active"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`}
          >
            {t.active}
          </button>

          {/* Archived */}
          <button
            onClick={() => setView("archived")}
            className={`px-4 py-2 rounded-lg shadow transition 
              ${view === "archived"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`}
          >
            {t.archived}
          </button>

          {/* Přidat seznam – pouze aktivní režim */}
          {view === "active" && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              + {t.addList}
            </button>
          )}
        </div>

        {/* PRAVÁ STRANA – Dark mode + Language switch */}
        <div className="flex gap-4 items-center">

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white 
            rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {/* 🌍 Apple/Google Language Switch */}
          <div
            onClick={() => changeLang(lang === "cs" ? "en" : "cs")}
            className="relative w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer flex items-center px-2 transition"
          >
            {/* Slider */}
            <div
              className={`absolute top-1 bottom-1 w-10 bg-white dark:bg-gray-500 rounded-full shadow transition-transform duration-300 ${
                lang === "cs" ? "translate-x-0" : "translate-x-12"
              }`}
            ></div>

            {/* Flags */}
            <span className="w-1/2 text-center relative z-10">🇨🇿</span>
            <span className="w-1/2 text-center relative z-10">🇬🇧</span>
          </div>
        </div>
      </div>

      {/* LISTY */}
      <div className="grid gap-4">
        {filtered.map((list) => (
          <ListCard
            key={list._id}
            title={list.name}
            members={[
              list.owner?.email,
              ...(list.sharedWith?.map((u) => u.email) || [])
            ]}
            items={[]} 
            archived={list.archived}
            onClick={() => navigate(`/detail/${list._id}`)}
          />
        ))}
      </div>

      {/* Modal přidání seznamu */}
      {showModal && (
        <AddListModal
          onClose={() => setShowModal(false)}
          onCreated={refreshLists}
        />
      )}
    </div>
  );
}

