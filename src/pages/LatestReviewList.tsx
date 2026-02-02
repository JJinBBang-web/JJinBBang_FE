import { useNavigate, useLocation } from "react-router-dom";
import styles from "./LatestReviewList.module.css";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import PreviewReview from "../components/PreviewReview";
import { isLoginState } from "../recoil/auth/isLoginState";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "../api/baseAPI";
import { useRecoilValue } from "recoil";

const getReviewKey = (review: any) => {
  if (review.generalReviewInfo) return `general-${review.generalReviewInfo.id}`;
  if (review.dormitoryReviewInfo)
    return `dormitory-${review.dormitoryReviewInfo.id}`;
  if (review.agencyReviewInfo) return `agency-${review.agencyReviewInfo.id}`;
  return 'unknown';
};

const QUERY_KEYS = {
  userData: 'USER_DATA',
  campusData: 'CAMPUS_DATA',
  reviewData: 'RECENT_REVIEW_DATA',
  univData: 'UNIV_DATA',
};

const LatestReveiwList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const isLogin = useRecoilValue(isLoginState);

    const {
        data: userData,
        isFetching: isFetchingUser,
        isError: isErrorUser,
      } = useQuery({
        queryKey: [QUERY_KEYS.userData],
        queryFn: async () => {
          const response = await getAPI(`/api/v1/user`, true);
          return response.data;
        },
        enabled: isLogin,
        refetchOnWindowFocus: false,
    });

    const reviewDict = JSON.parse(localStorage.getItem("reviewList") || "{}");

    const reviewList = reviewDict[userData?.id] || "[]";

    const {
        data: reviewData,
        isFetching: isFetchingReviewInfo,
        isError: isErrorReviewInfo,
    } = useQuery({
        queryKey: [QUERY_KEYS.reviewData],
        queryFn: async () => {
        if (!reviewList) {
            return [];
        }
        const response = await getAPI(
            `/api/v1/user/recentReview?reviewIds=${reviewList}`,
            true
        );
        return response.data;
        },
        enabled: isLogin && !!reviewDict && !!userData,
        refetchOnWindowFocus: false,
    });

    const validReviewData =
        Array.isArray(reviewData) && isLogin ? reviewData : [];
    
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.visualViewport?.height || window.innerHeight);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    });

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, []);

    const handleBack = () => {
        // location.state에서 from 정보 확인
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };
      
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
                <Header onClick={handleBack} title="최근 본 찐빵 후기" type="title"/>
                <div className={styles.previewReviewContainer}>
                {validReviewData.map((review: any) => {
                    return (
                    <div key={getReviewKey(review)}>
                        <div className={styles.line} />
                        <PreviewReview review={review} trackStep="1.1_home_PreviewReview" />
                    </div>
                    );
                })}
            </div>
            </div>
        </div>
    )
};


export default LatestReveiwList;