export const PriorityBadge = ({ priority }) => {
  const priorityStyles = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityStyles[priority] || 'bg-gray-100 text-gray-800'}`}>
      {priority}
    </span>
  );
};
