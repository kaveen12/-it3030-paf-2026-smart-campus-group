import { useState } from 'react';
import { deleteResource } from '../api/resourceApi';

function ResourceTable({ resources, onRefresh, onEdit }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    setDeletingId(id);
    try {
      await deleteResource(id);
      onRefresh(); // Refresh the list
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete resource');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type) => {
    const colors = {
      LECTURE_HALL: 'bg-blue-100 text-blue-800',
      LAB: 'bg-purple-100 text-purple-800',
      AUDITORIUM: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (resources.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No resources found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
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
        <tbody className="divide-y divide-gray-200">
          {resources.map((resource) => (
            <tr key={resource.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{resource.resourceCode}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{resource.name}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(resource.type)}`}>
                  {resource.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{resource.capacity}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{resource.location}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(resource.status)}`}>
                  {resource.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm space-x-2">
                <button
                  onClick={() => onEdit(resource)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  disabled={deletingId === resource.id}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  {deletingId === resource.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResourceTable;