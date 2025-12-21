import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import DeleteItem from "./DeleteItem";
import SaveNewItem from "./SaveNewItem";
import { useLanguage } from "../../../hooks/useLanguage";

export default function ItemForm({ item, onSave, onDelete }) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: item.name || "",
    quantity: item.quantity || 1,
    description: item.description || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => onSave({ ...item, ...formData });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow space-y-4">
      <h3 className="text-lg font-semibold">
        {t.itemDetail}
      </h3>

      <div className="space-y-2">
        <label className="text-sm">{t.name}</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
        />

        <label className="text-sm">{t.description}</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
        />

        <label className="text-sm">{t.quantity}</label>
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

      <div className="flex justify-between pt-2">
        <DeleteItem onClick={onDelete} label={t.deleteItem} />
        <SaveNewItem onClick={handleSave} label={t.saveItem} />
      </div>
    </div>
  );
}

