import React, { ReactElement, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import { Loader, accessTokenSelector } from '@wdid/shared';
import { UserService } from '../User';
import { Login } from '.';
import currentUserSelector from './currentUserSelector';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import { CheckInbox } from './CheckInbox';
import { SelectTwoFactorProvider } from './SelectTwoFactorProvider';
import { VerifyCode } from './VerifyCode';

interface AuthProps {
  children: ReactElement;
}

function RenderIfLoggedIn({ children }: AuthProps) {
  const user = useRecoilValue(currentUserSelector);

  if (user && children) {
    return children;
  }

  return <Navigate to="/login" />;
}

function Logout() {
  const user = useRecoilValue(currentUserSelector);
  const refreshUser = useRecoilRefresher_UNSTABLE(currentUserSelector);
  const refreshAccessToken = useRecoilRefresher_UNSTABLE(accessTokenSelector);
  const userService = useMemo(() => new UserService(), []);
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      const response = await userService.logout();

      if (response.success) {
        refreshUser();
        refreshAccessToken();
        navigate('/');
      }
    };

    if (user) {
      logout();
    }
  }, [userService, navigate, refreshUser, refreshAccessToken, user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Loader />;
}

export function Auth({ children }: AuthProps) {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login/logout" element={<Logout />} />
      <Route path="/login/forgot-password" element={<ForgotPassword />} />
      <Route path="/login/forgot-password/sent" element={<CheckInbox />} />
      <Route
        path="/login/select-two-factor-provider"
        element={<SelectTwoFactorProvider />}
      />
      <Route path="/login/reset-password" element={<ResetPassword />} />
      <Route path="/login/verify-code" element={<VerifyCode />} />
      <Route
        path="*"
        element={<RenderIfLoggedIn>{children}</RenderIfLoggedIn>}
      />
    </Routes>
  );
}
