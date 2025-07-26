import { useEffect, useState } from 'react';
import styles from './Review.module.css'
import Header from '../components/Header';
import ImageSlider from '../components/detail/ImageSlider';
import TopButton from '../components/util/TopButton';
import ReviewInfo from '../components/detail/ReviewInfo';
import ReveiwContractInfo from '../components/detail/ReviewContractInfo';
import ReviewMapInfo from '../components/detail/ReviewMapInfo';
import { useRecoilState } from 'recoil';
import { ReviewInfoState } from '../recoil/detail/ReviewInfoRecoliState';
import Footer from '../components/detail/Footer';
import ReportButton from '../components/util/ReportButton';
import exampleImage1 from '../assets/image/example_image1.png';
import exampleImage2 from '../assets/image/example_image2.png';
import ReviewFacilitiesInfo from '../components/detail/ReviewFacilitiesInfo';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useReviewDetail } from '../hooks/useReviewDetail';


const Review: React.FC = () => {
    const navigate = useNavigate();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [reviews, setReviews] = useRecoilState(ReviewInfoState);
    
    const { reviewId } = useParams(); // /building/rv/:reviewId 형식이라면 필요
    const [searchParams] = useSearchParams();
    const reviewType = searchParams.get("reviewType") ?? "GENERAL"; // 쿼리에서 추출

    const { data, isLoading, isError } = useReviewDetail(reviewId ?? "", reviewType);

    const loginUserId = 1;

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.visualViewport?.height || window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        
        // 초기 로드 시 한 번 실행
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    })

    useEffect(() => {
        if (data) {
        setReviews(data);
        }
    }, [data]);
        
    const handleBack = () => {
        navigate(-1);
    };

    if (isLoading) return <div>로딩 중...</div>;
    if (isError || !data) return <div>리뷰 정보를 불러오지 못했습니다.</div>;


    return (
        <div className={styles.content}
        style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            <div className={styles.container}>
                {/* 헤더 */}
                <Header onClick={handleBack}/>
                {/* 이미지슬라이더 */}
                <ImageSlider review={reviews} building={null}/>
                {/* 리뷰 정보 및 키워드 */}
                <ReviewInfo review={reviews}/>
                <hr className={styles.divider} style={{marginTop:"50px"}}/>
                {/* 계약형태 */}
                {reviews.generalReviewInfo && (
                    <>
                    <ReveiwContractInfo review={reviews}/>
                    <hr className={styles.divider}/>
                    </>
                )}
                {reviews.domitoryReviewInfo && (
                     <>
                     <ReveiwContractInfo review={reviews}/>
                     <hr className={styles.divider}/>
                     <ReviewFacilitiesInfo review={reviews}/>
                     <hr className={styles.divider}/>
                     </>
                )}
                {/* 단지정보 */}
                <ReviewMapInfo review={reviews}/>
            </div>
            {/* 작성id === 로그인 id 같으면 Footer 보이게+reportBtn안보이게, 아니면 반대 */}
            { loginUserId == reviews.authorId ? 
                <div className={styles.fixedWrap}>
                    <TopButton/>
                    <Footer/>
                </div>
                : 
                <div className={styles.fixedWrap}>
                    <ReportButton/>
                    <TopButton/>
                </div>
            }
        </div>
    )
}

export default Review;