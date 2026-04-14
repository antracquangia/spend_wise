import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Expense, Currency } from "@/src/types";
import { Trash2, Pencil, Utensils, Car, Film, ShoppingBag, HeartPulse, Receipt, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/src/lib/currency";

const ICONS: Record<string, React.ReactNode> = {
  Food: <Utensils className="h-4 w-4" />,
  Transport: <Car className="h-4 w-4" />,
  Entertainment: <Film className="h-4 w-4" />,
  Shopping: <ShoppingBag className="h-4 w-4" />,
  Health: <HeartPulse className="h-4 w-4" />,
  Bills: <Receipt className="h-4 w-4" />,
  Other: <MoreHorizontal className="h-4 w-4" />,
};

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  currency: Currency;
}

export function ExpenseList({ expenses, onDelete, onEdit, currency }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-xl bg-card">
        No expenses recorded yet.
      </div>
    );
  }

  return (
    <div className="border rounded-xl bg-card text-card-foreground overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">
                  {format(new Date(expense.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {ICONS[expense.category]}
                    <span>{expense.category}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(expense.amount, currency)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(expense)}
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(expense.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
