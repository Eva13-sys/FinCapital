// src/pages/esg/ESGPage.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";

const ESGPage = () => {
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({
    environmental: false,
    womenLed: false,
    topGovernance: false,
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/companies")
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error(err));
  }, []);

  const toggleFilter = (filterName) =>
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));

  const filteredCompanies = companies.filter((company) => {
    if (filters.environmental && !company.environmental) return false;
    if (filters.womenLed && !company.womenLed) return false;
    if (filters.topGovernance && !company.topGovernance) return false;
    if (search && !company.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto p-6">
        {/* Page title */}
        <h1 className="text-4xl font-bold mb-6 text-gray-900">ESG Investing</h1>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => toggleFilter("environmental")}
              className={`px-4 py-2 rounded font-semibold ${
                filters.environmental
                  ? "bg-green-600 text-white"
                  : "bg-white border text-gray-800"
              }`}
            >
              Environmental ✅
            </button>
            <button
              onClick={() => toggleFilter("womenLed")}
              className={`px-4 py-2 rounded font-semibold ${
                filters.womenLed
                  ? "bg-green-600 text-white"
                  : "bg-white border text-gray-800"
              }`}
            >
              Women-led ✅
            </button>
            <button
              onClick={() => toggleFilter("topGovernance")}
              className={`px-4 py-2 rounded font-semibold ${
                filters.topGovernance
                  ? "bg-green-600 text-white"
                  : "bg-white border text-gray-800"
              }`}
            >
              Top 10% Governance ✅
            </button>
          </div>
        </div>

        {/* Company cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company._id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-bold">{company.name}</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                  {company.esgScore}
                </span>
              </div>

              <p className="text-gray-700 mb-2">{company.description}</p>
              <p className="text-gray-500 text-sm mb-3">
                <strong>Industry:</strong> {company.industry}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {company.impact.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Add to Watchlist
              </button>
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <p className="text-gray-500 mt-6 text-center">
            No companies match your filters or search.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-8 mt-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 FinCapital. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              Twitter
            </a>
            <a href="#" className="hover:text-white">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ESGPage;
