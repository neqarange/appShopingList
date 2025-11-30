import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ItemForm from "../components/Dashboard/Detail/ItemForm";
import ActionButtons from "../components/Dashboard/Detail/ActionButtons";
import { api } from "../api";

export default function DetailPage() {
  const { id } = useParams(); // ID listu z URL
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // načtení seznamu + položek
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

  // přidat položku
  async function handleAdd() {
    const item = await api.addItem(id, "Nová položka", "", 1);
    setItems((prev) => [item, ...prev]);
  }

  // zakoupeno / nezakoupeno
  async function toggleBought(item) {
    const updated = await api.setBought(id, item._id, !item.bought);
    setItems((prev) =>
      prev.map((x) => (x._id === item._id ? updated : x))
    );
  }

  // archivace položky
  async function archiveItem(it) {
    try {
      const updated = await api.archiveItem(id, it._id);
      setItems((prev) =>
        prev.map((x) => (x._id === it._id ? updated : x))
      );
      setSelectedItem(null);
    } catch (e) {
      alert(e.message);
    }
  }

  // uložit změny položky
  async function handleSave(updatedFromForm) {
    try {
      const updated = await api.updateItem(id, updatedFromForm._id, {
        name: updatedFromForm.name,
        description: updatedFromForm.description,
        quantity: updatedFromForm.quantity
      });

      setItems((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
      );

      setSelectedItem(null);
    } catch (e) {
      alert(e.message);
    }
  }

  // smazat list
  async function handleDeleteList() {
    try {
      await api.deleteList(id);
      navigate("/");
    } catch (e) {
      alert(e.message);
    }
  }

  // archivovat list
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
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Zpět
      </button>

      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        {list?.name || "Seznam"}
      </h1>

      {/* Výpis položek */}
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

      {/* Detail položky */}
      {selectedItem && (
        <ItemForm
          item={selectedItem}
          onSave={handleSave}
          onDelete={() => archiveItem(selectedItem)}
        />
      )}

      {/* Tlačítka dole */}
      <ActionButtons
        onSave={handleArchiveList}
        onDelete={handleDeleteList}
        onAdd={handleAdd}
      />
    </div>
  );
}
