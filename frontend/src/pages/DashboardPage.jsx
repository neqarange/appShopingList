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
  const [view, setView] = useState("active"); // "active" | "archived"

  const { theme, setTheme } = useTheme();
  const { lang, changeLang, t } = useLanguage();
  const navigate = useNavigate();

  const refreshLists = () => {
    api.getLists().then(setLists).catch(console.error);
  };

  useEffect(() => {
    refreshLists();
  }, []);

  const filtered = lists.filter((list) =>
    view === "active" ? !list.archived : list.archived
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">

      {/* HEADER */}
      <header className="sticky top-0 bg-gray-100 dark:bg-gray-900 z-40 pb-4 pt-6 px-6 shadow-sm dark:shadow-none">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-white tracking-tight mb-6">
          {view === "active" ? "🛒 " + t.title : "📦 " + t.archivedLists}
        </h1>

        <div className="flex justify-between items-center">

          {/* LEFT SIDE */}
          <div className="flex gap-2">

            {/* Active */}
            <button
              onClick={() => setView("active")}
              className={`px-4 py-2 rounded-full transition shadow-sm 
                ${view === "active"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border"}`}
            >
              {t.active}
            </button>

            {/* Archived */}
            <button
              onClick={() => setView("archived")}
              className={`px-4 py-2 rounded-full transition shadow-sm 
                ${view === "archived"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border"}`}
            >
              {t.archived}
            </button>

            {/* Add List – only in active */}
            {view === "active" && (
              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:scale-105 active:scale-95 transition"
              >
                + {t.addList}
              </button>
            )}
          </div>

          {/* RIGHT SIDE: Theme + Language */}
          <div className="flex gap-4 items-center">

            {/* THEME SWITCH */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="px-4 py-2 bg-white dark:bg-gray-700 rounded-full shadow hover:scale-105 active:scale-95 transition flex items-center gap-2"
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>

            {/* LANGUAGE SWITCH – Apple Style */}
            <div
              onClick={() => changeLang(lang === "cs" ? "en" : "cs")}
              className="relative w-24 h-10 bg-white dark:bg-gray-700 rounded-full shadow cursor-pointer flex items-center px-2 transition"
            >
              <div
                className={`absolute top-1 bottom-1 w-10 bg-gray-200 dark:bg-gray-500 rounded-full shadow transition-transform duration-300 ${
                  lang === "cs" ? "translate-x-0" : "translate-x-12"
                }`}
              ></div>

              <span className="w-1/2 text-center relative z-10">🇨🇿</span>
              <span className="w-1/2 text-center relative z-10">🇬🇧</span>
            </div>

          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-4">

        {filtered.map((list) => (
          <ListCard
            key={list._id}
            title={list.name}
            members={[
              list.owner?.email,
              ...(list.sharedWith?.map((u) => u.email) || [])
            ]}
            archived={list.archived}
            onClick={() => navigate(`/detail/${list._id}`)}
          />
        ))}
      </main>

      {showModal && (
        <AddListModal
          onClose={() => setShowModal(false)}
          onCreated={refreshLists}
        />
      )}
    </div>
  );
}

