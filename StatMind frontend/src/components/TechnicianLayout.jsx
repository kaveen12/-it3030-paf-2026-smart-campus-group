import TechnicianNavBar from "./TechnicianNavBar";

export const TechnicianLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TechnicianNavBar />
      <main className="ml-56 pt-16 p-6">{children}</main>
    </div>
  );
};