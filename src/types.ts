export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
}

export interface Income {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO string
}

export type Category = 
  | "Food"
  | "Transport"
  | "Entertainment"
  | "Shopping"
  | "Health"
  | "Bills"
  | "Other";

export type Currency = "USD" | "VND";

export const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Health",
  "Bills",
  "Other"
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#FF6B6B", // Vibrant Red/Coral
  Transport: "#4ECDC4", // Teal/Cyan
  Entertainment: "#FFD93D", // Yellow
  Shopping: "#9D4EDD", // Purple
  Health: "#2ECC71", // Green
  Bills: "#3498DB", // Blue
  Other: "#95A5A6", // Gray
};
