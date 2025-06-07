// src/pages/review/ReviewConfirmPage.tsx
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  reviewState,
  defaultReviewState,
} from "../../recoil/review/reviewAtoms";
import {
  JjinFilterState,
  JjinAgencyFilterState,
} from "../../recoil/util/filterRecoilState";
import { tagMessages, tagLongMessages } from "../../components/Tag";
import styles from "../../styles/review/ReviewConfirm.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import ArrowIcon from "../../assets/image/arrowIcon.svg";
import starFilledIcon from "../../assets/image/starIconOnRed.svg";
import starEmptyIcon from "../../assets/image/starIconOff.svg";
import checkIcon from "../../assets/image/checkIconActive.svg";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import { housingTypeState } from "../../recoil/map/mapRecoilState";

interface LocationState {
  address?: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  buildingName?: string;
  floor?: string;
  paymentType?: string;
  priceData?: {
    deposit: number;
    monthlyRent?: number;
    managementFee: number;
  };
  photos?: string[];
  advantages?: string[];
  disadvantages?: string[];
  content?: string;
  from?: string;
  housingType?: string;
}

const ReviewConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState) || {};

  const [review, setReview] = useRecoilState(reviewState);
  console.log(review);
  const filters = useRecoilValue(JjinFilterState);
  const agencyFilters = useRecoilValue(JjinAgencyFilterState);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // 컴포넌트 마운트 시 저장된 상태 로드
  useEffect(() => {
    const savedState = localStorage.getItem("reviewState");
    if (savedState) {
      setReview((prev) => ({ ...prev, ...JSON.parse(savedState) }));
    }
  }, [setReview]);

  // 데이터 로딩 로직
  useEffect(() => {
    if (locationState && Object.keys(locationState).length > 0) {
      setReview((prev) => ({
        ...prev,
        housingType: locationState.housingType || prev.housingType || "",
        pros: locationState.advantages || prev.pros || [],
        cons: locationState.disadvantages || prev.cons || [],
        content: locationState.content || prev.content || "",
        images: locationState.photos || prev.images || [],
        address: locationState.address?.roadAddress || prev.address || "",
        addressDetail:
          locationState.address?.jibunAddress || prev.addressDetail || "",
        detailedAddress: locationState.buildingName
          ? `${locationState.buildingName}`
          : prev.detailedAddress || "",
        contractType: locationState.paymentType || prev.contractType || "",
        deposit: locationState.priceData?.deposit || prev.deposit || 0,
        monthlyRent:
          locationState.priceData?.monthlyRent !== undefined
            ? locationState.priceData.monthlyRent
            : prev.monthlyRent || 0,
        managementFee:
          locationState.priceData?.managementFee || prev.managementFee || 0,
      }));
    }
  }, [locationState, setReview]);
  console.log(1, locationState.buildingName);
  console.log(review);
  // 라벨에 맞는 아이콘 찾기
  const getIconFromLabel = (label: string): string => {
    // 먼저 filters에서 아이콘 찾기 시도
    let iconSrc = "";
    let tagKey = "";

    // longMessage에서 key 찾기 (사용자가 선택한 태그 "교통이 편리해요"로부터 "PO_LO_01" 키 확인)
    for (const [key, value] of Object.entries(tagLongMessages)) {
      if (value === label) {
        tagKey = key;
        break;
      }
    }
    // 찾은 키로 아이콘 가져오기
    if (tagKey) {
      const filter =
        locationState.housingType === "공인중개사" ? agencyFilters : filters;
      iconSrc =
        filter
          .find(
            (category) =>
              category.positiveFilters.some((item) => item.key === tagKey) ||
              category.negativeFilters.some((item) => item.key === tagKey)
          )
          ?.positiveFilters.find((item) => item.key === tagKey)?.icon ||
        filter
          .find(
            (category) =>
              category.positiveFilters.some((item) => item.key === tagKey) ||
              category.negativeFilters.some((item) => item.key === tagKey)
          )
          ?.negativeFilters.find((item) => item.key === tagKey)?.icon ||
        "";
    }

    // 아이콘을 찾지 못했으면 라벨로 직접 찾기
    if (!iconSrc) {
      filters.forEach((category) => {
        [...category.positiveFilters, ...category.negativeFilters].forEach(
          (item) => {
            if (item.label === label) {
              iconSrc = item.icon;
            }
          }
        );
      });
    }

    return iconSrc;
  };

  const handleItemClick = (navigationFunction: () => void) => {
    localStorage.setItem("reviewState", JSON.stringify(review));
    navigationFunction();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRateReview = () => {
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    setReview((prev) => ({
      ...prev,
      rating: rating,
    }));
    setShowRatingModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    try {
      setTimeout(() => {
        setIsSubmitting(false);
        setShowConfirmModal(false);
        navigate("/review/complete");
        setReview(defaultReviewState);
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Failed to submit review:", error);
    }
  };

  const navigateToHousingType = () => {
    localStorage.setItem("reviewState", JSON.stringify(review));

    navigate("/review/type", {
      state: {
        ...review,
        from: "confirm",
      },
    });
  };

  const navigateToAddress = () => {
    navigate("/review/address", {
      state: {
        ...locationState,
        from: "confirm",
      },
    });
  };

  const navigateToDetailedAddress = () => {
    // localStorage.setItem("reviewState", JSON.stringify(review));
    if (review.housingType === "공인중개사") {
      navigate("/review/agency", {
        state: {
          ...locationState,
          from: "confirm",
        },
      });
    } else {
      navigate("/review/address/result", {
        state: {
          address: {
            roadAddress: review.address || "",
            jibunAddress: review.addressDetail || "",
            buildingName: review.detailedAddress || "",
          },
          buildingName: review.detailedAddress || "",
          floor: review.floorType || "",
          from: "confirm",
        },
      });
    }
  };

  const navigateToContractType = () => {
    localStorage.setItem("reviewState", JSON.stringify(review));
    window.location.href = "/review/payment-type?from=confirm";
  };

  const navigateToContractDetails = () => {
    localStorage.setItem("reviewState", JSON.stringify(review));
    const nextPath =
      review.contractType === "전세" ? "/review/jeonse" : "/review/wolse";

    navigate(nextPath, {
      state: {
        address: {
          roadAddress: review.address || "",
          jibunAddress: review.addressDetail || "",
          buildingName: review.detailedAddress || "",
        },
        buildingName: review.detailedAddress || "",
        floor: review.floorType || "",
        paymentType: review.contractType || "",
        priceData: {
          deposit: review.deposit || 0,
          monthlyRent: review.monthlyRent || 0,
          managementFee: review.managementFee || 0,
        },
        from: "confirm",
      },
    });
  };

  const navigateToPros = () => {
    navigate("/review/filter-ad", {
      state: {
        ...locationState,
        photos: review.images,
        advantages: review.pros,
        disadvantages: review.cons,
        content: review.content,
        from: "confirm",
      },
    });
    // localStorage.setItem("reviewState", JSON.stringify(review));
    // window.location.href = "/review/filter-ad";
  };

  const navigateToCons = () => {
    navigate("/review/filter-disad", {
      state: {
        ...locationState,
        photos: review.images,
        advantages: review.pros,
        disadvantages: review.cons,
        content: review.content,
        from: "confirm",
      },
    });
    // localStorage.setItem("reviewState", JSON.stringify(review));
    // window.location.href = "/review/filter-disad";
  };

  const navigateToContent = () => {
    navigate("/review/content", {
      state: {
        ...locationState,
        photos: review.images,
        advantages: review.pros,
        disadvantages: review.cons,
        content: review.content,
        from: "confirm",
      },
    });
  };

  // 태그 표시 함수 수정
  const renderTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return null;
    console.log(tags);

    return (
      <div className={styles.tags}>
        {tags.map((tagLabel, index) => {
          // 긴 라벨("교통이 편리해요")에서 짧은 라벨("교통 편리")로 변환
          let shortLabel = tagLabel;

          // tagLongMessages에서 키 찾기
          for (const [key, value] of Object.entries(tagLongMessages)) {
            if (value === tagLabel) {
              // 찾은 키로 tagMessages에서 짧은 라벨 가져오기
              shortLabel = tagMessages[key] || tagLabel;
              break;
            }
          }

          return (
            <span key={index} className={styles.tag}>
              <img
                src={getIconFromLabel(tagLabel)}
                alt={shortLabel}
                className={styles.tagIcon}
              />
              {shortLabel}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="content">
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            className={styles.closeButton}
            onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
        </div>

        <div className={styles.pageContent}>
          <h1 className={styles.title}>
            찐빵 업로드를 위해
            <br />
            입력한 정보를 확인해 주세요!
          </h1>
          <div className={styles.infoContainer}>
            <div
              className={styles.infoItem}
              onClick={() => handleItemClick(navigateToHousingType)}
            >
              <span className={styles.label}>찐빵 유형</span>
              <div className={styles.value}>
                <span className={styles.valueText}>
                  {review.housingType || ""}
                </span>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>

            <div
              className={styles.infoItem}
              onClick={() => handleItemClick(navigateToAddress)}
            >
              <span className={styles.label}>주소</span>
              <div className={styles.value}>
                <div>
                  <span className={styles.valueText}>
                    {review.address || ""}
                  </span>
                </div>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>

            <div
              className={styles.infoItem}
              onClick={() => {
                handleItemClick(navigateToDetailedAddress);
              }}
            >
              <span className={styles.label}>상세 주소</span>
              <div className={styles.value}>
                <span className={styles.valueText}>
                  {review.detailedAddress || ""}
                  <br />
                  {review.floorType || ""}
                </span>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>
            {review.housingType != "공인중개사" && (
              <>
                <div
                  className={styles.infoItem}
                  onClick={() => handleItemClick(navigateToContractType)}
                >
                  <span className={styles.label}>계약 형태</span>
                  <div className={styles.value}>
                    <span className={styles.valueText}>
                      {review.contractType || ""}
                    </span>
                    <img
                      src={ArrowIcon}
                      alt="arrow"
                      className={styles.arrowIcon}
                    />
                  </div>
                </div>

                <div
                  className={styles.infoItem}
                  onClick={() => handleItemClick(navigateToContractDetails)}
                >
                  <span className={styles.label}>계약 조건</span>
                  <div className={styles.value}>
                    <div className={styles.contractDetails}>
                      <span className={styles.valueText}>
                        {review.deposit ? `보증금 ${review.deposit}만원` : ""}
                      </span>
                      {!review.contractType ||
                      review.contractType === "월세" ? (
                        <span className={styles.valueText}>
                          {review.monthlyRent
                            ? `월세 ${review.monthlyRent}만원`
                            : ""}
                        </span>
                      ) : null}
                      <span className={styles.valueText}>
                        {review.managementFee
                          ? `관리비 ${review.managementFee}만원`
                          : ""}
                      </span>
                    </div>
                    <img
                      src={ArrowIcon}
                      alt="arrow"
                      className={styles.arrowIcon}
                    />
                  </div>
                </div>
              </>
            )}

            <div
              className={styles.infoItem}
              onClick={() => handleItemClick(navigateToPros)}
            >
              <span className={styles.label}>장점</span>
              <div className={styles.value}>
                <div className={styles.tagsContainer}>
                  {renderTags(review.pros || [])}
                </div>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>

            <div
              className={styles.infoItem}
              onClick={() => handleItemClick(navigateToCons)}
            >
              <span className={styles.label}>단점</span>
              <div className={styles.value}>
                <div className={styles.tagsContainer}>
                  {renderTags(review.cons || [])}
                </div>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>

            <div
              className={styles.infoItem}
              onClick={() => handleItemClick(navigateToContent)}
            >
              <span className={styles.label}>글 후기</span>
              <div className={styles.value}>
                <div className={styles.reviewTextContainer}>
                  <span className={styles.reviewText}>
                    {review.content || ""}
                  </span>
                </div>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <button className={styles.prevButton} onClick={handleBack}>
            이전
          </button>
          <button className={styles.nextButton} onClick={handleRateReview}>
            다음
          </button>
        </footer>
      </div>

      {showRatingModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowRatingModal(false)}
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHandle}></div>
            <div className={styles.ratingModal}>
              <h2 className={styles.ratingTitle}>찐빵을 업로드 할까요?</h2>
              <p className={styles.ratingSubtitle}>
                작성해 주신 찐빵의 총점을 매겨 <br />
                찐빵을 업로드해 보세요!
              </p>
              <div className={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={
                      star <= (hoveredRating || rating)
                        ? starFilledIcon
                        : starEmptyIcon
                    }
                    alt={star <= rating ? "채워진 별" : "빈 별"}
                    className={styles.starIcon}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
              </div>
              <button
                className={`${styles.uploadButton} ${
                  rating > 0 ? styles.enabled : ""
                }`}
                onClick={handleSubmitRating}
                disabled={rating === 0}
              >
                업로드
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <CancelModal
          onClose={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
        />
      )}

      {showConfirmModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isSubmitting && setShowConfirmModal(false)}
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHandle}></div>
            <div className={styles.confirmModal}>
              <img
                src={checkIcon}
                alt="완료"
                className={styles.checkIconImage}
              />
              <h2 className={styles.completeModalTitle}>찐빵 업로드 완료</h2>
              <p className={styles.modalSubtitle}>
                나의 찐빵에서 <br />
                내가 작성한 찐빵을 확인하세요!
              </p>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewConfirmPage;
