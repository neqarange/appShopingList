export default function QuantitySelector({ value, onIncrement, onDecrement }) {
  return (
    <div className="flex items-center space-x-3 mt-2">
      <button
        onClick={onDecrement}
        className="px-3 py-1 bg-gray-200 rounded-lg text-lg font-semibold hover:bg-gray-300"
      >
        -
      </button>
      <span className="font-medium">{value}</span>
      <button
        onClick={onIncrement}
        className="px-3 py-1 bg-gray-200 rounded-lg text-lg font-semibold hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
}
