import React, { useEffect, useState, useMemo, useRef } from "react";
import { useRecoilState , useRecoilValue } from "recoil";
import styles from "./HeartListPage.module.css";
import Banner from "../components/Banner";
import PreviewReview from "../components/PreviewReview";
import downIcon from "../assets/image/downIcon.svg";
import campus_img_1 from "../assets/image/campusImg1.svg";
import FilterModal from "../components/hartListPage/FilterModal";
import { filterConfigState } from "../recoil/hartListPage/filterConfigState";
import emptyCharacterIcon from "../assets/image/emptyCharacterIcon.svg";
import PreviewBuildingReview from "../components/detail/PreviewBuildingReview";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAPI, putAPI, deleteAPI } from "../api/bassAPI";
import { isLoginState } from "../recoil/auth/isLoginState";

const QUERY_KEYS = {
  heartListData: "heartListData",
};

const Heart: React.FC = () => {
  const [filterConfig, setFilterConfig] = useRecoilState(filterConfigState);
  const isLogin = useRecoilValue(isLoginState);

  const queryClient = useQueryClient();

  const {
    data: heartListData,
    isFetching: isFetchingHeartList,
    isError: isErrorHeartList,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.heartListData, filterConfig.sortBy, filterConfig.type],
    queryFn: async () => {
      const response = await getAPI(
        `api/v1/user/bookmark?sortBy=${filterConfig.sortBy}&type=${filterConfig.type}`,
        true
      );
      return response.data;
    },
    enabled: isLogin,
    refetchOnWindowFocus: false,
  });

  const validHeartListData = isLogin ? heartListData : [];

  if (isFetchingHeartList) {
    console.log("로딩 중...");
    return null;
  }

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
            combinedData.map((review: any) => (
              <div key={review.id + review.type} style={{ width: "100%" }}>
                <div className={styles.line} />
                {review.type === "REVIEW" ? (
                  <PreviewReview review={review} />
                ) : null}
                {review.type === "BUILDING" ? (
                  <PreviewBuildingReview review={review} />
                ) : null}
              </div>
            ))
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
