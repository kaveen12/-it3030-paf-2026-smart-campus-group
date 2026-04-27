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
  const [attachmentUrls, setAttachmentUrls] = useState(['', '', '']);
  const [previewImages, setPreviewImages] = useState([null, null, null]);

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
    
    if (!formData.preferredContact.trim()) {
      errors.preferredContact = 'Preferred contact is required';
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.preferredContact.trim())) {
        errors.preferredContact = 'Phone number must be exactly 10 digits';
      }
    }

    if (!formData.resourceId && !formData.resourceOrLocation.trim()) {
      errors.resourceOrLocation = 'Please select a resource or enter location';
    }

    // Validate attachments
    const filledUrls = attachmentUrls.filter(url => url.trim());
    if (filledUrls.length > 0) {
      const validExtensions = /\.(jpg|jpeg|png)$/i;
      filledUrls.forEach((url, idx) => {
        if (!validExtensions.test(url.trim())) {
          errors[`attachment_${idx}`] = 'URL must end with .jpg, .jpeg, or .png';
        }
      });
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
    
    const validAttachments = attachmentUrls.filter(url => url.trim());

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
      attachmentUrls: validAttachments,
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
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            placeholder="Enter 10 digit phone number"
            maxLength="10"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Attachments Section */}
        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">📸 Evidence Photos (Optional)</h3>
          <p className="text-sm text-slate-600 mb-4">Add up to 3 photos showing the issue (e.g., broken equipment, error screens)</p>
          
          <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={attachmentUrls[index]}
                    onChange={(e) => {
                      const newUrls = [...attachmentUrls];
                      newUrls[index] = e.target.value;
                      setAttachmentUrls(newUrls);
                    }}
                    placeholder={`Photo ${index + 1} URL (optional)${index === 0 ? ' - recommended' : ''}`}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {attachmentUrls[index] && (
                    <button
                      type="button"
                      onClick={() => {
                        const newUrls = [...attachmentUrls];
                        newUrls[index] = '';
                        setAttachmentUrls(newUrls);
                        const newPreviews = [...previewImages];
                        newPreviews[index] = null;
                        setPreviewImages(newPreviews);
                      }}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {formError[`attachment_${index}`] && (
                  <p className="text-red-600 text-xs">{formError[`attachment_${index}`]}</p>
                )}
                {attachmentUrls[index] && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-300 bg-white">
                    <img
                      src={attachmentUrls[index]}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div
                      style={{ display: 'none' }}
                      className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-500"
                    >
                      Invalid
                    </div>
                  </div>
                )}
              </div>
            ))}
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