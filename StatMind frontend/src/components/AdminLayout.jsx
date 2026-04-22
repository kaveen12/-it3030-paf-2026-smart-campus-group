import Navbar from "./Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex bg-[#0f172a] min-h-screen">

      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 ml-64 pt-16">
        {children}
      </div>

    </div>
  );
}