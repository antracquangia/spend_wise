/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { ExpenseForm } from "./components/ExpenseForm";
import { IncomeForm } from "./components/IncomeForm";
import { ExpenseList } from "./components/ExpenseList";
import { ExpenseCharts } from "./components/ExpenseCharts";
import { DateRangePicker } from "./components/DateRangePicker";
import { Expense, Income, Currency } from "./types";
import { STORAGE_KEY, INCOME_STORAGE_KEY } from "./constants";
import { exportToExcel } from "./lib/export";
import { formatCurrency } from "./lib/currency";
import { Button } from "@/components/ui/button";
import { Download, Wallet, TrendingUp, Calendar as CalendarIcon, ArrowDownCircle, ArrowUpCircle, Filter, DollarSign, Coins } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { subDays, isWithinInterval, startOfDay, endOfDay, format } from "date-fns";
import { cn } from "@/lib/utils";

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  
  // Date Range State
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Load from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem(STORAGE_KEY);
    const savedIncomes = localStorage.getItem(INCOME_STORAGE_KEY);
    const savedCurrency = localStorage.getItem("spendwise_currency") as Currency;
    
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        console.error("Failed to parse expenses", e);
      }
    }
    
    if (savedIncomes) {
      try {
        setIncomes(JSON.parse(savedIncomes));
      } catch (e) {
        console.error("Failed to parse incomes", e);
      }
    }

    if (savedCurrency === "USD" || savedCurrency === "VND") {
      setCurrency(savedCurrency);
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      localStorage.setItem(INCOME_STORAGE_KEY, JSON.stringify(incomes));
      localStorage.setItem("spendwise_currency", currency);
    }
  }, [expenses, incomes, currency, isLoaded]);

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
    };
    setExpenses((prev) => [expense, ...prev]);
    toast.success("Expense added successfully!");
  };

  const handleAddIncome = (newIncome: Omit<Income, "id">) => {
    const income: Income = {
      ...newIncome,
      id: crypto.randomUUID(),
    };
    setIncomes((prev) => [income, ...prev]);
    toast.success("Income added successfully!");
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses((prev) => prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)));
    setEditingExpense(null);
    toast.success("Expense updated successfully!");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast.info("Expense removed.");
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((i) => i.id !== id));
    toast.info("Income removed.");
  };

  const handleExport = () => {
    if (expenses.length === 0 && incomes.length === 0) {
      toast.error("No data to export.");
      return;
    }
    exportToExcel(expenses, incomes);
    toast.success("Exporting data to Excel...");
  };

  const toggleCurrency = () => {
    const newCurrency = currency === "USD" ? "VND" : "USD";
    setCurrency(newCurrency);
    toast.success(`Currency changed to ${newCurrency === "USD" ? "US Dollar" : "Vietnamese Dong"}`);
  };

  // Filtered Data
  const filteredExpenses = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return expenses;
    return expenses.filter((e) => {
      const date = new Date(e.date);
      return isWithinInterval(date, {
        start: startOfDay(dateRange.from!),
        end: endOfDay(dateRange.to!),
      });
    });
  }, [expenses, dateRange]);

  const filteredIncomes = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return incomes;
    return incomes.filter((i) => {
      const date = new Date(i.date);
      return isWithinInterval(date, {
        start: startOfDay(dateRange.from!),
        end: endOfDay(dateRange.to!),
      });
    });
  }, [incomes, dateRange]);

  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const totalIncome = useMemo(() => {
    return filteredIncomes.reduce((sum, i) => sum + i.amount, 0);
  }, [filteredIncomes]);

  const remainingBalance = totalIncome - totalSpent;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <Wallet className="h-10 w-10 text-primary" />
              SpendWise
            </h1>
            <p className="text-muted-foreground text-lg">Track your spending and income with precision.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <Button 
              onClick={toggleCurrency} 
              variant="outline" 
              className="rounded-xl h-11 px-4 border-primary/20 hover:bg-primary/5"
            >
              {currency === "USD" ? (
                <><Coins className="mr-2 h-4 w-4 text-primary" /> Switch to VND</>
              ) : (
                <><DollarSign className="mr-2 h-4 w-4 text-primary" /> Switch to USD</>
              )}
            </Button>
            <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border">
              <Filter className="h-4 w-4 ml-2 text-muted-foreground" />
              <DateRangePicker date={dateRange} setDate={setDateRange} />
            </div>
            <Button onClick={handleExport} variant="outline" className="rounded-xl h-11 px-6">
              <Download className="mr-2 h-4 w-4" /> Export Excel
            </Button>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-card text-card-foreground border shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Income</span>
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-3xl font-mono font-bold text-green-600">{formatCurrency(totalIncome, currency)}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-card text-card-foreground border shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Spent</span>
              <ArrowDownCircle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-3xl font-mono font-bold text-destructive">{formatCurrency(totalSpent, currency)}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "p-6 rounded-2xl border shadow-sm space-y-2",
              remainingBalance >= 0 ? "bg-card text-card-foreground" : "bg-destructive/5 text-destructive border-destructive/20"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Remaining</span>
              <TrendingUp className={cn("h-4 w-4", remainingBalance >= 0 ? "text-primary" : "text-destructive")} />
            </div>
            <p className={cn(
              "text-3xl font-mono font-bold",
              remainingBalance >= 0 ? "text-foreground" : "text-destructive"
            )}>
              {formatCurrency(remainingBalance, currency)}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-primary text-primary-foreground shadow-lg space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium opacity-80 uppercase tracking-wider">Transactions</span>
              <Wallet className="h-4 w-4 opacity-80" />
            </div>
            <p className="text-3xl font-mono font-bold">{filteredExpenses.length + filteredIncomes.length}</p>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="overview" className="rounded-lg px-6">Overview</TabsTrigger>
              <TabsTrigger value="transactions" className="rounded-lg px-6">Transactions</TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" key="overview" className="space-y-8 outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 gap-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <section className="space-y-4">
                    <h2 className="text-xl font-semibold px-1">Add New Expense</h2>
                    <ExpenseForm onAdd={handleAddExpense} currency={currency} />
                  </section>
                  
                  <section className="space-y-4">
                    <h2 className="text-xl font-semibold px-1 text-green-600">Add New Income</h2>
                    <IncomeForm onAdd={handleAddIncome} currency={currency} />
                  </section>
                </div>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold px-1">Analytics</h2>
                  <ExpenseCharts expenses={filteredExpenses} dateRange={dateRange} currency={currency} />
                </section>
              </motion.div>
            </TabsContent>

            <TabsContent value="transactions" key="transactions" className="outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold px-1">Recent Expenses</h2>
                  <ExpenseList 
                    expenses={filteredExpenses} 
                    onDelete={handleDeleteExpense} 
                    onEdit={setEditingExpense}
                    currency={currency}
                  />
                </section>

                {filteredIncomes.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-xl font-semibold px-1 text-green-600">Recent Incomes</h2>
                    <div className="border rounded-xl bg-card text-card-foreground overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-bottom">
                          <tr>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Source</th>
                            <th className="text-right p-4">Amount</th>
                            <th className="w-[50px] p-4"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredIncomes
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((income) => (
                              <tr key={income.id} className="border-t hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-medium">{format(new Date(income.date), "MMM d, yyyy")}</td>
                                <td className="p-4">{income.description}</td>
                                <td className="p-4 text-right font-mono text-green-600">+{formatCurrency(income.amount, currency)}</td>
                                <td className="p-4">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteIncome(income.id)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <ArrowDownCircle className="h-4 w-4 rotate-180" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

      <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <div className="mt-4">
              <ExpenseForm 
                initialData={editingExpense} 
                onUpdate={handleUpdateExpense} 
                onCancel={() => setEditingExpense(null)}
                currency={currency}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Toaster position="top-center" />
    </div>
  );
}

