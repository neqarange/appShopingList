export default function DeleteItem({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
    >
      🗑️ Smazat
    </button>
  );
}
