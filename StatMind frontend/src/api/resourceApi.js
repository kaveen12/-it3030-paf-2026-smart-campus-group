// src/api/resourceApi.js

// Backend API Base URL (Spring Boot default port)
const API_BASE_URL = 'http://localhost:8081/api/resources';

// ========== 1. GET all resources ==========
export const getAllResources = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

// ========== 2. GET resource by ID ==========
export const getResourceById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Resource not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching resource:', error);
    throw error;
  }
};

// ========== 3. SEARCH resources ==========
export const searchResources = async (keyword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?keyword=${keyword}`);
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
};

// ========== 4. CREATE new resource (POST) ==========
export const createResource = async (resourceData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resourceData),
    });
    if (!response.ok) throw new Error('Create failed');
    return await response.json();
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

// ========== 5. UPDATE resource (PUT) ==========
export const updateResource = async (id, resourceData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resourceData),
    });
    if (!response.ok) throw new Error('Update failed');
    return await response.json();
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
};

// ========== 6. DELETE resource ==========
export const deleteResource = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Delete failed');
    return await response.json();
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
};