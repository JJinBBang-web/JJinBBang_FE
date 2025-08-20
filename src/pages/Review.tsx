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
} from 'react-router-dom';
import { useReviewDetail } from '../hooks/useReviewDetail';
import { updateReviewState } from '../recoil/review/updateReviewAtoms';
import { convertToReviewState } from '../util/convertToReviewState';
import { isLoginState } from '../recoil/auth/isLoginState';
import { useQuery } from '@tanstack/react-query';
import { getAPI } from '../api/baseAPI';

const Review: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [reviews, setReviews] = useRecoilState(ReviewInfoState);
  const setUpdateReview = useSetRecoilState(updateReviewState);

  const { reviewId } = useParams(); // /building/rv/:reviewId 형식이라면 필요
  const [searchParams] = useSearchParams();
  const reviewType = searchParams.get("reviewType") ?? "GENERAL"; // 쿼리에서 추출

  const { data, isLoading, isError } = useReviewDetail(
    reviewId ?? "",
    reviewType
  );
  const [isLogin] = useRecoilState(isLoginState);
  const { data: userData } = useQuery({
    queryKey: [location.pathname],
    queryFn: async () => {
      const response = await getAPI(`/api/v1/user`, true);
      return response.data;
    },
    enabled: isLogin,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.visualViewport?.height || window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    const reviewList = JSON.parse(localStorage.getItem('reviewList') || '[]');

    if (!reviewList || reviewList.length >= 5) {
      reviewList.shift(); // 첫 번째 요소 제거
    }
    if (!reviewList.includes(Number(reviewId))) {
      reviewList.push(Number(reviewId));
    }
    localStorage.setItem('reviewList', JSON.stringify(reviewList));
    console.log('리뷰 리스트:', reviewList);

    // 초기 로드 시 한 번 실행
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  });

  useEffect(() => {
    if (data) {
      setReviews(data);
      const converted = convertToReviewState(data);
      console.log(data);
      setUpdateReview(converted);
      localStorage.setItem('updateReviewState', JSON.stringify(converted));
    }
  }, [data]);

  const handleBack = () => {
    navigate(`/map`);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !data) return <div>리뷰 정보를 불러오지 못했습니다.</div>;

  return (
    <div
      className={styles.content}
      style={{
        minHeight: `${windowHeight}px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className={styles.container}>
        {/* 헤더 */}
        <Header onClick={handleBack} />
        {/* 이미지슬라이더 */}
        <ImageSlider review={reviews} building={null} />
        {/* 리뷰 정보 및 키워드 */}
        <ReviewInfo review={reviews} />
        <hr className={styles.divider} style={{ marginTop: '50px' }} />
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
          <Footer reviewId={reviewId ?? ''} />
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
