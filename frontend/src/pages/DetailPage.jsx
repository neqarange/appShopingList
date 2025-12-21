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

    // okamžitě přepni UI (spolehlivé)
    setItems((prev) =>
      prev.map((x) =>
        x._id === item._id ? { ...x, bought: !x.bought } : x
      )
    );

    // backend
    try {
      await api.setBought(id, item._id, !item.bought);
    } catch (e) {
      // rollback při chybě
      setItems((prev) =>
        prev.map((x) =>
          x._id === item._id ? { ...x, bought: item.bought } : x
        )
      );
      alert(e.message);
    }
  }

  async function archiveItem(item) {
    if (isArchived) return;

    try {
      await api.archiveItem(id, item._id);
      setItems((prev) =>
        prev.map((x) =>
          x._id === item._id ? { ...x, archived: true } : x
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
        prev.map((x) => (x._id === saved._id ? saved : x))
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

      {/* Header */}
      <div className="sticky top-0 bg-gray-100 dark:bg-gray-900 px-6 pt-6 pb-4 shadow z-20">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 dark:text-blue-300 hover:underline"
        >
          ← {t.back}
        </button>

        <h1 className="text-3xl font-bold text-center mt-3">
          {list?.name}
        </h1>

        {isArchived && (
          <p className="text-center text-yellow-500 font-medium mt-2">
            ⚠️ Tento seznam je archivovaný (read-only)
          </p>
        )}
      </div>

      {/* Items */}
      <div className="p-6 space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className={`
              p-4 rounded-2xl flex justify-between items-center
              bg-white dark:bg-gray-800 shadow-sm
              hover:shadow-xl transition
              ${isArchived ? "opacity-60" : ""}
            `}
          >
            {/* Klikací jen název */}
            <button
              type="button"
              disabled={isArchived}
              onClick={() => setSelectedItem(item)}
              className="flex-1 text-left pr-4"
            >
              <span
                className={`text-lg ${
                  item.bought ? "line-through text-gray-400" : ""
                }`}
              >
                {item.name}
              </span>
            </button>

            {/* Checkbox – izolovaný */}
            <input
              type="checkbox"
              checked={!!item.bought}
              disabled={isArchived}
              onChange={() => toggleBought(item)}
              className="w-5 h-5 accent-blue-600"
            />
          </div>
        ))}
      </div>

{/* Detail + graf – center layout */}
<div className="max-w-4xl mx-auto px-6 space-y-10">

  {/* Detail položky */}
  {selectedItem && !isArchived && (
    <ItemForm
      item={selectedItem}
      onSave={handleSave}
      onDelete={() => archiveItem(selectedItem)}
    />
  )}

  {/* Graf */}
  {items.length > 0 && (
    <div className="bg-gray-800/60 rounded-2xl p-6">
      <BoughtItemsChart items={items} />
    </div>
  )}

</div>


      {/* Akce */}
      <ActionButtons
        onAdd={!isArchived ? handleAdd : undefined}
        onSave={isOwner && !isArchived ? handleArchiveList : undefined}
        onDelete={isOwner && !isArchived ? handleDeleteList : undefined}
      />
    </div>
  );
}

