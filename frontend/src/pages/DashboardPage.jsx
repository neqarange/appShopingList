import { useEffect, useState } from "react";
import ListCard from "../components/Dashboard/ListCard";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function DashboardPage() {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getLists().then(setLists).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        🛒 Nákupní seznamy
      </h1>

      <div className="grid gap-4">
        {lists.map((list) => (
          <ListCard
            key={list._id}
            title={list.name}
            members={list.sharedWith?.length ? list.sharedWith.map(String) : []}
            items={(list.items || []).slice(0,3).map(it => ({ name: it.name, isChecked: !!it.bought }))}
            onClick={() => navigate(`/detail/${list._id}`)}
          />
        ))}
      </div>
    </div>
  );
}
