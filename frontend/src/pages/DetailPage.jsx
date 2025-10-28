import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { shoppingLists } from "../data/shoppingLists";
import ItemForm from "../components/Dashboard/Detail/ItemForm";
import ActionButtons from "../components/Dashboard/Detail/ActionButtons";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const list = shoppingLists.find((l) => l.id === Number(id));
  const [items, setItems] = useState(list ? list.items : []);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSave = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.name === updatedItem.name ? updatedItem : item
      )
    );
    setSelectedItem(null);
  };

  const handleDelete = (name) => {
    setItems((prev) => prev.filter((item) => item.name !== name));
    setSelectedItem(null);
  };

  const handleAdd = () => {
    const newItem = { name: "Nová položka", isChecked: false };
    setItems((prev) => [...prev, newItem]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Zpět
      </button>

      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        {list?.title || "Neznámý seznam"}
      </h1>

      <div className="space-y-2 mb-8">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedItem(item)}
            className="p-3 bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer flex justify-between items-center"
          >
            <span
              className={`${
                item.isChecked ? "line-through text-gray-400" : ""
              }`}
            >
              {item.name}
            </span>
            <input
              type="checkbox"
              checked={item.isChecked}
              readOnly
              className="w-4 h-4 accent-blue-600"
            />
          </div>
        ))}
      </div>

      {selectedItem && (
        <ItemForm
          item={selectedItem}
          onSave={handleSave}
          onDelete={() => handleDelete(selectedItem.name)}
        />
      )}

      <ActionButtons
        onSave={() => alert("Změny uloženy!")}
        onDelete={() => alert("Seznam smazán!")}
        onAdd={handleAdd}
      />
    </div>
  );
}
