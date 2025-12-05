export default function ListItem({ name, isChecked }) {
  return (
    <div className="flex items-center justify-between py-1">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isChecked}
          readOnly
          className="w-4 h-4 accent-blue-600"
        />
        <span
          className={`${
            isChecked
              ? "line-through text-gray-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {name}
        </span>
      </label>
    </div>
  );
}
