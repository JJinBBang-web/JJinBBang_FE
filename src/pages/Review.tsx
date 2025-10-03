import { useEffect, useState } from "react";
import styles from "./Review.module.css";
import Header from "../components/Header";
import ImageSlider from "../components/detail/ImageSlider";
import TopButton from "../components/util/TopButton";
import ReviewInfo from "../components/detail/ReviewInfo";
import ReveiwContractInfo from "../components/detail/ReviewContractInfo";
import ReviewMapInfo from "../components/detail/ReviewMapInfo";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ReviewInfoState } from "../recoil/detail/ReviewInfoRecoliState";
import Footer from "../components/detail/Footer";
import ReportButton from "../components/util/ReportButton";
import ReviewFacilitiesInfo from "../components/detail/ReviewFacilitiesInfo";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useReviewDetail } from "../hooks/useReviewDetail";
import { updateReviewState } from "../recoil/review/updateReviewAtoms";
import { convertToReviewState } from "../util/convertToReviewState";
import { isLoginState } from "../recoil/auth/isLoginState";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "../api/baseAPI";
import Modal from "../components/review/Modal";
import { hideNavState } from "../recoil/util/modalState";
import iconClose from "../assets/image/iconClose.svg";
import verifiedCharacter from "../assets/image/verifiedSheetCharacter.svg";

const Review: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [reviews, setReviews] = useRecoilState(ReviewInfoState);
  const setUpdateReview = useSetRecoilState(updateReviewState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setHideNav = useSetRecoilState(hideNavState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(false);

  const { reviewId } = useParams(); // /building/rv/:reviewId 형식이라면 필요
  const [searchParams] = useSearchParams();
  const reviewType = searchParams.get("reviewType") ?? "GENERAL"; // 쿼리에서 추출

  const { data, isLoading, isError } = useReviewDetail(
    reviewId ?? "",
    reviewType
  );

  // 토큰 여부 확인
  useEffect(() => {
      const token = sessionStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
  }, []);

  // 미인증 여부 확인
  useEffect(() => {
      const verification = sessionStorage.getItem("verificationStatus");
      setVerificationStatus(verification === 'unverified');
  }, []);

  const { data: userData, isSuccess: isSuccessUser } = useQuery({
    queryKey: [location.pathname],
    queryFn: async () => {
      const response = await getAPI(`/api/v1/user`, true);
      return response.data;
    },
    enabled: isLoggedIn,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.visualViewport?.height || window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    // Recent review tracking removed - rely on API-based analytics instead

    // 초기 로드 시 한 번 실행
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    if (!isSuccessUser) return;
    const reviewDict = JSON.parse(localStorage.getItem("reviewList") || "{}");
    let reviewList = reviewDict[userData.id] || [];


    if (reviewList.includes(Number(reviewId))) {
      reviewList = reviewList.filter((review: number) => review !== Number(reviewId));
    }
    if (reviewList.length >= 5) {
      reviewList.pop();
    }
    reviewList.unshift(Number(reviewId));
    reviewDict[userData.id] = reviewList;

    localStorage.setItem("reviewList", JSON.stringify(reviewDict));
  }, [isSuccessUser]);

  useEffect(() => {
    if (data) {
      setReviews(data);
      const converted = convertToReviewState(data);
      setUpdateReview(converted);
    }
  }, [data]);

  useEffect(() => {
    if (location.state?.from === "update-exit") {
      // ✅ 리뷰B(방금 replace로 온 엔트리)를 pop 해서 리뷰A로 이동
      navigate(-1);
    }
  }, [location.state, navigate]);

  const handleBack = () => {
    // location.state에서 from 정보 확인
    if (location.state?.from === 'mypage') {
      navigate('/mypage');
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleCloseModal = () => {
    setHideNav(false);
  };

  const handleToAuth = () => {
    if (!isLoggedIn) {
      setHideNav(false);
      setIsModalOpen(false);
      navigate(`/mypage`);
    } else {
      setHideNav(false);
      setIsModalOpen(false);
      navigate(`/auth/student/verify`);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  else if (!isLoggedIn || verificationStatus)
    return (
      <>
        <Modal onClose={handleCloseModal} style={{ zIndex: 999 }}>
          <div className={styles.wrap2}>
            <div className={styles.sheet_header}>
              <div className={styles.header_divider}></div>
            </div>
            <div className={styles.sheet_title_wrap}>
              <div className={styles.sheet_info_wrap}>
                <p className={styles.sheet_title}></p>
              </div>
              <img src={iconClose} width="24px" onClick={handleCloseModal} />
            </div>
            <div className={styles.sheetWrap}>
              <img src={verifiedCharacter} />
              <p className={styles.sheetText}>
                학교 인증 후<br />
                찐빵의 찐거주 후기들을
                <br />
                무료 열람해보세요!
              </p>
            </div>
            <div className={styles.btnWrap}>
              <button className={styles.confirmBtn} onClick={handleToAuth}>
                학교 인증하기
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  if (isError || !data) return <div>리뷰 정보를 불러오지 못했습니다.</div>;

  return (
    <div
      className={styles.content}
      style={{
        minHeight: `${windowHeight}px`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className={styles.container}>
        {/* 헤더 */}
        <Header onClick={handleBack} />
        {/* 이미지슬라이더 */}
        <ImageSlider review={reviews} building={null} />
        {/* 리뷰 정보 및 키워드 */}
        <ReviewInfo review={reviews} />
        <hr className={styles.divider} style={{ marginTop: "50px" }} />
        {/* 계약형태 */}
        {reviews.generalReviewInfo && (
          <>
            <ReveiwContractInfo review={reviews} />
            <hr className={styles.divider} />
          </>
        )}
        {reviews.dormitoryReviewInfo && (
          <>
            <ReveiwContractInfo review={reviews} />
            <hr className={styles.divider} />
            <ReviewFacilitiesInfo review={reviews} />
            <hr className={styles.divider} />
          </>
        )}
        {/* 단지정보 */}
        <ReviewMapInfo review={reviews} />
      </div>
      {/* 작성id === 로그인 id 같으면 Footer 보이게+reportBtn안보이게, 아니면 반대 */}
      {userData?.id === reviews.authorId ? (
        <div className={styles.fixedWrap}>
          <TopButton />
          <Footer reviewId={reviewId ?? ""} />
        </div>
      ) : (
        <div className={styles.fixedWrap}>
          <ReportButton reviewId={reviewId} />
          <TopButton />
        </div>
      )}
    </div>
  );
};

export default Review;
