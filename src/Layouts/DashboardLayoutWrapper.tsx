import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

const DashboardLayoutWrapper: React.FC = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
};

export default DashboardLayoutWrapper;