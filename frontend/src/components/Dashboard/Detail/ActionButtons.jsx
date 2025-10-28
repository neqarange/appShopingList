export default function ActionButtons({ onAdd, onDelete, onSave }) {
  return (
    <div className="flex justify-around mt-8">
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        ➕ Přidat položku
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        💾 Uložit seznam
      </button>
      <button
        onClick={onDelete}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        🗑️ Smazat seznam
      </button>
    </div>
  );
}
