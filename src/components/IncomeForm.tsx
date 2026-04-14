import React, { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Income, Currency } from "@/src/types";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface IncomeFormProps {
  onAdd: (income: Omit<Income, "id">) => void;
  currency?: Currency;
}

export function IncomeForm({ onAdd, currency = "USD" }: IncomeFormProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  
  const descriptionId = useId();
  const amountId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      amount: parseFloat(amount),
      description,
      date: date.toISOString(),
    });

    setAmount("");
    setDescription("");
    setDate(new Date());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl bg-card text-card-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={descriptionId}>Source / Description</Label>
          <Input
            id={descriptionId}
            placeholder="Salary, Freelance, etc."
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

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
        <Plus className="mr-2 h-4 w-4" /> Add Income
      </Button>
    </form>
  );
}
