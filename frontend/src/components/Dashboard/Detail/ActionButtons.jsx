import { useLanguage } from "../../../hooks/useLanguage";

export default function ActionButtons({ onAdd, onSave, onDelete }) {
  const { t } = useLanguage();

  return (
    <div
      className="
        sticky bottom-0 z-10
        bg-gray-100 dark:bg-gray-900
        px-4 py-4
        flex flex-wrap justify-center gap-3
      "
    >
      {onAdd && (
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm sm:text-base"
        >
          ➕ {t.addItem}
        </button>
      )}

      {onSave && (
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base"
        >
          💾 {t.saveList}
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm sm:text-base"
        >
          🗑️ {t.deleteList}
        </button>
      )}
    </div>
  );
}
