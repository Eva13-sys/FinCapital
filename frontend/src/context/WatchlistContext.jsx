import React, { createContext, useContext, useState } from "react";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  const add = (id) =>
    setWatchlistIds((prev) => new Set(prev).add(id));

  const remove = (id) =>
    setWatchlistIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  return (
    <WatchlistContext.Provider
      value={{
        watchlistIds,
        count: watchlistIds.size,
        add,
        remove,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
