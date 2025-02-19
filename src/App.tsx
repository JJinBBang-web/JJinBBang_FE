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
import KakaoCallback from './pages/auth/KakaoCallback';
import KakaoAuthPage from './pages/auth/KakaoAuthPage';
import AccountAuthPage from './pages/auth/AccountAuthPage';
import NewStudentVerification from './pages/auth/NewStudentVerification';
import CurrentStudentVerification from './pages/auth/CurrentStudentVerification';
import { RecoilRoot } from 'recoil';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const location = useLocation();

  const showHeaderAndNav = ![
    '/auth/verify',
    '/auth/signup',
    '/auth/login',
    '/myaccount',
    '/auth/student/new',
    '/auth/student/current',
    '/auth/kakao',
    '/auth/kakao/callback',
  ].includes(location.pathname);

  return (
    <>
      {showHeaderAndNav}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/heart" element={<Heart />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/myaccount" element={<AccountAuthPage />} />
        <Route path="/auth">
          <Route path="verify" element={<EmailVerificationPage />} />
          <Route path="kakao" element={<KakaoAuthPage />} />
          <Route path="kakao/callback" element={<KakaoCallback />} />
          <Route path="student">
            <Route path="new" element={<NewStudentVerification />} />
            <Route path="current" element={<CurrentStudentVerification />} />
          </Route>
        </Route>
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
