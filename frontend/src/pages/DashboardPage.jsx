import { useEffect, useState } from "react";
import ListCard from "../components/Dashboard/ListCard";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import AddListModal from "../components/AddListModal.jsx";



export default function DashboardPage() {
  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        🛒 Nákupní seznamy  
      </h1>

      {/* Přidat seznam */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Přidat seznam
        </button>
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
