// src/App.tsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  matchPath,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import Heart from "./pages/HeartListPage";
import MyPage from "./pages/MyPage";
import Nav from "./components/Nav";
import Building from "./pages/Building";
import Review from "./pages/Review";
import ReportPage from "./pages/ReportPage";
import UpdateBuildTypePage from "./pages/update/UpdateBuildTypePage";
import UpdateConfirmPage from "./pages/update/UpdateConfirmPage";
import LoginResultPage from "./pages/LoginResultPage";
import MyAccountPage from "./pages/auth/MyAccountPage";
import AccountAuthPage from "./pages/auth/AccountAuthPage";
import NewStudentVerification from "./pages/auth/NewStudentVerification";
import CurrentStudentVerification from "./pages/auth/CurrentStudentVerification";
import ReviewTypePage from "./pages/review/ReviewTypePage";
import AddressInputPage from "./pages/review/AddressInputPage";
import AddressSearchPage from "./pages/review/AddressSearchPage";
import AddressResultPage from "./pages/review/AddressResultPage";
import DormitoryInputPage from "./pages/review/DormitoryInputPage";
import DormitoryConditionsPage from "./pages/review/DormitoryConditionsPage";
import DormitoryAmenitiesPage from "./pages/review/DormitoryAmenitiesPage";
import FloorInputPage from "./pages/review/FloorInputPage";
import AgencyInputPage from "./pages/review/AgencyInputPage";
import PaymentTypePage from "./pages/review/PaymentTypePage";
import JeonseInputPage from "./pages/review/JeonseInputPage";
import WolseInputPage from "./pages/review/WolseInputPage";
import RoomInfoPage from "./pages/review/PhotoUploadPage";
import ReviewAdvantagePage from "./pages/review/ReviewAdvantagePage";
import ReviewDisadvantagePage from "./pages/review/ReviewDisadvantagePage";
import ReviewContentPage from "./pages/review/ReviewContentPage";
import ReviewConfirmPage from "./pages/review/ReviewConfirmPage";
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { isLoginState } from "./recoil/auth/isLoginState";
import { getAPI } from "./api/baseAPI";
import { useQuery } from "@tanstack/react-query";
import ModalBottomSheet from "./components/util/ModalBottomSheet";
import { tokenStore } from "./api/api";
import { authApi } from "./api/auth";
import UpdateAddressInputPage from "./pages/update/UpdateAddressInputPage";
import UpdateContractTypePage from "./pages/update/UpdateContractTypePage";
import UpdateContractPricePage from "./pages/update/UpdateContractPricePage";
import UpdateAdventagePage from "./pages/update/UpdateAdventagePage";
import UpdateDisadventagePage from "./pages/update/UpdateDisadventagePage";
import UpdateContentPage from "./pages/update/UpdateContentPage";
import UpdateAddressSearchPage from "./pages/update/UpdateAddressSearchPage";
import UpdateFloorInputPage from "./pages/update/UpdateFloorInputPage";
import UpdateDormitoryInputPage from "./pages/update/UpdateDormitoryInputPage";
import UpdateDormitoryConditionsPage from "./pages/update/UpdateDormitoryConditionsPage";
import UpdateDormitoryAmenitiesPage from "./pages/update/UpdateDormitoryAmenitiesPage";
import { hideNavState } from "./recoil/util/modalState";
import TagManager from "react-gtm-module";
import UpdatePhotoUploadPage from "./pages/update/UpdatePhotoUploadPage";
import ContentPage from "./pages/content/Content";
import ContentDetail from "./pages/content/ContentDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      // retry: false, // 재시도 비활성화
      // retry: 5,   // 5번 재시도
    },
  },
});
const AppContent: React.FC = () => {
  const location = useLocation();
  const [isLogin, setIsLoggedIn] = useRecoilState(isLoginState);
  const hideNav = useRecoilValue(hideNavState);
  const setHideNav = useSetRecoilState(hideNavState);
  const [isInitializing, setIsInitializing] = React.useState(true);
  
  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: "pageview",
        pagePath: location.pathname,
      },
    });
  }, [location]);

  // 앱 초기화 시 토큰 갱신 (race condition 방지)
  useEffect(() => {
    const initializeAuth = async () => {
      // 메모리에 액세스 토큰이 없으면 리프레시 토큰으로 갱신 시도
      if (!tokenStore.getAccessToken()) {
        try {
          await authApi.refreshAccessToken();
        } catch (error) {
          // 리프레시 토큰도 없거나 만료됨 (정상 동작)
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  // 경로 변환 시 nav 초기화
  useEffect(() => {
    setHideNav(false);
  }, [location.pathname, setHideNav]);

  const {
    data: userData,
    isFetching: isFetchingUser,
    isError: isErrorUser,
    isSuccess: isSuccessUser,
  } = useQuery({
    queryKey: [location.pathname],
    queryFn: async () => {
      const currentAccessToken = tokenStore.getAccessToken();
      if (!currentAccessToken) throw new Error();
      const response = await getAPI(`/api/v1/user`, true);
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: !isInitializing, // 초기화가 완료될 때까지 쿼리 실행 안함
  });

  useEffect(() => {
    if (isSuccessUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isSuccessUser]);

  const hiddenNavPaths = [
    "/auth/*",
    "/myaccount",
    "/review/*",
    "/building/:buildingId",
    "/building/review/:reviewId",
    "/building/review/:reviewId/report",
    "/content/:reportId",
  ];

  const showHeaderAndNav = !hiddenNavPaths.some((pattern) =>
    matchPath({ path: pattern, end: false }, location.pathname)
  ) && !hideNav;

  return (
    <>
      {showHeaderAndNav}
      <Routes>
        <Route path="/login/result" element={<LoginResultPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/heart" element={<Heart />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/myaccount" element={<AccountAuthPage />} />
        <Route path="/auth">
          <Route path="student">
            <Route path="verify" element={<MyAccountPage />} />
            <Route path="new" element={<NewStudentVerification />} />
            <Route path="current" element={<CurrentStudentVerification />} />
          </Route>
        </Route>
        <Route path="/review">
          <Route path="type" element={<ReviewTypePage />} />
          <Route path="input-address" element={<AddressInputPage />} />
          <Route path="address" element={<AddressSearchPage />} />
          <Route path="dormitory" element={<DormitoryInputPage />} />
          <Route
            path="dormitory-conditions"
            element={<DormitoryConditionsPage />}
          />
          <Route
            path="dormitory-amenities"
            element={<DormitoryAmenitiesPage />}
          />

          <Route path="result" element={<AddressResultPage />} />
          <Route path="floor" element={<FloorInputPage />} />
          <Route path="agency" element={<AgencyInputPage />} />
          <Route path="price" element={<PaymentTypePage />} />
          <Route path="jeonse" element={<JeonseInputPage />} />
          <Route path="wolse" element={<WolseInputPage />} />
          <Route path="room-info" element={<RoomInfoPage />} />
          <Route path="filter-ad" element={<ReviewAdvantagePage />} />
          <Route path="filter-disad" element={<ReviewDisadvantagePage />} />
          <Route path="content" element={<ReviewContentPage />} />
          <Route path="confirm" element={<ReviewConfirmPage />} />
        </Route>
       <Route path="/building/:buildingId" element={<Building />} />
      <Route path="/building/review/:reviewId" element={<Review />} />
      <Route path="/building/review/:reviewId/report" element={<ReportPage />} />
      <Route path="/review/:reviewId/update" element={<UpdateConfirmPage/>}/>
      <Route path="/review/:reviewId/update/type" element={<UpdateBuildTypePage/>}/>
      <Route path="/review/:reviewId/update/input-address" element={<UpdateAddressInputPage/>}/>
      <Route path="/review/:reviewId/update/address" element={<UpdateAddressSearchPage/>}/>
      <Route path="/review/:reviewId/update/floor" element={<UpdateFloorInputPage/>}/>
      <Route path="/review/:reviewId/update/contract" element={<UpdateContractTypePage/>}/>
      <Route path="/review/:reviewId/update/contract/price" element={<UpdateContractPricePage/>}/>
      <Route path="/review/:reviewId/update/filter-ad" element={<UpdateAdventagePage/>}/>
      <Route path="/review/:reviewId/update/filter-disad" element={<UpdateDisadventagePage/>}/>
      <Route path="/review/:reviewId/update/content" element={<UpdateContentPage/>}/>
      <Route path="/review/:reviewId/update/dormitory" element={<UpdateDormitoryInputPage />} />
      <Route path="/review/:reviewId/update/dormitory-conditions" element={<UpdateDormitoryConditionsPage />} />
      <Route path="/review/:reviewId/update/dormitory-amenities" element={<UpdateDormitoryAmenitiesPage />} />
      <Route path="/review/:reviewId/update/photo-upload" element={<UpdatePhotoUploadPage />} />
      <Route path="/content" element={<ContentPage/>}/>
      <Route path="/content/:reportId" element={<ContentDetail/>} />
      </Routes>
      {showHeaderAndNav && <Nav />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient} >
        <BrowserRouter>
          <AppContent />
          <ModalBottomSheet />
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
