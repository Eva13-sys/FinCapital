import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useToast } from "../../components/toast/ToastContext";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Loader2, Star } from "lucide-react";

const ESGPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const ENABLE_INFINITE_SCROLL = false;

  const [companies, setCompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [watchlistedIds, setWatchlistedIds] = useState(new Set());

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [filter, setFilter] = useState(searchParams.get("filter") || "");
  const [industry, setIndustry] = useState(searchParams.get("industry") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const auth = getAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchCompanies = async (append = false) => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/companies", {
        params: {
          page,
          limit: 100,
          filter,
          industry,
          search,
        },
      });

      const data = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      setCompanies((prev) => (append ? [...prev, ...data] : data));
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (filter) params.filter = filter;
    if (industry) params.industry = industry;
    if (search) params.search = search;

    setSearchParams(params);
  }, [page, filter, industry, search]);

  useEffect(() => {
    fetchCompanies(false);
  }, [page, filter, industry, search]);

  useEffect(() => {
    if (!ENABLE_INFINITE_SCROLL) return;

    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        page < totalPages &&
        !loading
      ) {
        setPage((p) => p + 1);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, totalPages, loading]);

  const toggleFilter = (val) => {
    setFilter((prev) => (prev === val ? "" : val));
    setPage(1);
  };

  // const handleAddToWatchlist = async (company) => {
  //   const user = auth.currentUser;
  //   if (!user) {
  //     toast.error("Please login to use watchlist");
  //     return;
  //   }

  //   try {
  //     await axios.post("http://localhost:5000/api/esg-watchlist/add", {
  //       userId: user.uid,
  //       company,
  //     });

  //     toast.success(`${company.name} added to watchlist`);
  //     setWatchlistCount((c) => c + 1);
  //     setWatchlistedIds((prev) => new Set([...prev, company._id]));
  //   } catch (err) {
  //     toast.error("Failed to add company");
  //   }
  // };
  const handleAddToWatchlist = async (company) => {
    if (watchlistedIds.has(company._id)) return;

    // OPTIMISTIC UPDATE
    setWatchlistedIds((prev) => new Set(prev).add(company._id));
    setWatchlistCount((c) => c + 1);

    try {
      await axios.post("http://localhost:5000/api/esg-watchlist/add", {
        userId: auth.currentUser.uid,
        company,
      });

      toast.success(`${company.name} added`);
    } catch {
      // ROLLBACK
      setWatchlistedIds((prev) => {
        const next = new Set(prev);
        next.delete(company._id);
        return next;
      });
      setWatchlistCount((c) => c - 1);

      toast.error("Failed to add company");
    }
  };

  useEffect(() => {
    const fetchCount = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const res = await axios.get(
        `http://localhost:5000/api/esg-watchlist/${user.uid}`
      );

      setWatchlistCount(res.data.companies?.length || 0);
      setWatchlistedIds(new Set(res.data.companies?.map((c) => c._id) || []));
    };

    fetchCount();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold ">ESG Explorer</h1>
        <Button
          variant="outline"
          onClick={() => navigate("/esg/watchlist")}
          className="relative"
        >
          Watchlist
          {watchlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {watchlistCount}
            </span>
          )}
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant={filter === "env_friendly" ? "default" : "outline"}
          onClick={() => toggleFilter("env_friendly")}
        >
          Environmental Friendly
        </Button>

        <Button
          variant={filter === "high_social" ? "default" : "outline"}
          onClick={() => toggleFilter("high_social")}
        >
          High Social Impact
        </Button>

        <Button
          variant={filter === "top_governance" ? "default" : "outline"}
          onClick={() => toggleFilter("top_governance")}
        >
          Top Governance
        </Button>

        {/* Industry */}
        <Select
          value={industry}
          onValueChange={(val) => {
            setIndustry(val === "all" ? "" : val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="Automobiles">Automobiles</SelectItem>
            <SelectItem value="Energy">Energy</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
          </SelectContent>
        </Select>

        {/* Search */}
        <Input
          placeholder="Search company"
          className="w-[250px]"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      )}
      {!loading && companies.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No companies match your filters.
        </div>
      )}

      {/* Companies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((c) => (
          <Card key={c._id} className="rounded-2xl shadow">
            <CardContent className="space-y-3">
              <h2 className="font-semibold text-lg">{c.name}</h2>
              <p className="text-sm text-gray-500">{c.industry}</p>

              <Badge>ESG Score: {c.total_score ?? "N/A"}</Badge>

              <p className="text-sm text-gray-700">
                {c.description || `${c.name} – ${c.industry}`}
              </p>

              <Button
                variant="outline"
                className="w-full"
                disabled={watchlistedIds.has(c._id)}
                onClick={() => handleAddToWatchlist(c)}
              >
                <Star className="w-4 h-4 mr-2" />
                {watchlistedIds.has(c._id)
                  ? "In Watchlist"
                  : "Add to Watchlist"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {!ENABLE_INFINITE_SCROLL && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <span className="flex items-center">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ESGPage;

// // src/pages/esg/ESGPage.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ESGPage = () => {
//   const [companies, setCompanies] = useState([]);
//   const [filters, setFilters] = useState({
//     environmental: false,
//     womenLed: false,
//     topGovernance: false,
//   });
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/companies")
//       .then((res) => setCompanies(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   const toggleFilter = (filterName) =>
//     setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));

//   const filteredCompanies = companies.filter((company) => {
//     // Map to backend fields: environment_score, total_score, governance_score
//     if (filters.environmental) {
//       if (!(company.environment_score && Number(company.environment_score) > 0)) return false;
//     }
//     if (filters.womenLed) {
//       // dataset doesn't include womenLed by default; allow explicit flag if present
//       if (!company.womenLed) return false;
//     }
//     if (filters.topGovernance) {
//       if (!(company.governance_score && Number(company.governance_score) > 400)) return false;
//     }
//     if (search && !(company.name || company.ticker || '').toLowerCase().includes(search.toLowerCase()))
//       return false;
//     return true;
//   });

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">

//       <main className="flex-1 container mx-auto p-6">
//         {/* Page title */}
//         <h1 className="text-4xl font-bold mb-6 text-gray-900">ESG Investing</h1>

//         {/* Search and filters */}
//         <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
//           <input
//             type="text"
//             placeholder="Search companies..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="px-4 py-2 border rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <div className="flex gap-3 flex-wrap">
//             <button
//               onClick={() => toggleFilter("environmental")}
//               className={`px-4 py-2 rounded font-semibold ${
//                 filters.environmental
//                   ? "bg-green-600 text-white"
//                   : "bg-white border text-gray-800"
//               }`}
//             >
//               Environment Friendly
//             </button>
//             <button
//               onClick={() => toggleFilter("womenLed")}
//               className={`px-4 py-2 rounded font-semibold ${
//                 filters.womenLed
//                   ? "bg-green-600 text-white"
//                   : "bg-white border text-gray-800"
//               }`}
//             >
//               Women-led
//             </button>
//             <button
//               onClick={() => toggleFilter("topGovernance")}
//               className={`px-4 py-2 rounded font-semibold ${
//                 filters.topGovernance
//                   ? "bg-green-600 text-white"
//                   : "bg-white border text-gray-800"
//               }`}
//             >
//               Top 10% Governance
//             </button>
//           </div>
//         </div>

//         {/* Company cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredCompanies.map((company) => (
//             <div
//               key={company._id || company.ticker}
//               className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
//             >
//               <div className="flex justify-between items-center mb-3">
//                 <h2 className="text-2xl font-bold">{company.name || company.ticker}</h2>
//                 <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
//                   {company.total_score ?? company.totalScore ?? 'N/A'}
//                 </span>
//               </div>

//               <p className="text-gray-700 mb-2">{company.description || company.weburl || ''}</p>
//               <p className="text-gray-500 text-sm mb-3">
//                 <strong>Industry:</strong> {company.industry}
//               </p>

//               <div className="flex flex-wrap gap-2 mb-4">
//                 {( [company.environment_grade, company.social_grade, company.governance_grade]
//                   .filter(Boolean)
//                 ).map((tag, idx) => (
//                   <span
//                     key={idx}
//                     className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>

//               <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
//                 Add to Watchlist
//               </button>
//             </div>
//           ))}
//         </div>

//         {filteredCompanies.length === 0 && (
//           <p className="text-gray-500 mt-6 text-center">
//             No companies match your filters or search.
//           </p>
//         )}
//       </main>

//     </div>
//   );
// };
// export default ESGPage;
