import axios from "axios";

const axiosMongo = axios.create({
  baseURL: "http://localhost:5000/api/mongo", // your Mongo routes prefix
});

export default axiosMongo;
