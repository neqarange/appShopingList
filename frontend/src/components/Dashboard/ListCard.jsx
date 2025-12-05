import ListItem from "./ListItem";
import MemberTag from "./MemberTag";

export default function ListCard({ title, members, archived, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm cursor-pointer transition 
        hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
        ${archived ? "opacity-60" : ""}`}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </h2>
      </div>

      <div className="flex gap-2 flex-wrap">
        {members.map((m, i) => (
          <span
            key={i}
            className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}


