import React, { useState, useId } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, Expense, Currency } from "@/src/types";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface ExpenseFormProps {
  onAdd?: (expense: Omit<Expense, "id">) => void;
  onUpdate?: (expense: Expense) => void;
  initialData?: Expense;
  onCancel?: () => void;
  currency?: Currency;
}

export function ExpenseForm({ onAdd, onUpdate, initialData, onCancel, currency = "USD" }: ExpenseFormProps) {
  const [amount, setAmount] = useState(initialData?.amount.toString() || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState<string>(initialData?.category || CATEGORIES[0]);
  const [date, setDate] = useState<Date>(initialData ? new Date(initialData.date) : new Date());
  
  const descriptionId = useId();
  const amountId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    if (initialData && onUpdate) {
      onUpdate({
        ...initialData,
        amount: parseFloat(amount),
        description,
        category,
        date: date.toISOString(),
      });
    } else if (onAdd) {
      onAdd({
        amount: parseFloat(amount),
        description,
        category,
        date: date.toISOString(),
      });

      setAmount("");
      setDescription("");
      setCategory(CATEGORIES[0]);
      setDate(new Date());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4 p-4 border rounded-xl bg-card text-card-foreground", initialData && "border-none p-0")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={descriptionId}>Description</Label>
          <Input
            id={descriptionId}
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={amountId}>Amount ({currency === "USD" ? "$" : "₫"})</Label>
          <Input
            id={amountId}
            type="number"
            step={currency === "USD" ? "0.01" : "1"}
            placeholder={currency === "USD" ? "0.00" : "0"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1">
          {initialData ? (
            <>Save Changes</>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
