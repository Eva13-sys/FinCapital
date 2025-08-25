import { useEffect, useState } from "react";

export default function PlannerPage() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [weeklySaving, setWeeklySaving] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);


  // ✅ Fetch Goals
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/goals");
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Add Goal
  const addGoal = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, targetAmount, weeklySaving }),
    });
    const data = await res.json();
    setGoals([...goals, data]);
    setTitle("");
    setTargetAmount("");
    setWeeklySaving("");
  };

  // ✅ Save Money
  const saveMoney = async (id, amount) => {
    const res = await fetch(`http://localhost:5000/api/goals/${id}/save`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const updated = await res.json();
    setGoals(goals.map((g) => (g._id === id ? updated : g)));
  };

  // ✅ Delete Goal
  const deleteGoal = async (id) => {
    await fetch(`http://localhost:5000/api/goals/${id}`, {
      method: "DELETE",
    });
    setGoals(goals.filter((g) => g._id !== id));
  };

  // ✅ Start Editing
  const startEdit = (goal) => {
    setEditingGoal(goal._id);
    setTitle(goal.title);
    setTargetAmount(goal.targetAmount);
    setWeeklySaving(goal.weeklySaving);
  };

  const updateGoal = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/goals/${editingGoal}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, targetAmount, weeklySaving }),
    });

    const updated = await res.json();
    setGoals(goals.map((g) => (g._id === editingGoal ? updated : g)));

    // reset form
    setEditingGoal(null);
    setTitle("");
    setTargetAmount("");
    setWeeklySaving("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎯 Goal & Planner</h1>

      {/* Add / Edit Goal Form */}
      <form
        onSubmit={editingGoal ? updateGoal : addGoal}
        className="mb-6 space-x-2"
      >
        <input
          type="text"
          placeholder="Goal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Weekly Saving"
          value={weeklySaving}
          onChange={(e) => setWeeklySaving(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingGoal ? "✏️ Update Goal" : "➕ Add Goal"}
        </button>
        {editingGoal && (
          <button
            type="button"
            onClick={() => {
              setEditingGoal(null);
              setTitle("");
              setTargetAmount("");
              setWeeklySaving("");
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            ❌ Cancel
          </button>
        )}
      </form>

      {/* Display Goals */}
      <div className="grid gap-4">
        {goals.map((goal) => {
          const progress = Math.min(
            (goal.currentAmount / goal.targetAmount) * 100,
            100
          );
          return (
            <div key={goal._id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{goal.title}</h2>
              <p>Target: ₹{goal.targetAmount}</p>
              <p>Save ₹{goal.weeklySaving} weekly</p>
              <p>Status: {goal.status}</p>

              {/* progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">Progress: ₹{goal.currentAmount}</p>

              {/* Save Money */}
              <button
                onClick={() => saveMoney(goal._id, Number(goal.weeklySaving))}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded mr-2"
              >
                💰 Save ₹{goal.weeklySaving}
              </button>

              {/* Edit */}
              <button
                onClick={() => startEdit(goal)}
                className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded mr-2"
              >
                ✏️ Edit
              </button>

              {/* Delete */}
              <button
                onClick={() => deleteGoal(goal._id)}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
              >
                🗑️ Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
