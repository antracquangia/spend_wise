import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense, CATEGORY_COLORS, Currency } from "@/src/types";
import { format, startOfDay, eachDayOfInterval, differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { formatCurrency } from "@/src/lib/currency";

interface ExpenseChartsProps {
  expenses: Expense[];
  dateRange?: DateRange;
  currency: Currency;
}

export function ExpenseCharts({ expenses, dateRange, currency }: ExpenseChartsProps) {
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach((e) => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const dailyData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];

    const start = startOfDay(dateRange.from);
    const end = startOfDay(dateRange.to);
    
    // If range is too large, maybe group by month or week, but for now let's just limit to 60 days for performance
    const daysDiff = differenceInDays(end, start);
    if (daysDiff > 60) {
      // Fallback to last 30 days if range is too large
      const interval = eachDayOfInterval({ start: startOfDay(new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000)), end });
      return interval.map((day) => {
        const dayStart = startOfDay(day);
        const total = expenses
          .filter((e) => startOfDay(new Date(e.date)).getTime() === dayStart.getTime())
          .reduce((sum, e) => sum + e.amount, 0);
        return { date: format(day, "MMM d"), amount: total };
      });
    }

    const interval = eachDayOfInterval({ start, end });

    return interval.map((day) => {
      const dayStart = startOfDay(day);
      const total = expenses
        .filter((e) => startOfDay(new Date(e.date)).getTime() === dayStart.getTime())
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        date: format(day, "MMM d"),
        amount: total,
      };
    });
  }, [expenses, dateRange]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-xl text-card-foreground">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || "hsl(var(--primary))"} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => formatCurrency(value, currency)}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-xl text-card-foreground">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Daily Spending Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                tickFormatter={(value) => formatCurrency(value, currency)}
              />
              <Tooltip 
                cursor={{ fill: "hsl(var(--muted)/0.5)" }}
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => formatCurrency(value, currency)}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
