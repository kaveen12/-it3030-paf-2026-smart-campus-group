export const ActivityLogTimeline = ({ logs }) => {
  const getActionColor = (action) => {
    const colors = {
      CREATED: 'bg-blue-500',
      ASSIGNED: 'bg-purple-500',
      STATUS_CHANGED: 'bg-yellow-500',
      RESOLVED: 'bg-green-500',
      REJECTED: 'bg-red-500',
      CLOSED: 'bg-gray-500',
      COMMENTED: 'bg-indigo-500',
      ATTACHMENT_ADDED: 'bg-pink-500',
    };
    return colors[action] || 'bg-gray-500';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">No activity logs available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-8">Activity Timeline</h3>

      <div className="space-y-4">
        {logs.map((log, index) => (
          <div key={log.id || index} className="flex gap-4">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full ${getActionColor(log.action)} ring-4 ring-white`}></div>
              {index !== logs.length - 1 && <div className="w-1 h-12 bg-gray-200 mt-2"></div>}
            </div>

            {/* Content */}
            <div className="pb-4 flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-gray-900">{log.action.replace(/_/g, ' ')}</span>
                <span className="text-sm text-gray-500">by {log.performedBy}</span>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-2">
                  {log.performedRole}
                </span>
                {log.details}
              </p>

              <p className="text-xs text-gray-400">{formatDate(log.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
