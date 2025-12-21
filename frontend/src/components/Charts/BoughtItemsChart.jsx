import { PieChart, Pie, Cell } from "recharts";
import { useLanguage } from "../../hooks/useLanguage";

export default function BoughtItemsChart({ items }) {
  const { t } = useLanguage();

  const bought = items.filter((item) => item.bought).length;
  const notBought = items.length - bought;

  const data = [
    { name: t.bought, value: bought },
    { name: t.notBought, value: notBought },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-center">
        {t.purchaseStatus}
      </h3>

      <div className="pointer-events-none">
        <PieChart width={260} height={220}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </div>

      <div className="flex gap-6 mt-4 text-sm">
        <span className="text-green-400">
          ● {t.bought} ({bought})
        </span>
        <span className="text-red-400">
          ● {t.notBought} ({notBought})
        </span>
      </div>
    </div>
  );
}



