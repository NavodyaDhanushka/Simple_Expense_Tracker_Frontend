import { useState, useEffect } from "react";

const ExpenseTable = () => {
    const [expenses, setExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);
    const [editData, setEditData] = useState({
        title: "",
        amount: "",
        category: "",
        description: "",
        date: "",
    });
    const [searchTerm, setSearchTerm] = useState("");

    const fetchExpenses = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/expenses");
            const data = await res.json();
            setExpenses(data);
        } catch (err) {
            console.error("Error fetching expenses:", err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleEdit = (expense) => {
        setEditingExpense(expense._id);
        setEditData({
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            description: expense.description || "",
            date: expense.date.slice(0, 10),
        });
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(
                `http://localhost:5000/api/expenses/${editingExpense}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...editData,
                        amount: Number(editData.amount),
                        date: new Date(editData.date).toISOString(),
                    }),
                }
            );
            if (!res.ok) throw new Error("Failed to update expense");
            await fetchExpenses();
            setEditingExpense(null);
        } catch (err) {
            console.error(err);
            alert("Error updating expense");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete expense");
            setExpenses(expenses.filter((exp) => exp._id !== id));
        } catch (err) {
            console.error(err);
            alert("Error deleting expense");
        }
    };

    const filteredExpenses = expenses.filter(
        (exp) =>
            exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exp.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by title, category, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full bg-white divide-y divide-gray-200">
                    <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {filteredExpenses.map((exp, idx) => (
                        <tr
                            key={exp._id}
                            className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}
                        >
                            <td className="px-4 py-2">
                                {editingExpense === exp._id ? (
                                    <input
                                        type="text"
                                        name="title"
                                        value={editData.title}
                                        onChange={handleEditChange}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    exp.title
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editingExpense === exp._id ? (
                                    <input
                                        type="number"
                                        name="amount"
                                        value={editData.amount}
                                        onChange={handleEditChange}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                        min="0"
                                    />
                                ) : (
                                    `LKR ${exp.amount}`
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editingExpense === exp._id ? (
                                    <select
                                        name="category"
                                        value={editData.category}
                                        onChange={handleEditChange}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    >
                                        <option value="">Select</option>
                                        <option value="Food & Dining">Food & Dining</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Utilities">Utilities</option>
                                        <option value="Shopping">Shopping</option>
                                    </select>
                                ) : (
                                    exp.category
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editingExpense === exp._id ? (
                                    <input
                                        type="text"
                                        name="description"
                                        value={editData.description}
                                        onChange={handleEditChange}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    exp.description
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editingExpense === exp._id ? (
                                    <input
                                        type="date"
                                        name="date"
                                        value={editData.date}
                                        onChange={handleEditChange}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    new Date(exp.date).toLocaleDateString()
                                )}
                            </td>
                            <td className="px-4 py-2 flex space-x-2">
                                {editingExpense === exp._id ? (
                                    <>
                                        <button
                                            onClick={handleEditSubmit}
                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                                        >
                                            💾
                                        </button>
                                        <button
                                            onClick={() => setEditingExpense(null)}
                                            className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 transition"
                                        >
                                            ❌
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEdit(exp)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                                        >
                                            🗑️
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    {filteredExpenses.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-gray-500">
                                No expenses found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseTable;
