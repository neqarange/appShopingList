export default function QuantitySelector({ value, onIncrement, onDecrement }) {
  return (
    <div className="flex items-center space-x-3 mt-2">
      <button
        onClick={onDecrement}
        className="px-3 py-1 bg-gray-200 dark:bg-gray-600 dark:text-gray-100 rounded-lg text-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500"
      >
        -
      </button>
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {value}
      </span>
      <button
        onClick={onIncrement}
        className="px-3 py-1 bg-gray-200 dark:bg-gray-600 dark:text-gray-100 rounded-lg text-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500"
      >
        +
      </button>
    </div>
  );
}
