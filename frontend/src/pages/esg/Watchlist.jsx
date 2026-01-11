import React, { useEffect, useState } from "react";
import axios from "axios";
// import { getAuth } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { ToastProvider } from "../../components/toast/ToastContext";
import { useToast } from "../../components/toast/ToastContext";

const Watchlist = () => {
  const [companies, setCompanies] = useState([]);
  // const auth = getAuth();
  const { user, loading } = useAuth();

  const navigate = useNavigate();
  // const toast = ToastProvider();
  const toast = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchWatchlist = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/esg-watchlist/${user.uid}`
      );
      setCompanies(res.data.companies || []);
    };

    fetchWatchlist();
  }, [user]);
  if (loading) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>

      {companies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Star className="w-10 h-10 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold">Your watchlist is empty</h2>
          <p className="text-gray-500 mt-2">
            Add companies from the ESG Explorer to track them here.
          </p>
          <Button className="mt-4" onClick={() => navigate("/")}>
            Explore ESG Companies
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((c) => (
          <Card key={c._id} className="shadow rounded-2xl">
            <CardContent>
              <h2 className="font-semibold text-lg">{c.name}</h2>
              <p className="text-sm text-gray-500">{c.industry}</p>
              <p className="text-sm mt-2">
                ESG Score: {c.total_score ?? "N/A"}
              </p>
            </CardContent>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                await axios.delete(
                  `http://localhost:5000/api/esg-watchlist/remove/${user.uid}/${c._id}`
                );

                setCompanies((prev) => prev.filter((x) => x._id !== c._id));
                toast.info(`${c.name} removed from watchlist`);
              }}
            >
              Remove
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
