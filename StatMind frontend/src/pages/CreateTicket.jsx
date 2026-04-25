import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketAPI } from '../api/ticketService';
import { TicketForm } from '../components/TicketForm';

export const CreateTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const createdTicket = await ticketAPI.createTicket(formData);
      setSuccess(true);

      setTimeout(() => {
        navigate(`/user/tickets/${createdTicket.id}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="bg-white border-b border-gray-200 px-8 py-6 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Incident Ticket</h1>
            <p className="text-gray-500 mt-1">Report a new maintenance issue</p>
          </div>
          <button
            onClick={() => navigate('/user/tickets')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-3xl">
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-300">
            ✓ Ticket created successfully! Redirecting...
          </div>
        )}

        {error && !success && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
            ✗ {error}
          </div>
        )}

        <TicketForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};