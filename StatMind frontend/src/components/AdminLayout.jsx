import AdminNavbar from "./AdminNavBar";

export const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="ml-72 pt-16 min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  );
};