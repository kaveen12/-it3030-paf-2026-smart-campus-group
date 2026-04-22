import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/resources";

// GET all
export const getAllResources = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};

// GET by ID
export const getResourceById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`);
  return res.data;
};

// SEARCH (FIXED)
export const searchResources = async (filters) => {
  const res = await axios.get(`${API_BASE_URL}/search`, {
    params: {
      type: filters.type || null,
      location: filters.location || null,
      capacity: filters.capacity ? Number(filters.capacity) : null
    }
  });

  return res.data;
};

// CREATE
export const createResource = async (data) => {
  const res = await axios.post(API_BASE_URL, data);
  return res.data;
};

// UPDATE
export const updateResource = async (id, data) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, data);
  return res.data;
};

// DELETE
export const deleteResource = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`);
  return res.data;
};

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:8081/api/resources/upload", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }
};