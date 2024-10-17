"use client"
import AdminTable from "./_components/AdminTable";

const AdminDashboardPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl">Admin Dashboard</h1>
            <AdminTable />
        </div>
    );
};

export default AdminDashboardPage;