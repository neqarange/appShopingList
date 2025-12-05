import { useLanguage } from "../../../hooks/useLanguage";

export default function DeleteItem({ onClick }) {
  const { t } = useLanguage();

  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition flex items-center gap-2"
    >
      🗑️ {t.deleteItem}
    </button>
  );
}

