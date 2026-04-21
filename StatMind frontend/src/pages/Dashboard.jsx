import { useState, useEffect } from 'react';
import { getAllResources } from '../api/resourceApi';

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    lectureHalls: 0,
    labs: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resources = await getAllResources();
        setStats({
          total: resources.length,
          active: resources.filter(r => r.status === 'ACTIVE').length,
          lectureHalls: resources.filter(r => r.type === 'LECTURE_HALL').length,
          labs: resources.filter(r => r.type === 'LAB').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Total Resources</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Active Resources</h3>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Lecture Halls</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.lectureHalls}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Labs</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.labs}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;