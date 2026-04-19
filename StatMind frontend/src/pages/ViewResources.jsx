// src/pages/ViewResources.jsx
import { useState, useEffect } from 'react';
import { getAllResources, searchResources, deleteResource } from '../api/resourceApi';

function ViewResources() {
  const [resources, setResources] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all resources on page load
  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (err) {
      setError('Failed to load resources. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) {
      loadResources();
      return;
    }
    setLoading(true);
    try {
      const data = await searchResources(keyword);
      setResources(data);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await deleteResource(id);
      loadResources(); // Refresh the list
    } catch (err) {
      alert('Failed to delete resource');
    }
  };

  // Helper functions for badges
  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type) => {
    const styles = {
      LECTURE_HALL: 'bg-blue-100 text-blue-800',
      LAB: 'bg-purple-100 text-purple-800',
      AUDITORIUM: 'bg-orange-100 text-orange-800'
    };
    return styles[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading resources...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button onClick={loadResources} className="mt-2 bg-red-600 text-white px-3 py-1 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">View Resources</h1>
        <a href="/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add Resource
        </a>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Search by name, code, or type..."
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          Search
        </button>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{resource.resourceCode}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{resource.name}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(resource.type)}`}>
                    {resource.type?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{resource.capacity}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{resource.location}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(resource.status)}`}>
                    {resource.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <a href={`/edit/${resource.id}`} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </a>
                 <button
    onClick={() => handleDelete(resource.id)}
    className="text-red-600 hover:text-red-800 font-medium"
  >
    Delete
  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {resources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No resources found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewResources;