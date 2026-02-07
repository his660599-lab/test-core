import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: string; // Tailwind text color class like 'text-blue-600'
}

export function StatsCard({ title, value, change, trend, icon: Icon, color = "text-primary" }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold font-display">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace("text-", "bg-")}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${
            trend === "up" ? "text-green-600" : 
            trend === "down" ? "text-red-600" : "text-muted-foreground"
          }`}>
            {change}
          </span>
          <span className="text-muted-foreground ml-2">from last month</span>
        </div>
      )}
    </div>
  );
}
