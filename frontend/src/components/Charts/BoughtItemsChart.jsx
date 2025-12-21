import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useLanguage } from "../../hooks/useLanguage";

export default function BoughtItemsChart({ items }) {
  const { t } = useLanguage();

  const bought = items.filter((i) => i.bought).length;
  const notBought = items.length - bought;

  const data = [
    { name: t.bought, value: bought },
    { name: t.notBought, value: notBought },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
        {t.purchaseStatus}
      </h3>

      {/* RESPONSIVE GRAPH */}
      <div className="w-full h-[220px] sm:h-[260px] pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="flex gap-6 mt-4 text-xs sm:text-sm">
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




