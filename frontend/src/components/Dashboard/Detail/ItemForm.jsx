import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import DeleteItem from "./DeleteItem";
import SaveNewItem from "./SaveNewItem";

export default function ItemForm({ item, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    name: item.name || "",
    quantity: item.quantity || 1,
    description: item.description || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave({ ...item, ...formData });
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Detail položky</h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Název</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />

        <label className="block text-sm font-medium">Popis</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />

        <QuantitySelector
          value={formData.quantity}
          onIncrement={() =>
            setFormData({ ...formData, quantity: formData.quantity + 1 })
          }
          onDecrement={() =>
            setFormData({
              ...formData,
              quantity: Math.max(1, formData.quantity - 1),
            })
          }
        />
      </div>

      <div className="flex justify-between">
        <DeleteItem onClick={onDelete} />
        <SaveNewItem onClick={handleSave} />
      </div>
    </div>
  );
}
