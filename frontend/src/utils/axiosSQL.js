// import axios from "axios";

// const axiosSQL = axios.create({
//   baseURL: "http://localhost:5000/api/sql", // your SQL routes prefix
// });

// export default axiosSQL;
// ...existing code...
// ...existing code...
import axios from "axios";

const BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const axiosSQL = axios.create({
  baseURL: BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default axiosSQL;
// ...existing code...