import { useLanguage } from "../../../hooks/useLanguage";

export default function SaveNewItem({ onClick }) {
  const { t } = useLanguage();

  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
    >
      💾 {t.saveItem}
    </button>
  );
}
