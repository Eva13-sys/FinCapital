import axios from "axios";

const axiosSQL = axios.create({
  baseURL: "http://localhost:5000/api/sql", // your SQL routes prefix
});

export default axiosSQL;
