import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketAPI } from '../api/ticketService';
import { TicketTable } from '../components/TicketTable';
import { StatusBadge } from '../components/StatusBadge';

export const TicketDashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const categories = [
    'Equipment Failure',
    'Network Issue',
    'Electrical Issue',
    'Room Damage',
    'Cleaning Issue',
    'Safety Hazard',
    'Other',
  ];

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ticketAPI.getAllTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = tickets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.resourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.resourceOrLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((ticket) => ticket.category === categoryFilter);
    }

    setFilteredTickets(filtered);
  };

  const getSummary = () => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'OPEN').length,
      inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
      closed: tickets.filter((t) => t.status === 'CLOSED').length,
    };
  };

  const summary = getSummary();

  const handleViewTicket = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  const SummaryCard = ({ title, count, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <p className="text-gray-600 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{count}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incident Ticketing</h1>
            <p className="text-gray-500 mt-1">Manage campus maintenance incidents</p>
          </div>
          <button
            onClick={() => navigate('/tickets/create')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Create Ticket
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <SummaryCard title="Total Tickets" count={summary.total} color="border-blue-500" />
          <SummaryCard title="Open" count={summary.open} color="border-blue-500" />
          <SummaryCard title="In Progress" count={summary.inProgress} color="border-yellow-500" />
          <SummaryCard title="Resolved" count={summary.resolved} color="border-green-500" />
          <SummaryCard title="Closed" count={summary.closed} color="border-gray-500" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by resource or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priority</option>
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPriorityFilter('');
                  setCategoryFilter('');
                }}
                className="w-full px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
            <button
              onClick={fetchTickets}
              className="ml-4 underline font-medium hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading tickets...</p>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </div>

            {/* Ticket Table */}
            <TicketTable
              tickets={filteredTickets}
              onView={handleViewTicket}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </>
        )}
      </div>
    </div>
  );
};
