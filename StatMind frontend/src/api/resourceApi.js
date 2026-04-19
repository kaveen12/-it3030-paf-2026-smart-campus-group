import axios from "axios";

const API_URL = "http://localhost:8081/api/resources";

export const getAllResources = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};