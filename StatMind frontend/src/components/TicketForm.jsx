import { useState, useEffect } from 'react';
import { resourceAPI } from '../api/ticketService';

export const TicketForm = ({ initialData, onSubmit, loading }) => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState(
    initialData || {
      resourceId: '',
      resourceOrLocation: '',
      category: '',
      description: '',
      priority: 'MEDIUM',
      preferredContact: '',
      createdById: 'USER001',
      createdByName: '',
      createdByRole: 'USER',
    }
  );

  const [error, setError] = useState('');
  const [formError, setFormError] = useState({});

  const categories = [
    'Equipment Failure',
    'Network Issue',
    'Electrical Issue',
    'Room Damage',
    'Cleaning Issue',
    'Safety Hazard',
    'Other',
  ];

  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const roles = ['USER', 'TECHNICIAN', 'ADMIN'];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await resourceAPI.getResources();
      setResources(Array.isArray(data) ? data : []);
    } catch {
      setResources([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'resourceId') {
      const selectedResource = resources.find((resource) => resource.id === value);

      setFormData((prev) => ({
        ...prev,
        resourceId: value,
        resourceOrLocation: selectedResource
          ? `${selectedResource.name} - ${selectedResource.location}`
          : prev.resourceOrLocation,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (formError[name]) {
      setFormError((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.createdByName.trim()) errors.createdByName = 'Your name is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.preferredContact.trim()) errors.preferredContact = 'Preferred contact is required';

    if (!formData.resourceId && !formData.resourceOrLocation.trim()) {
      errors.resourceOrLocation = 'Please select a resource or enter location';
    }

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }

    const selectedResource = resources.find((resource) => resource.id === formData.resourceId);

    const payload = {
      resourceId: formData.resourceId || null,
      resourceOrLocation:
        formData.resourceOrLocation ||
        (selectedResource ? `${selectedResource.name} - ${selectedResource.location}` : 'Manual Entry'),
      category: formData.category,
      description: formData.description,
      priority: formData.priority,
      preferredContact: formData.preferredContact,
      createdById: 'USER001',
      createdByName: formData.createdByName,
      createdByRole: formData.createdByRole || 'USER',
    };

    console.log('Create ticket payload:', payload);
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Incident Ticket</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Resource
            </label>
            <select
              name="resourceId"
              value={formData.resourceId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose a resource --</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} ({resource.resourceCode}) - {resource.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="resourceOrLocation"
              value={formData.resourceOrLocation}
              onChange={handleChange}
              placeholder="e.g., Room 101, Lab A, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formError.resourceOrLocation && (
              <p className="text-red-500 text-sm mt-1">{formError.resourceOrLocation}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select category --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {formError.category && (
              <p className="text-red-500 text-sm mt-1">{formError.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorities.map((pri) => (
                <option key={pri} value={pri}>{pri}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formError.description && (
            <p className="text-red-500 text-sm mt-1">{formError.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Contact <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="preferredContact"
            value={formData.preferredContact}
            onChange={handleChange}
            placeholder="Phone, email, or office location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formError.preferredContact && (
            <p className="text-red-500 text-sm mt-1">{formError.preferredContact}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="createdByName"
              value={formData.createdByName}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formError.createdByName && (
              <p className="text-red-500 text-sm mt-1">{formError.createdByName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Role <span className="text-red-500">*</span>
            </label>
            <select
              name="createdByRole"
              value={formData.createdByRole}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400"
        >
          {loading ? 'Creating Ticket...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
};