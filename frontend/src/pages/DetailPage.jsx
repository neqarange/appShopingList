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
    const item = await api.addItem(id, "New item", "", 1);
    setItems((prev) => [item, ...prev]);
  }

  async function toggleBought(item) {
    const updated = await api.setBought(id, item._id, !item.bought);
    setItems((prev) => prev.map((x) => (x._id === item._id ? updated : x)));
  }

  async function archiveItem(it) {
    try {
      await api.archiveItem(id, it._id);
      setItems((prev) => prev.map((x) => (x._id === it._id ? { ...x, archived: true } : x)));
      setSelectedItem(null);
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleSave(updated) {
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

  async function handleSaveList() {
    alert("Saving list is not implemented yet");
  }

  async function handleDeleteList() {
    try {
      await api.deleteList(id);
      navigate("/");
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleArchiveList() {
    try {
      await api.archiveList(id);
      alert("List archived");
      navigate("/");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100">

      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 dark:text-blue-300 hover:underline mb-4"
      >
        ← {t.back}
      </button>

      <h1 className="text-2xl font-bold mb-6 text-center">
        {list?.name || ""}
      </h1>

      {/* Výpis položek */}
      <div className="space-y-2 mb-8">
        {items.map((item) => (
          <div
            key={item._id}
            onClick={() => setSelectedItem(item)}
            className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition cursor-pointer flex justify-between items-center"
          >
            <span className={`${item.bought ? "line-through text-gray-400" : "dark:text-white"}`}>
              {item.name}
            </span>

            <input
              type="checkbox"
              checked={!!item.bought}
              onChange={() => toggleBought(item)}
              className="w-4 h-4 accent-blue-600"
            />
          </div>
        ))}
      </div>

      {selectedItem && (
        <ItemForm
          item={selectedItem}
          onSave={handleSave}
          onDelete={() => archiveItem(selectedItem)}
        />
      )}

      <ActionButtons
        onAdd={handleAdd}
        onSave={isOwner ? handleArchiveList : undefined}
        onDelete={isOwner ? handleDeleteList : undefined}
      />
    </div>
  );
}

