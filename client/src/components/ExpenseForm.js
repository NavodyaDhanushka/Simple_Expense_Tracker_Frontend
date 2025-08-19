import { useState } from "react";

const ExpenseForm = ({ onAdd }) => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "",
        description: "",
        date: today, // default to today
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Prevent negative numbers for amount
        if (name === "amount" && Number(value) < 0) return;

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare payload
        const payload = {
            ...formData,
            amount: Number(formData.amount), // convert amount to number
            date: formData.date ? new Date(formData.date).toISOString() : null,
        };

        try {
            const response = await fetch("http://localhost:5000/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to add expense");

            const data = await response.json();
            onAdd(data); // pass new expense to parent
            setFormData({
                title: "",
                amount: "",
                category: "",
                description: "",
                date: today, // reset to today
            });
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Error adding expense. Please try again.");
        }
    };

    return (
        <form className="bg-white shadow rounded p-6 max-w-md mx-auto" onSubmit={handleSubmit}>
            <h2 className="font-semibold mb-4 text-xl text-gray-700">Add New Expense</h2>

            <input
                type="text"
                name="title"
                placeholder="Enter expense title"
                className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.title}
                onChange={handleChange}
                required
            />

            <div className="relative mb-3">
                <span className="absolute left-2 top-2 text-gray-500">LKR</span>
                <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    className="border pl-12 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0"
                    required
                />
            </div>

            <select
                name="category"
                className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.category}
                onChange={handleChange}
                required
            >
                <option value="">Select category</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Shopping">Shopping</option>
            </select>

            <textarea
                name="description"
                placeholder="Enter description"
                className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.description}
                onChange={handleChange}
            />

            <input
                type="date"
                name="date"
                className="border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.date}
                onChange={handleChange}
            />

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition"
            >
                + Add Expense
            </button>
        </form>
    );
};

export default ExpenseForm;
