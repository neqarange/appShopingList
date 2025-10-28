import { useState } from "react";
import ListCard from "../components/Dashboard/ListCard";
import { shoppingLists } from "../data/shoppingLists";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [lists] = useState(shoppingLists);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        🛒 Nákupní seznamy
      </h1>

      <div className="grid gap-4">
        {lists.map((list) => (
          <ListCard
            key={list.id}
            title={list.title}
            members={list.members}
            items={list.items}
            onClick={() => navigate(`/detail/${list.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
