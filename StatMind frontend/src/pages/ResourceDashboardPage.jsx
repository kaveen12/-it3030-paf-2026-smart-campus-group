import { useEffect, useState } from "react";
import { getAllResources } from "../api/resourceApi";
import ResourceDashboard from "../components/ResourceDashboard";
import Navbar from "../components/Navbar";

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
    <div className="bg-[#0f172a] min-h-screen overflow-x-hidden">

      {/* ✅ Navbar (sidebar + topbar) */}
      <Navbar />

      {/* ✅ CONTENT AREA */}
     <div className="w-full min-h-screen bg-[#0f172a]">

        {loading ? (
          <p className="p-6 text-white">Loading...</p>
        ) : (
          <ResourceDashboard resources={resources} />
        )}

      </div>
    </div>
  );
}

export default ResourceDashboardPage;