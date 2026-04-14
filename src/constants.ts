import { Category } from "./types";

export const APP_NAME = "SpendWise";
export const STORAGE_KEY = "spendwise_expenses";
export const INCOME_STORAGE_KEY = "spendwise_incomes";

export const CATEGORY_ICONS: Record<Category, string> = {
  Food: "Utensils",
  Transport: "Car",
  Entertainment: "Film",
  Shopping: "ShoppingBag",
  Health: "HeartPulse",
  Bills: "Receipt",
  Other: "MoreHorizontal"
};
