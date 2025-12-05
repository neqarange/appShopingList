import ListItem from "./ListItem";
import MemberTag from "./MemberTag";

export default function ListCard({ title, members, items, onClick, archived }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl shadow bg-white dark:bg-gray-800 cursor-pointer transition 
        ${archived ? "opacity-50 hover:opacity-70" : "hover:shadow-md"}`}
    >
      <h2 className="text-xl font-semibold dark:text-white">
        {title}
      </h2>

      <div className="flex gap-2 mt-2 flex-wrap">
        {members.map((m, i) => (
          <span
            key={i}
            className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-white rounded"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

