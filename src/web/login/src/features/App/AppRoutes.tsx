import { Navigate, Route, Routes } from 'react-router-dom';
import Auth from '../Auth';
import { Register, Edit } from '../User';
import React from 'react';
import { ConnectAuthenticator } from '../User/ConnectAuthenticator';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login/register" element={<Register />} />
      <Route
        path="*"
        element={
          <Auth>
            <Routes>
              <Route path="/login/user" element={<Edit />} />
              <Route
                path="/login/user/connect-authenticator-app"
                element={<ConnectAuthenticator />}
              />
              <Route path="/*" element={<Navigate to="/login/user" />} />
            </Routes>
          </Auth>
        }
      />
    </Routes>
  );
}
