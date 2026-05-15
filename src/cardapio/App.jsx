import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CardapioAdminCreateGroupPage from "./pages/CardapioAdminCreateGroupPage";
import CardapioLoginPage from "./pages/CardapioLoginPage";
import CardapioAdminDashboardPage from "./pages/CardapioAdminDashboardPage";
import CardapioAdminHoursPage from "./pages/CardapioAdminHoursPage";
import CardapioAdminLayoutPage from "./pages/CardapioAdminLayoutPage";
import CardapioShellPage from "./pages/CardapioShellPage";
import { getCardapioRouteByRole, getCardapioSession } from "./services/session";

function ProtectedCardapioRoute({ allowedRoles, children }) {
  const session = getCardapioSession();

  if (!session?.role) {
    return <Navigate replace to="/menu/login" />;
  }

  if (!allowedRoles.includes(session.role)) {
    return <Navigate replace to={getCardapioRouteByRole(session.role)} />;
  }

  return children;
}

function CardapioApp() {
  return (
    <Routes>
      <Route index element={<CardapioShellPage variant="user" />} />
      <Route path="produtos" element={<CardapioShellPage variant="user" />} />
      <Route path="grupo/:groupId" element={<CardapioShellPage variant="user" />} />
      <Route path="login" element={<CardapioLoginPage />} />
      <Route path="usuario" element={<Navigate replace to="/menu" />} />
      <Route
        path="admin"
        element={
          <ProtectedCardapioRoute allowedRoles={["admin"]}>
            <CardapioAdminLayoutPage />
          </ProtectedCardapioRoute>
        }
      >
        <Route index element={<CardapioAdminDashboardPage />} />
        <Route path="horarios" element={<CardapioAdminHoursPage />} />
        <Route path="grupos" element={<CardapioAdminCreateGroupPage />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/menu/login" />} />
    </Routes>
  );
}

export default CardapioApp;