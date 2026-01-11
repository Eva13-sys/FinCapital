import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function PlannerPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);

  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    amountPerPeriod: "",
    frequency: "monthly",
  });
  const [projection, setProjection] = useState(0);
  const [durationMonths, setDurationMonths] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/goals?userId=${user.uid}`)
      .then((r) => r.json())
      .then(setGoals);
  }, [user]);

  const resetForm = () => {
    setForm({
      title: "",
      targetAmount: "",
      amountPerPeriod: "",
      frequency: "monthly",
    });
    setEditingGoal(null);
  };

  const submitGoal = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      userId: user.uid,
      targetAmount: +form.targetAmount,
      amountPerPeriod: +form.amountPerPeriod,
    };

    const url = editingGoal
      ? `http://localhost:5000/api/goals/${editingGoal}`
      : "http://localhost:5000/api/goals";

    const method = editingGoal ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    setGoals((g) =>
      editingGoal
        ? g.map((x) => (x._id === editingGoal ? data : x))
        : [...g, data]
    );

    resetForm();
  };

  const saveMoney = async (goal) => {
    const res = await fetch(
      `http://localhost:5000/api/goals/${goal._id}/save`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: goal.amountPerPeriod }),
      }
    );
    const updated = await res.json();
    setGoals((g) => g.map((x) => (x._id === goal._id ? updated : x)));
  };

  const aiSuggestion = (goal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const weekly =
      goal.frequency === "monthly"
        ? goal.amountPerPeriod / 4
        : goal.amountPerPeriod;

    const weeks = remaining / weekly;
    if (weeks > 52) return "Increase savings to reach faster.";
    if (weeks < 4) return "Almost there! Stay consistent.";
    return "You are on track. Keep going.";
  };

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete this goal permanently?")) return;

    await fetch(`http://localhost:5000/api/goals/${id}`, {
      method: "DELETE",
    });

    setGoals((prev) => prev.filter((g) => g._id !== id));
  };

  const startEdit = (goal) => {
    setEditingGoal(goal._id);
    setForm({
      title: goal.title,
      targetAmount: goal.targetAmount,
      amountPerPeriod: goal.amountPerPeriod,
      frequency: goal.frequency,
    });
  };
  const simulateSIP = (monthly, rate, months) => {
    const r = rate / 12;
    let total = 0;
    for (let i = 0; i < months; i++) {
      total = (total + monthly) * (1 + r);
    }
    return total;
  };

  useEffect(() => {
    const fetchCagr = async () => {
      if (!form.targetAmount || !form.amountPerPeriod) return;

      const months = Math.ceil(
        form.targetAmount / form.amountPerPeriod
      );

      const res = await fetch("http://localhost:5000/api/market/cagr");
      const { cagr } = await res.json();

      const projected = simulateSIP(
        form.amountPerPeriod,
        cagr / 100,
        months
      );

      setProjection(projected);
      setDurationMonths(months);
    };
    fetchCagr();
  }, [form]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Goal Planner</h1>
      {editingGoal && (
        <div className="bg-yellow-50 text-yellow-700 p-2 rounded text-sm">
          Editing existing goal
        </div>
      )}

      <form
        onSubmit={submitGoal}
        className="grid grid-cols-5 gap-3 bg-white p-4 shadow rounded"
      >
        <input
          placeholder="Goal title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Target"
          value={form.targetAmount}
          onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Saving / period"
          value={form.amountPerPeriod}
          onChange={(e) =>
            setForm({ ...form, amountPerPeriod: e.target.value })
          }
          className="border p-2"
        />
        <select
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          className="border p-2"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button className="bg-blue-600 text-white rounded">
          {editingGoal ? "Update" : "Add"}
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysSince =
            goal.lastSavedAt &&
            Math.floor((Date.now() - new Date(goal.lastSavedAt)) / 86400000);

          return (
            <div
              key={goal._id}
              className="bg-white p-4 rounded shadow space-y-3"
            >
              <h2 className="font-semibold">{goal.title}</h2>
              <p>Status: {goal.status}</p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => saveMoney(goal)}
                  disabled={goal.status === "Completed"}
                  className="flex-1 bg-green-600 text-white py-1 rounded disabled:opacity-50"
                >
                  Save ₹{goal.amountPerPeriod}
                </button>

                <button
                  onClick={() => startEdit(goal)}
                  className="flex-1 border rounded py-1"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteGoal(goal._id)}
                  className="flex-1 border border-red-300 text-red-600 rounded py-1"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-blue-600">
                At current rate, you’ll reach ₹{projection.toFixed(0)} in{" "}
                {durationMonths} months
              </p>

              {/* Reminder */}
              {daysSince > 7 && (
                <div className="bg-yellow-50 text-yellow-700 p-2 text-sm rounded">
                  You haven’t saved in a while.
                </div>
              )}

              {/* Progress */}
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-blue-600 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* AI Suggestion */}
              <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                💡 {aiSuggestion(goal)}
              </div>

              {/* Analytics */}
              {goal.history?.length > 1 && (
                <LineChart width={280} height={160} data={goal.history}>
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="amount" stroke="#2563eb" />
                </LineChart>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
