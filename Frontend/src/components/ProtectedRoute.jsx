import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const authStatus = useSelector((state) => state.auth.status);

  return authStatus ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;