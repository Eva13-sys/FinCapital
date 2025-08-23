import React, { useEffect, useState } from 'react';
import Topbar from './Topbar';
import StatsCard from './StatsCard';
import AnalyticsChart from './AnalyticsChart';
import CurrentGoals from './CurrentGoals';
import News from './News';
import AiTips from './AiTips';
import { getFirebaseIdToken } from '../../utils/authToken';

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [change, setChange] = useState(0);
  const [esg, setEsg] = useState(0);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ balance: 0, change: 0, esg: 0 });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Fetch stats on load
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = await getFirebaseIdToken();
        if (!token) throw new Error('Not logged in');

        const res = await fetch('http://localhost:5000/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setBalance(Number(data.balance) || 0);
          setChange(Number(data.change) || 0);
          setEsg(Number(data.esg) || 0);
        } else {
          console.error('Failed to fetch stats');
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Keep form in sync with stats
  useEffect(() => {
    setForm({ balance, change, esg });
  }, [balance, change, esg]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');

    try {
      const token = await getFirebaseIdToken();
      if (!token) throw new Error('Not logged in');

      const res = await fetch('http://localhost:5000/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setSaveMsg('Stats updated!');
        //refetch to get updated values
        const statsRes = await fetch('http://localhost:5000/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        
        setBalance(Number(statsData.balance));
        setChange(Number(statsData.change));
        setEsg(Number(statsData.esg));
      } else {
        setSaveMsg('Failed to update stats.');
      }
    } catch (err) {
      console.error('Error updating stats:', err);
      setSaveMsg('Error updating stats.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <Topbar />

      {loading ? (
        <p className="text-center mt-6 text-gray-500 animate-pulse">
          Loading dashboard...
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <StatsCard title="Balance" value={`Rs.${balance}`} />
            <StatsCard
              title="Portfolio Gain"
              value={`${change}%`}
              change={change}
              isPositive={change >= 0}
            />
            <StatsCard title="ESG Score" value={esg} />
          </div>

          {/* Stats Update Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 mb-4 bg-white/80 p-4 rounded-xl shadow border flex flex-col md:flex-row gap-4 items-center max-w-2xl mx-auto"
          >
            <input
              type="number"
              name="balance"
              value={form.balance}
              onChange={handleChange}
              placeholder="Balance"
              className="border rounded px-2 py-1 w-32"
              required
            />
            <input
              type="number"
              name="change"
              value={form.change}
              onChange={handleChange}
              placeholder="Portfolio Gain (%)"
              className="border rounded px-2 py-1 w-32"
              required
            />
            <input
              type="number"
              name="esg"
              value={form.esg}
              onChange={handleChange}
              placeholder="ESG Score"
              className="border rounded px-2 py-1 w-32"
              required
            />
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-1 rounded"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Update Stats'}
            </button>
            {saveMsg && <span className="ml-2 text-sm text-green-600">{saveMsg}</span>}
          </form>

          <div className="mt-6 bg-white/80 p-4 rounded-xl shadow-lg border">
            <AnalyticsChart />
          </div>

          <div className="mt-6 bg-white/80 p-4 rounded-xl shadow-lg border">
            <CurrentGoals />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white/80 p-4 rounded-xl shadow-lg border">
              <News />
            </div>
            <div className="bg-white/80 p-4 rounded-xl shadow-lg border">
              <AiTips />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

// import React, { useEffect, useState } from 'react';
// import Topbar from './Topbar';
// import StatsCard from './StatsCard';
// import AnalyticsChart from './AnalyticsChart';
// import CurrentGoals from "./CurrentGoals";
// import News from "./News";
// import AiTips from "./AiTips";
// import { getFirebaseIdToken } from '../../utils/authToken';
// import { getAuth } from "../utils/authToken";


// const Dashboard = () => {
//   const [balance, setBalance] = useState(0);
//   const [change, setChange] = useState(0);
//   const [esg, setEsg] = useState(0);
//   const [loading, setLoading] = useState(true);



//   useEffect(() => {
//     const fetchStats = async () => {
//       setLoading(true);
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (!user) throw new Error("Not logged in");
//         const token = await user.getIdToken();
//         const res = await fetch('http://localhost:5000/api/stats', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setBalance(data.balance || 0);
//           setChange(data.change || 0);
//           setEsg(data.esg || 0);
//         }
//       } catch (err) {
//         console.error(err);
        // const token = await getFirebaseIdToken();
        // if (!token) throw new Error('Not logged in');
//     fetchStats();
//   }, []);

//   // Form state for updating stats
//   const [form, setForm] = useState({ balance, change, esg });
//   const [saving, setSaving] = useState(false);
//   const [saveMsg, setSaveMsg] = useState('');

//   useEffect(() => {
//     setForm({ balance, change, esg });
//   }, [balance, change, esg]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setSaveMsg('');
//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) throw new Error("Not logged in");
//       const token = await user.getIdToken();
//       const res = await fetch('http://localhost:5000/api/stats', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(form)
//       });
//       if (res.ok) {
//         setSaveMsg('Stats updated!');
//         const statsRes = await fetch('http://localhost:5000/api/stats', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
      // const token = await getFirebaseIdToken();
      // if (!token) throw new Error('Not logged in');
//         setEsg(Number(statsData.esg));
//       } else {
//         setSaveMsg('Failed to update stats.');
//       }
//     } catch (err) {
//       setSaveMsg('Error updating stats.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 bg-gradient-to-br from-gray-100 via-white to-gray-200">
//       <Topbar />

//       {loading ? (
//         <p className="text-center mt-6 text-gray-500 animate-pulse">
//           Loading dashboard...
//         </p>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//             <StatsCard
//               title="Balance"
//               value={`Rs.${balance}`}
//               className="bg-white/80 backdrop-blur-lg border border-gray-200 hover:shadow-xl transition duration-300 h-32"
//             />
//             <StatsCard
//               title="Portfolio Gain"
//               value={`${change}%`}
//               change={change}
//               isPositive={change >= 0}
//               className="bg-white/80 backdrop-blur-lg border border-gray-200 hover:shadow-xl transition duration-300 h-32"
//             />
//             <StatsCard
//               title="ESG Score"
//               value={esg}
//               className="bg-white/80 backdrop-blur-lg border border-gray-200 hover:shadow-xl transition duration-300 h-32"
//             />
//           </div>

//           {/* Stats Update Form */}
//           <form onSubmit={handleSubmit} className="mt-8 mb-4 bg-white/80 p-4 rounded-xl shadow border flex flex-col md:flex-row gap-4 items-center max-w-2xl mx-auto">
//             <input
//               type="number"
//               name="balance"
//               value={form.balance}
//               onChange={handleChange}
//               placeholder="Balance"
//               className="border rounded px-2 py-1 w-32"
//               required
//             />
//             <input
//               type="number"
//               name="change"
//               value={form.change}
//               onChange={handleChange}
//               placeholder="Portfolio Gain (%)"
//               className="border rounded px-2 py-1 w-32"
//               required
//             />
//             <input
//               type="number"
//               name="esg"
//               value={form.esg}
//               onChange={handleChange}
//               placeholder="ESG Score"
//               className="border rounded px-2 py-1 w-32"
//               required
//             />
//             <button type="submit" className="bg-indigo-500 text-white px-4 py-1 rounded" disabled={saving}>
//               {saving ? 'Saving...' : 'Update Stats'}
//             </button>
//             {saveMsg && <span className="ml-2 text-sm text-green-600">{saveMsg}</span>}
//           </form>

//           {/* Analytics Chart */}
//           <div className="mt-6 bg-white/80 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 -28 flex flex-col justify-center px-6">
//             <AnalyticsChart />
//           </div>

//           {/* Current Goals */}
//           <div className="mt-6 bg-white/80 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 -28 flex flex-col justify-center px-6">
//             <CurrentGoals />
//           </div>

//           {/* News + AI Tips */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//             <div className="bg-white/80 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
//               <News />
//             </div>
//             <div className="bg-white/80 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
//               <AiTips />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Dashboard;