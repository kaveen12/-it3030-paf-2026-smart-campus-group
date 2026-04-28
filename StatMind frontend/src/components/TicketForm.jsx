import { useState, useEffect } from 'react';
import { resourceAPI } from '../api/ticketService';
import { getSessionUser } from '../utils/sessionUser';

const getLoggedTicketUser = () => {
  const sessionUser = getSessionUser();

  return {
    id: sessionUser.userId || 'USER001',
    name: sessionUser.userName || 'User',
    role: sessionUser.role || 'USER',
  };
};

export const TicketForm = ({ initialData, onSubmit, loading }) => {
  const [resources, setResources] = useState([]);
  const [loggedUser, setLoggedUser] = useState(getLoggedTicketUser);
  const [formData, setFormData] = useState(
    initialData || {
      resourceId: '',
      category: '',
      description: '',
      priority: 'MEDIUM',
      preferredContact: '',
    }
  );

  const [error, setError] = useState('');
  const [formError, setFormError] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState('');

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

  useEffect(() => {
    setLoggedUser(getLoggedTicketUser());
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
      setFormData((prev) => ({
        ...prev,
        resourceId: value,
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

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setFileErrors('');

    if (newFiles.length === 0) return;

    // Calculate total files (existing + new)
    const totalFiles = selectedFiles.length + newFiles.length;

    if (totalFiles > 3) {
      setFileErrors(`Cannot add ${newFiles.length} file(s). You can upload maximum 3 images total. Currently selected: ${selectedFiles.length}`);
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png'];
    const invalidFiles = newFiles.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setFileErrors('Only JPG/JPEG and PNG files are allowed');
      return;
    }

    // APPEND new files to existing ones instead of replacing
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    
    // Reset file input so user can select more files
    e.target.value = '';
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setFileErrors('');
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.resourceId.trim()) {
      errors.resourceId = 'Resource selection is required';
    }
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.preferredContact.trim()) {
      errors.preferredContact = 'Preferred contact is required';
    } else {
      const phoneRegex = /^07\d{8}$/;
      if (!phoneRegex.test(formData.preferredContact.trim())) {
        errors.preferredContact = 'Phone number must start with 07 and be exactly 10 digits';
      }
    }

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Please fill in all required fields correctly');
      return;
    }

    const selectedResource = resources.find((resource) => resource.id === formData.resourceId);

    const payload = {
      resourceId: formData.resourceId,
      resourceName: selectedResource?.name || '',
      resourceCode: selectedResource?.resourceCode || '',
      location: selectedResource?.location || '',
      resourceOrLocation: selectedResource ? `${selectedResource.name} - ${selectedResource.location}` : '',
      category: formData.category,
      description: formData.description,
      priority: formData.priority,
      preferredContact: formData.preferredContact,
      createdById: loggedUser.id,
      createdByName: loggedUser.name,
      createdByRole: loggedUser.role,
    };

    console.log('Create ticket payload:', payload);
    onSubmit(payload, selectedFiles);
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
              Full Name
            </label>
            <input
              type="text"
              name="createdByName"
              value={loggedUser.name}
              readOnly
              className="w-full px-4 py-3 bg-gray-50 border border-slate-300 rounded-lg text-gray-700 cursor-not-allowed focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              type="text"
              name="createdByRole"
              value={loggedUser.role}
              readOnly
              className="w-full px-4 py-3 bg-gray-50 border border-slate-300 rounded-lg text-gray-700 cursor-not-allowed focus:outline-none"
            />
          </div>
        </div>

        {/* Resource Selection - REQUIRED */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Resource <span className="text-red-500">*</span>
          </label>
          <select
            name="resourceId"
            value={formData.resourceId}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Choose a resource --</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name} ({resource.resourceCode}) - {resource.location}
              </option>
            ))}
          </select>
          {formError.resourceId && (
            <p className="text-red-500 text-sm mt-1">{formError.resourceId}</p>
          )}
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
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            placeholder="07XXXXXXXX"
            maxLength="10"
            inputMode="numeric"
            pattern="07[0-9]{8}"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {formError.preferredContact && (
            <p className="text-red-500 text-sm mt-1">{formError.preferredContact}</p>
          )}
        </div>

        {/* Image Attachments Section */}
        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">📸 Evidence Photos (Optional)</h3>
          <p className="text-sm text-slate-600 mb-4">Add up to 3 JPG or PNG images showing the issue</p>
          
          <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block">
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                disabled={selectedFiles.length >= 3}
                className="block w-full text-sm text-slate-600 border border-slate-300 rounded-lg px-3 py-2 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-2">
                Selected: {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} (max 3)
              </p>
            </label>

            {fileErrors && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{fileErrors}</p>
            )}

            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="w-full h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition"
                      title="Remove image"
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                    <p className="text-xs text-slate-600 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Ticket...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
};
