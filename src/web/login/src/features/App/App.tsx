import React, { Suspense } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { AppRoutes } from './AppRoutes';
import { appTheme, ErrorBoundry, Layout, Loader } from '@wdid/shared';
import { currentUserSelector } from '../Auth/currentUserSelector';
import 'react-toastify/dist/ReactToastify.css';

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background: ${({ theme }) => theme.palette.paperHighlight.main};
    .Toastify__toast-body {
      color: ${({ theme }) => theme.palette.paperHighlight.contrastText};
    }
  }
  .Toastify__toast--error {
    .Toastify__progress-bar {
      background: ${({ theme }) => theme.palette.warning.main};
    }
    .Toastify__toast-icon {
      color: ${({ theme }) => theme.palette.warning.main};
    }
  }
  .Toastify__toast--success {
    .Toastify__progress-bar {
      background: ${({ theme }) => theme.palette.success.main};
    }
    .Toastify__toast-icon {
      color: ${({ theme }) => theme.palette.success.main};
    }
  }
`;

function AppLayout() {
  const user = useRecoilValue(currentUserSelector);

  let links = [{ to: '/login/register', title: 'Register', serverSide: false }];

  if (user) {
    links = [
      { to: '/account/dashboard', title: 'Dashboard', serverSide: true },
      { to: '/login/user', title: 'Edit Profile', serverSide: false },
    ];
  }

  return (
    <Layout isLoggedIn={Boolean(user)} links={links}>
      <ErrorBoundry>
        <AppRoutes />
      </ErrorBoundry>
    </Layout>
  );
}

export function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <ThemeProvider theme={appTheme}>
          <Suspense fallback={<Loader />}>
            <StyledToastContainer />
            <AppLayout />
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}
