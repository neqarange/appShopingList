import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ListCard from "../components/Dashboard/ListCard";
import { api } from "../api";

export default function DashboardPage() {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const view = params.get("view") || "active";

  const refreshLists = () => {
    api.getLists().then(setLists).catch(console.error);
  };

  useEffect(() => {
    refreshLists();
  }, []);

  const filtered = lists.filter((list) =>
    view === "archived" ? list.archived : !list.archived
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">

      {/* No header or title here anymore */}

      <div className="grid gap-4">
        {filtered.map((list) => (
          <ListCard
            key={list._id}
            title={list.name}
            archived={list.archived}
            members={[
              list.owner?.email,
              ...(list.sharedWith?.map((u) => u.email) || [])
            ]}
            onClick={() => navigate(`/detail/${list._id}`)}
          />
        ))}
      </div>
    </div>
  );
}



