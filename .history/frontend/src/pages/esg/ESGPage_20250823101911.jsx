import React,  { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star } from "lucide-react";

const ESGPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [industry, setIndustry] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = { filter, industry, search, page };
      const res = await axios.get("http://localhost:5000/api/esg", { params });
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [filter, industry, search, page]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🌍 ESG Explorer</h1>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          variant={filter === "env_friendly" ? "default" : "outline"}
          onClick={() => setFilter("env_friendly")}
        >
          Environmental Friendly ✅
        </Button>
        <Button
          variant={filter === "high_social" ? "default" : "outline"}
          onClick={() => setFilter("high_social")}
        >
          High Social Impact 👥
        </Button>
        <Button
          variant={filter === "top_governance" ? "default" : "outline"}
          onClick={() => setFilter("top_governance")}
        >
          Top Governance 🏛️
        </Button>

        {/* Industry Dropdown */}
        <Select onValueChange={(val) => setIndustry(val)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Automobiles">Automobiles</SelectItem>
            <SelectItem value="Energy">Energy</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
          </SelectContent>
        </Select>

        {/* Search */}
        <Input
          type="text"
          placeholder="🔍 Search Company"
          className="w-[250px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Companies List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((c) => (
            <Card
              key={c._id}
              className="shadow-lg hover:shadow-xl transition rounded-2xl border p-2"
            >
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={c.logo || "https://via.placeholder.com/50"}
                    alt={c.name}
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{c.name}</h2>
                    <p className="text-sm text-gray-500">{c.industry}</p>
                  </div>
                </div>

                <Badge variant="secondary">
                  ESG Score: {c.total_score || "N/A"}
                </Badge>

                <p className="text-sm text-gray-700">
                  {c.description || `${c.name} – ${c.industry}`}
                </p>

                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Star className="w-4 h-4" /> Add to Watchlist
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          variant="outline"
        >
          Prev
        </Button>
        <span className="flex items-center">Page {page}</span>
        <Button onClick={() => setPage((p) => p + 1)} variant="outline">
          Next
        </Button>
      </div>
    </div>
  );
};

export default ESGPage;
