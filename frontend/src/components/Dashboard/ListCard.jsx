import ListItem from "./ListItem";
import MemberTag from "./MemberTag";

export default function ListCard({ title, members, items, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        p-4 
        bg-white dark:bg-gray-800 
        rounded-2xl 
        shadow hover:shadow-lg 
        cursor-pointer transition
      "
    >
      {/* Název seznamu */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>

      {/* Tagy uživatelů */}
      <MemberTag members={members} />

      {/* Náhled položek (prázdné zatím, protože backend to neposílá) */}
      <div className="mt-3 space-y-1">
        {items.slice(0, 3).map((item, index) => (
          <ListItem
            key={index}
            name={item.name}
            isChecked={item.isChecked}
          />
        ))}
      </div>
    </div>
  );
}
