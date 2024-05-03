import AdminMain from "./AdminMain";
import AdminSidebar from "./AdminSidebar";
import "./AdminDashboard.css";
import { useEffect } from "react";
const AdminDashboard = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className="admin-dashboard">
      <AdminSidebar />
      <AdminMain />
    </section>
  );
};

export default AdminDashboard;
