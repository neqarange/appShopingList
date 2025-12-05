import { useLanguage } from "../../../hooks/useLanguage";

export default function ActionButtons({ onAdd, onSave, onDelete }) {
  const { t } = useLanguage();

  return (
    <div className="flex justify-center gap-10 mt-8">

      {/* ADD ITEM */}
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          ➕ {t.addItem}
        </button>
      )}

      {/* SAVE LIST */}
      {onSave && (
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          💾 {t.saveList}
        </button>
      )}

      {/* DELETE LIST */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
        >
          🗑️ {t.deleteList}
        </button>
      )}
    </div>
  );
}
