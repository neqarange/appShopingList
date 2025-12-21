import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ItemForm from "../components/Dashboard/Detail/ItemForm";
import ActionButtons from "../components/Dashboard/Detail/ActionButtons";
import BoughtItemsChart from "../components/Charts/BoughtItemsChart";
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

  useEffect(() => {
    loadData();
  }, [id]);

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

  async function handleAdd() {
    if (isArchived) return;
    const item = await api.addItem(id, "New item", "", 1);
    setItems((prev) => [item, ...prev]);
  }

  async function toggleBought(item) {
    if (isArchived) return;

    setItems((prev) =>
      prev.map((x) =>
        x._id === item._id ? { ...x, bought: !x.bought } : x
      )
    );

    try {
      await api.setBought(id, item._id, !item.bought);
    } catch (e) {
      setItems((prev) =>
        prev.map((x) =>
          x._id === item._id ? { ...x, bought: item.bought } : x
        )
      );
      alert(e.message);
    }
  }

  async function handleSave(updated) {
    if (isArchived) return;

    const saved = await api.updateItem(id, updated._id, updated);
    setItems((prev) =>
      prev.map((x) => (x._id === saved._id ? saved : x))
    );
    setSelectedItem(null);
  }

  async function archiveItem(item) {
    if (isArchived) return;
    await api.archiveItem(id, item._id);
    setItems((prev) =>
      prev.map((x) =>
        x._id === item._id ? { ...x, archived: true } : x
      )
    );
    setSelectedItem(null);
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

      {/* TOP BAR */}
      <div className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 py-4 shadow">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 dark:text-blue-300 text-sm hover:underline"
        >
          ← {t.back}
        </button>

        <h1 className="text-xl sm:text-3xl font-bold text-center mt-2">
          {list?.name}
        </h1>

        {isArchived && (
          <p className="text-center text-yellow-500 text-sm mt-1">
            ⚠️ Read only
          </p>
        )}
      </div>

      {/* ITEMS */}
      <div className="px-4 sm:px-6 py-6 space-y-3">
        {items.map((item) => (
          <div
            key={item._id}
            className={`
              flex items-center justify-between gap-3
              p-3 sm:p-4 rounded-xl
              bg-white dark:bg-gray-800
              shadow-sm
              ${isArchived ? "opacity-60" : ""}
            `}
          >
            <button
              disabled={isArchived}
              onClick={() => setSelectedItem(item)}
              className="flex-1 text-left text-sm sm:text-lg"
            >
              <span
                className={
                  item.bought
                    ? "line-through text-gray-400"
                    : ""
                }
              >
                {item.name}
              </span>
            </button>

            <input
              type="checkbox"
              checked={!!item.bought}
              disabled={isArchived}
              onChange={() => toggleBought(item)}
              className="w-4 h-4 sm:w-5 sm:h-5 accent-blue-600"
            />
          </div>
        ))}
      </div>

      {/* DETAIL + CHART */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {selectedItem && !isArchived && (
          <ItemForm
            item={selectedItem}
            onSave={handleSave}
            onDelete={() => archiveItem(selectedItem)}
          />
        )}

        {items.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6">
            <BoughtItemsChart items={items} />
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <ActionButtons
        onAdd={!isArchived ? handleAdd : undefined}
        onSave={isOwner && !isArchived ? handleArchiveList : undefined}
        onDelete={isOwner && !isArchived ? handleDeleteList : undefined}
      />
    </div>
  );
}


