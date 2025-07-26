import React, { useEffect, useState, useMemo } from "react";
import { useRecoilState } from "recoil";
import styles from "./HeartListPage.module.css";
import Banner from "../components/Banner";
import PreviewReview from "../components/PreviewReview";
import downIcon from "../assets/image/downIcon.svg";
import campus_img_1 from "../assets/image/campusImg1.svg";
import FilterModal from "../components/hartListPage/FilterModal";
import { isFilterModalOpenState } from "../recoil/hartListPage/isFilterModalOpenState";
import emptyCharacterIcon from "../assets/image/emptyCharacterIcon.svg";
import BuildingPreviewReview from "../components/detail/BuildingPreviewReview";

const api = {
  code: 200,
  message: "조회 성공",
  data: {
    reviews: [
      {
        dormitoryReviewInfo: {
          id: 1,
          name: "지희관",
          universityName: "경상국립대학교",
          type: "DORMITORY",
          floor: "HIGH", // 옥탑방은 0, 반지하는 -1
          capacity: 2,
          dormFee: 10,
          rating: 3,
          liked: true, // false
        },
        reviewInfo: {
          content:
            "집이 너무 깔끔하고 좋아요. 다만 조식이 맛이 없어요. 다른 기숙사에 비해 조식이 맛이 없어요. 하지만 조식이 맛이 좋아요",
          keyword: [
            "PO_BD_LO_02",
            "PO_BD_LO_01",
            "PO_BD_LO_04",
            "PO_BD_LO_01", // ... 필요한 키워드 추가
            "PO_BD_LO_01",
          ],
          likeCount: 120,
          updateAt: "2025-02-23T04:06:00.000+09:00", // yyyy-MM-dd'T'HH:mm:ss.SSSXXX 형식
        },
        image: "http://localhost:8080/image/1.jpg",
      },
      {
        generalReviewInfo: {
          id: 2,
          name: "한솔원룸",
          type: "ROOM",
          contractType: "MONTHLY_RENT",
          deposit: 2000,
          monthlyRent: 0,
          floor: "LOW",
          space: 35.5,
          maintenanceCost: 5,
          rating: 4,
          liked: false,
        },
        reviewInfo: {
          content: "주변이 조용하고 살기 좋아요.",
          keyword: [
            "PO_BD_LO_02",
            "PO_BD_LO_01",
            "PO_BD_LO_04",
            "PO_BD_LO_01", // ... 필요한 키워드 추가
            "PO_BD_LO_01",
          ],
          likeCount: 18,
          updateAt: "2025-02-23T04:06:00.000+09:00",
        },
        image: campus_img_1,
      },
      // {
      //   agencyReviewInfo: {
      //     id: 1,
      //     name: "1",
      //     type: "AGENCY",
      //     rating: 1,
      //     liked: false,
      //   },
      //   reviewInfo: {
      //     content: "1",
      //     keyword: ["PO_BD_LO_01"],
      //     likeCount: 1,
      //     updateAt: "2025-02-23T04:06:00.000+09:00",
      //   },
      //   image: "http://localhost:8080/image/1.jpg",
      // },
    ] as any[],
  },
};

const Heart: React.FC = () => {
  const [isOpen, setIsOpen] = useRecoilState(isFilterModalOpenState);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header} />
        <Banner />
        <div className={styles.bookmarkContainer}>
          <div className={styles.filterContainer}>
            <div
              className={styles.filter}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <p className={styles.filterText}>필터</p>
              <img className={styles.filterImg} src={downIcon} alt="downIcon" />
            </div>
          </div>
          {api.data.reviews.length > 0 ? (
            api.data.reviews.map((review) => (
              <div key={review.basicInfo?.id ?? review.dormitoryBasicInfo?.id}>
                <div className={styles.line} />
                <BuildingPreviewReview review={review} />
              </div>
            ))
          ) : (
            <div className={styles.noReviewContainer}>
              <div className={styles.line} />
              <img src={emptyCharacterIcon} alt="빈 캐릭터 아이콘" />
              <p className={styles.noReviewText}>
                앗! 아직 관심목록이 없어요!
                <br />
                지도에서 내 주변 찐빵을 둘러볼까요?
              </p>
            </div>
          )}
        </div>
      </div>
      <FilterModal />
    </>
  );
};

export default Heart;
