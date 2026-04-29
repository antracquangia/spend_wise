# SpendWise - Personal Finance Tracker

## 🌟 Key Features

- **Dashboard Overview**: Get a quick, real-time summary of your finances, including Total Income, Total Spent, and Remaining Balance.
- **Expense & Income Management**: Easily add, edit, and delete transaction records with details like description, amount, category, and date.
- **Multi-Currency Support**: Seamlessly switch between US Dollar (USD) and Vietnamese Dong (VND) with automatic number and symbol formatting.
- **Visual Analytics**:
  - **Spending by Category**: An interactive Pie chart that breaks down expenses by categories using distinct, vibrant colors.
  - **Daily Spending Trend**: A Bar chart showing spending patterns across different days.
- **Date Filtering**: Filter your transactions and analytics views by a specific date range using a specialized Date picker.
- **Excel Export (`.xlsx`)**: Export all your financial data into a beautifully formatted Excel ledger. The exported file includes merged views of incomes and expenses, running balances, and full table border styling.
- **Local Persistence**: Automatically saves your financial data in the browser's `localStorage` so you never lose your records when refreshing the page.

## 🛠️ Technologies & Libraries Used

### **Core Stack**
- **React 18**: The core frontend JavaScript library used for building the user interface.
- **TypeScript**: Used for strict typing, making the codebase more robust and bug-free.
- **Vite**: A lightning-fast modern frontend build tool.

### **Styling & UI Components**
- **Tailwind CSS**: A utility-first CSS framework used for responsive, scalable, and modern styling.
- **shadcn/ui**: A collection of beautifully designed, accessible UI components (Cards, Tables, Inputs, Dialogs, Selects) built with Radix UI and Tailwind.
- **Lucide React**: A clean, consistent, and customizable SVG icon library.

### **Data Visualization & Logic**
- **Recharts**: A composable mapping and chart library built on React components, used for rendering the Pie and Bar analytics charts.
- **xlsx-js-style**: A powerful library used to generate Excel files on the client side, allowing for custom styling like bold headers and cell borders.
- **date-fns**: A modern JavaScript date utility library used for formatting, parsing, and manipulating dates.
- **react-day-picker**: Used for the date range filtering component.

### **Animations & UX**
- **Framer Motion (`motion/react`)**: Used for smooth page transitions, element entrance animations, and interactive feedback.
- **Sonner**: An elegant toast notification library to provide instant feedback for user actions (e.g., successful exports, currency switches).
