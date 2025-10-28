import ListItem from "./ListItem";
import MemberTag from "./MemberTag";

export default function ListCard({ title, members, items, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <MemberTag members={members} />
      <div className="mt-3 space-y-1">
        {items.map((item, index) => (
          <ListItem key={index} name={item.name} isChecked={item.isChecked} />
        ))}
      </div>
    </div>
  );
}
