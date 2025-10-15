import { useEffect, useState } from "react";
import {api} from "../api/BlogApi"; // your axios instance

export function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Call a protected endpoint
    api.get("/blogs")
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  return isAuthenticated;
}