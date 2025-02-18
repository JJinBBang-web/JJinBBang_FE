// src/App.tsx
import React from 'react';
import logo from './logo.svg';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Map from './pages/Map';
import Heart from './pages/HeartListPage';
import MyPage from './pages/MyPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import Nav from './components/Nav';
import { RecoilRoot } from 'recoil';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const location = useLocation();

  // auth 경로에서는 Nav를 표시하지 않음
  const showHeaderAndNav = ![
    '/auth/verify',
    '/auth/signup',
    '/auth/login',
  ].includes(location.pathname);

  return (
    <>
      {showHeaderAndNav}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/heart" element={<Heart />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/auth/*" element={<EmailVerificationPage />} />
      </Routes>
      {showHeaderAndNav && <Nav />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
