import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/bookings';

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(API_BASE_URL, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get all bookings
export const getAllBookings = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Get bookings by user ID
export const getBookingsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Approve a booking
export const approveBooking = async (id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving booking:', error);
    throw error;
  }
};

// Reject a booking
export const rejectBooking = async (id, reason) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/reject`, null, {
      params: { reason }
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting booking:', error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }

};