import { useEffect, useState } from "react";
import Navbar from "../components/ResourceNavbar";
import ResourceDashboard from "../components/ResourceDashboard";
import { getAllResources } from "../api/resourceApi";

export default function ResourceDashboardPage() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Navbar />

      <div className="ml-24 p-6 w-full">

        {/* TOP BAR */}
       
        {/* DASHBOARD */}
        <div className="h-[calc(100vh-100px)]">
          <ResourceDashboard resources={resources} />
        </div>

      </div>

    </div>
  );
}