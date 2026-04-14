import * as XLSX from 'xlsx-js-style';
import { Expense, Income } from '../types';
import { format } from 'date-fns';

export function exportToExcel(expenses: Expense[], incomes: Income[] = []) {
  // Combine and sort all transactions by date ascending
  const allTransactions = [
    ...expenses.map(e => ({ ...e, type: 'expense' as const })),
    ...incomes.map(i => ({ ...i, type: 'income' as const, category: '-' }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let currentBalance = 0;
  
  const combinedData = allTransactions.map(t => {
    if (t.type === 'income') {
      currentBalance += t.amount;
      return {
        Date: format(new Date(t.date), 'yyyy-MM-dd'),
        Description: t.description,
        Category: '-',
        Income: t.amount,
        Expense: 0,
        Remaining: currentBalance
      };
    } else {
      currentBalance -= t.amount;
      return {
        Date: format(new Date(t.date), 'yyyy-MM-dd'),
        Description: t.description,
        Category: t.category,
        Income: 0,
        Expense: t.amount,
        Remaining: currentBalance
      };
    }
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(combinedData);

  // Apply styling (full borders and bold header)
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:F1');
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;
      
      worksheet[cellAddress].s = {
        border: {
          top: { style: "thin", color: { auto: 1 } },
          bottom: { style: "thin", color: { auto: 1 } },
          left: { style: "thin", color: { auto: 1 } },
          right: { style: "thin", color: { auto: 1 } }
        },
        font: R === 0 ? { bold: true } : {}
      };
    }
  }

  // Set column widths
  worksheet['!cols'] = [
    { wch: 12 }, // Date
    { wch: 30 }, // Description
    { wch: 15 }, // Category
    { wch: 12 }, // Income
    { wch: 12 }, // Expense
    { wch: 15 }  // Remaining
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
  
  // Generate buffer and download
  XLSX.writeFile(workbook, `SpendWise_Data_${format(new Date(), 'yyyyMMdd')}.xlsx`);
}
