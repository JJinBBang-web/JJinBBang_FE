import React from 'react';
import logo from './logo.svg';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Map from './pages/Map';
import Heart from './pages/HeartListPage';
import MyPage from './pages/MyPage';
import Nav from './components/Nav';
import { RecoilRoot } from 'recoil';
import ModalBottomSheet from './components/util/ModalBottomSheet';

const queryClient = new QueryClient()

const AppContent: React.FC = () => {
  const location = useLocation();

  // TODO : 로그인 추가


  const showHeaderAndNav = ![
    // TODO : header, Nav 안들어가는 라우터 표시
    '',''
  ].includes(location.pathname);

  // TODO : 나중에 showHeaderAndNav && <Header/> 헤더 추가
  return (
    <>
      {showHeaderAndNav}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/map' element={<Map />} />
        <Route path='/heart' element={<Heart />} />
        <Route path='/mypage' element={<MyPage />}/>
      </Routes>
      {showHeaderAndNav && <Nav />}
    </>
  )
}

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppContent />
          <ModalBottomSheet/>
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
};
export default App;
