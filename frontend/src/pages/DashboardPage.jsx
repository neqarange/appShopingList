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

  const { theme, setTheme } = useTheme();
  const { lang, t, changeLang } = useLanguage();

  const navigate = useNavigate();

  const refreshLists = () => {
    api.getLists()
      .then(setLists)
      .catch(console.error);
  };

  useEffect(() => {
    refreshLists();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">

      {/* 1) Nadpis */}
      <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-4">
        🛒 {t.title}
      </h1>

      {/* 2) Druhý řádek */}
      <div className="flex justify-between items-center mb-6">

        {/* Levá strana – Přidat seznam */}
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + {t.addList}
        </button>

        {/* Pravá strana – Theme + Language */}
        <div className="flex gap-3">

          {/* Dark / Light toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
          >
            {theme === "light" ? "🌙" : "☀️"}
            {theme === "light" ? t.darkMode : t.lightMode}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => changeLang(lang === "cs" ? "en" : "cs")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
          >
            {lang === "cs" ? "🇨🇿" : "🇬🇧"}
            {t.language}
          </button>
        </div>
      </div>

      {/* Výpis seznamů */}
      <div className="grid gap-4">
        {lists.map((list) => (
          <ListCard
            key={list._id}
            title={list.name}
            members={[
              list.owner?.email,
              ...(list.sharedWith?.map((u) => u.email) || [])
            ]}
            items={[]} 
            onClick={() => navigate(`/detail/${list._id}`)}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <AddListModal
          onClose={() => setShowModal(false)}
          onCreated={refreshLists}
        />
      )}
    </div>
  );
}
