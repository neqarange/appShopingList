import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ItemForm from "../components/Dashboard/Detail/ItemForm";
import ActionButtons from "../components/Dashboard/Detail/ActionButtons";
import { api } from "../api";

export default function DetailPage() {
  const { id } = useParams(); // Mongo _id seznamu
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // načti přehled, najdi aktuální list (kvůli ownerovi a názvu)
    api.getLists().then(ls => setList(ls.find(l => l._id === id) || null)).catch(console.error);
    api.getItems(id).then(setItems).catch(console.error);
  }, [id]);

  const isOwner = useMemo(() => {
    if (!list) return false;
    // backend vrací owner jako ObjectId/string – kontrola: je uživatel = owner? (Zjednodušeně: pokud je list ve /api/lists vrácen, UI vypíše tlačítka a back-end stejně práva ohlídá)
    return true; // UI umožní akci, ale server vynutí práva (403) pokud nejsi owner
  }, [list]);

  async function handleAdd() {
    const item = await api.addItem(id, "Nová položka");
    setItems(prev => [item, ...prev]);
  }

  async function toggleBought(item) {
    const updated = await api.setBought(id, item._id, !item.bought);
    setItems(prev => prev.map(x => x._id === item._id ? updated : x));
  }

  async function archiveItem(it) {
    try {
      const updated = await api.archiveItem(id, it._id);
      setItems(prev => prev.map(x => x._id === it._id ? updated : x));
      setSelectedItem(null);
    } catch (e) {
      alert(e.message);
    }
  }

  function handleSave(updatedFromForm) {
    // Backend nemá endpoint na přejmenování položky/poznámku/quantity (MVP).
    // Zachováme lokálně název – volitelně by se dal přidat PUT endpoint.
    setItems(prev =>
      prev.map((item) => item._id === selectedItem._id
        ? { ...item, name: updatedFromForm.name }
        : item
      )
    );
    setSelectedItem(null);
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
      const updated = await api.archiveList(id);
      setList(updated);
      alert("Seznam archivován");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">
        ← Zpět
      </button>

      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        {list?.name || "Seznam"}
      </h1>

      <div className="space-y-2 mb-8">
        {items.map((item) => (
          <div
            key={item._id}
            onClick={() => setSelectedItem(item)}
            className="p-3 bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer flex justify-between items-center"
          >
            <span className={`${item.bought ? "line-through text-gray-400" : ""}`}>
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
          item={{ ...selectedItem, isChecked: selectedItem.bought }}
          onSave={handleSave}
          onDelete={() => archiveItem(selectedItem)}
        />
      )}

      <ActionButtons
        onSave={handleArchiveList}     // použijeme jako „Archivovat seznam“ (owner rozhodne backend)
        onDelete={handleDeleteList}    // smazání seznamu
        onAdd={handleAdd}              // přidání položky
      />
    </div>
  );
}
