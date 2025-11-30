export default function MemberTag({ members }) {
  const cleanMembers = members.filter(Boolean); // odstraní null / ""

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {cleanMembers.map((member, index) => (
        <span
          key={index}
          className={`px-2 py-1 text-sm rounded-full ${
            index === 0 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {member}
        </span>
      ))}
    </div>
  );
}

