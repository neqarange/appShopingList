import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ItemForm from "../components/Dashboard/Detail/ItemForm";
import ActionButtons from "../components/Dashboard/Detail/ActionButtons";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../hooks/useLanguage";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const isOwner = list?.owner?._id === user?._id;
  const isArchived = list?.archived === true;

  async function loadData() {
    try {
      const listData = await api.getList(id);
      setList(listData);

      const itemsData = await api.getItems(id);
      setItems(itemsData);
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function handleAdd() {
    if (isArchived) return;
    const item = await api.addItem(id, "New item", "", 1);
    setItems((prev) => [item, ...prev]);
  }

  async function toggleBought(item) {
    if (isArchived) return;
    const updated = await api.setBought(id, item._id, !item.bought);
    setItems((prev) => prev.map((x) => (x._id === item._id ? updated : x)));
  }

  async function archiveItem(it) {
    if (isArchived) return;
    try {
      await api.archiveItem(id, it._id);
      setItems((prev) =>
        prev.map((x) =>
          x._id === it._id ? { ...x, archived: true } : x
        )
      );
      setSelectedItem(null);
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleSave(updated) {
    if (isArchived) return;

    try {
      const saved = await api.updateItem(id, updated._id, updated);

      setItems((prev) =>
        prev.map((i) => (i._id === saved._id ? saved : i))
      );

      setSelectedItem(null);
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDeleteList() {
    if (!isOwner) return;
    await api.deleteList(id);
    navigate("/");
  }

  async function handleArchiveList() {
    if (!isOwner || isArchived) return;

    await api.archiveList(id);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* Sticky header */}
      <div className="sticky top-0 bg-gray-100 dark:bg-gray-900 pb-4 pt-6 px-6 z-20 shadow-sm">
        
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 dark:text-blue-300 hover:underline"
        >
          ← {t.back}
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mt-3 mb-2">
          {list?.name}
        </h1>

        {/* Archived label */}
        {isArchived && (
          <p className="text-center text-yellow-500 font-medium">
            ⚠️ Tento seznam je archivovaný (read-only)
          </p>
        )}
      </div>

      {/* Items list */}
      <div className="p-6 space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            onClick={() => !isArchived && setSelectedItem(item)}
            className={`
              p-4 rounded-2xl cursor-pointer flex justify-between items-center
              bg-white dark:bg-gray-800 shadow-sm
              hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
              transition
              ${isArchived ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            <span className={`text-lg ${item.bought ? "line-through text-gray-400" : ""}`}>
              {item.name}
            </span>

            <input
              type="checkbox"
              checked={!!item.bought}
              onChange={() => toggleBought(item)}
              disabled={isArchived}
              className="w-5 h-5 accent-blue-600"
            />
          </div>
        ))}
      </div>

      {/* Item detail */}
      {selectedItem && !isArchived && (
        <div className="animate-fadeInUp">
          <ItemForm
            item={selectedItem}
            onSave={handleSave}
            onDelete={() => archiveItem(selectedItem)}
          />
        </div>
      )}

      {/* Bottom buttons */}
      <ActionButtons
        onAdd={!isArchived ? handleAdd : undefined}
        onSave={isOwner && !isArchived ? handleArchiveList : undefined}
        onDelete={isOwner && !isArchived ? handleDeleteList : undefined}
      />
    </div>
  );
}


