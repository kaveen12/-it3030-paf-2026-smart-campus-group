import UserNavbar from "./usernav";

export const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <main className="ml-72 pt-16 min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;