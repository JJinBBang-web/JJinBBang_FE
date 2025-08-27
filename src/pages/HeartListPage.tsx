import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./HeartListPage.module.css";
import Banner from "../components/Banner";
import PreviewReview from "../components/PreviewReview";
import downIcon from "../assets/image/downIcon.svg";
import campus_img_1 from "../assets/image/campusImg1.svg";
import FilterModal from "../components/hartListPage/FilterModal";
import { filterConfigState } from "../recoil/hartListPage/filterConfigState";
import emptyCharacterIcon from "../assets/image/emptyCharacterIcon.svg";
import PreviewBuildingReview from "../components/detail/PreviewBuildingReview";
import {
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { getAPI, putAPI, deleteAPI } from "../api/baseAPI";
import { isLoginState } from "../recoil/auth/isLoginState";

const QUERY_KEYS = {
  heartListData: "heartListData",
};

const Heart: React.FC = () => {
  const [filterConfig, setFilterConfig] = useRecoilState(filterConfigState);
  const isLogin = useRecoilValue(isLoginState);

  const queryClient = useQueryClient();
  const observer = useRef<IntersectionObserver | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      QUERY_KEYS.heartListData,
      filterConfig.sortBy,
      filterConfig.type,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getAPI(
        `api/v1/user/bookmark?sortBy=${filterConfig.sortBy}&type=${filterConfig.type}&page=${pageParam}&size=5`,
        true
      );
      return response.data;
    },
    enabled: isLogin,
    refetchOnWindowFocus: false,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 5) return undefined;
      return allPages.length;
    },
  });

  // 모든 페이지의 데이터를 하나로 합치기
  const heartListData = data?.pages.flatMap((page) => page) || [];
  const validHeartListData = isLogin ? heartListData : [];

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "100px",
        }
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  // 컴포넌트 언마운트 시 observer 정리
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
      setFilterConfig((prev) => ({
        ...prev,
        isOpen: false,
      }));
    };
  }, []);

  const combinedData = validHeartListData.map((review: any) => {
    const combinedId =
      review.agencyReviewInfo?.id ??
      review.generalReviewInfo?.id ??
      review.dormitoryReviewInfo?.id ??
      review.generalBuildingInfo?.id ??
      review.dormitoryBuildingInfo?.id ??
      review.agencyBuildingInfo?.id;
    let combinedType;
    if (
      review.agencyReviewInfo ||
      review.generalReviewInfo ||
      review.dormitoryReviewInfo
    ) {
      combinedType = "REVIEW";
    } else if (
      review.generalBuildingInfo ||
      review.dormitoryBuildingInfo ||
      review.agencyBuildingInfo
    ) {
      combinedType = "BUILDING";
    }

    return {
      ...review,
      id: combinedId,
      type: combinedType,
    };
  });

  // 초기 로딩 상태
  if (isLoading) {
    return null;
  }

  // 에러 상태
  if (isError) {
    return null
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header} />
        <Banner />
        <div className={styles.bookmarkContainer}>
          <div className={styles.filterContainer}>
            <div
              className={styles.filter}
              onClick={() =>
                setFilterConfig((prev) => ({
                  ...prev,
                  isOpen: !prev.isOpen,
                }))
              }
            >
              <p className={styles.filterText}>필터</p>
              <img className={styles.filterImg} src={downIcon} alt="downIcon" />
            </div>
          </div>

          {combinedData.length > 0 ? (
            <>
              {combinedData.map((review: any, index: number) => (
                <div
                  key={review.id + review.type}
                  style={{ width: "100%" }}
                  ref={
                    index === combinedData.length - 1 ? lastElementRef : null
                  }
                >
                  <div className={styles.line} />
                  {review.type === "REVIEW" ? (
                    <PreviewReview review={review} />
                  ) : null}
                  {review.type === "BUILDING" ? (
                    <PreviewBuildingReview review={review} />
                  ) : null}
                </div>
              ))}

              {/* 추가 로딩 표시 */}
              {isFetchingNextPage && (
                <div className={styles.additionalLoading}>
                  <p>더 불러오는 중...</p>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noReviewContainer}>
              <div className={styles.line} />
              <div className={styles.noReviewImgContainer}>
                <img src={emptyCharacterIcon} alt="빈 캐릭터 아이콘" />
                <p className={styles.noReviewText}>
                  {isLogin
                    ? "앗! 아직 관심목록이 없어요!"
                    : "로그인 후 이용가능해요!"}
                  <br />
                  {isLogin
                    ? "지도에서 내 주변 찐빵을 둘러볼까요?"
                    : "학교 인증 후 관심목록 기능을 이용해보세요!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <FilterModal />
    </>
  );
};

export default Heart;
