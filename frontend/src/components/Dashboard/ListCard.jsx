export default function ListCard({ title, members, archived, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        p-4 sm:p-5
        bg-white dark:bg-gray-800
        rounded-2xl shadow-sm
        cursor-pointer transition
        hover:shadow-xl hover:scale-[1.02]
        active:scale-[0.98]
        ${archived ? "opacity-60" : ""}
      `}
    >
      <h2 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white truncate mb-3">
        {title}
      </h2>

      <div className="flex flex-wrap gap-2">
        {members.map((m, i) => (
          <span
            key={i}
            className="
              px-2 py-1
              text-xs sm:text-sm
              rounded-full
              bg-blue-100 dark:bg-blue-700
              text-blue-800 dark:text-white
              max-w-full truncate
            "
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}



