import { useEffect, useState } from "react";
import ListCard from "../components/Dashboard/ListCard";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import AddListModal from "../components/AddListModal.jsx";
import { useTheme } from "../hooks/useTheme";

export default function DashboardPage() {
  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { theme, setTheme } = useTheme();
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

      {/* 1) Titulek */}
      <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-4">
        🛒 Nákupní seznamy
      </h1>

      {/* 2) Druhý řádek: vlevo Přidat seznam, vpravo Theme / Language */}
      <div className="flex justify-between items-center mb-6">

        {/* Levá strana */}
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Přidat seznam
        </button>

        {/* Pravá strana */}
        <div className="flex gap-3">

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => alert('Language switching soon')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            CZ / EN
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
            items={[]}  // zatím nerozesíláme preview položky
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
