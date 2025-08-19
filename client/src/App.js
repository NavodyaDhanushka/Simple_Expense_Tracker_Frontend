import { useState } from "react";
import DashboardCard from "./components/DashboardCard";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";

function App() {
    const [expenses, setExpenses] = useState([]);

    const handleAddExpense = (expense) => {
        setExpenses([...expenses, { ...expense, _id: Date.now() }]);
    };

    const handleDeleteExpense = (id) => {
        setExpenses(expenses.filter((e) => e._id !== id));
    };

    const handleEditExpense = (updatedExpense) => {
        setExpenses(
            expenses.map((e) => (e._id === updatedExpense._id ? updatedExpense : e))
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <div className="flex gap-4">
                        <DashboardCard title="Total Expenses" value="$2,450.00" />
                        <DashboardCard title="This Month" value="$890.50" />
                        <DashboardCard title="Total Transactions" value="127" />
                    </div>
                    <ExpenseForm onAdd={handleAddExpense} />
                </div>
                <div className="flex-2">
                    <ExpenseTable
                        expenses={expenses}
                        onEdit={handleEditExpense}
                        onDelete={handleDeleteExpense}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
