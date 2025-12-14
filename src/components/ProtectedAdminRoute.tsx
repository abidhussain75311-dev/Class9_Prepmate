import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute: React.FC = () => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    console.log('ProtectedAdminRoute: isAuthenticated:', isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedAdminRoute;
