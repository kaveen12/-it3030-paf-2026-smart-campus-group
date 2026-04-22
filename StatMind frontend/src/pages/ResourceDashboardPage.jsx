import { useEffect, useState } from "react";
import { getAllResources } from "../api/resourceApi";
import ResourceDashboard from "../components/ResourceDashboard";
import AdminLayout from "../components/AdminLayout";

function ResourceDashboardPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (err) {
      console.error("Error loading resources");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {loading ? (
        <p className="p-6 text-white">Loading...</p>
      ) : (
        <ResourceDashboard resources={resources} />
      )}
    </AdminLayout>
  );
}

export default ResourceDashboardPage;