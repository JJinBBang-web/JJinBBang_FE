import styles from "./UpdateConfirmPage.module.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { tagMessages, tagLongMessages, tagImages } from '../../components/Tag';
import closeIcon from '../../assets/image/iconClose.svg';
import ArrowIcon from '../../assets/image/arrowIcon.svg';
import starFilledIcon from '../../assets/image/starIconOnRed.svg';
import starEmptyIcon from '../../assets/image/starIconOff.svg';
import checkIcon from '../../assets/image/checkIconActive.svg';
import { updateReviewState } from "../../recoil/review/updateReviewAtoms";
import { JjinAgencyFilterState, JjinFilterState } from "../../recoil/util/filterRecoilState";
import { DormFilterState } from "../../recoil/util/dormFilterState";
import { contractTypeToKorean, floorToKorean, typeToKorean } from "../../util/mapping";

const UpdateConfirmPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { reviewId } = useParams();

    const review = useRecoilValue(updateReviewState);
    const filters = useRecoilValue(JjinFilterState);
    const dormFilters = useRecoilValue(DormFilterState); // 기숙사 필터 추가
    const agencyFilters = useRecoilValue(JjinAgencyFilterState);

    const housingType = typeToKorean[review?.housingType ?? ''] || '';
    const contractType = contractTypeToKorean[review?.contractType ?? ''] || '';
    const floor = floorToKorean[review?.floorType ?? ''] || ""; 

    // 기숙사 유형인지 체크
    const isDormitory = review?.housingType === 'DORMITORY';
    const isAgency = review?.housingType === 'AGENCY';

    const handleBack = () => {
      navigate(`/building/review/${reviewId}`);
    };

    const handleItemClick = (navigationFunction: () => void) => {
      localStorage.setItem('updateReviewState', JSON.stringify(review));
      navigationFunction();
    };

    const navigateToHousingType = () => {
    localStorage.setItem('updateReviewState', JSON.stringify(review));

    navigate(`/review/${reviewId}/update/type`, {
      state: {
        ...review,
        from: 'update',
      },
    });
  };
  const navigateToAddress = () => {
    navigate(`/review/${reviewId}/update/address`, {
      state: {
        ...review,
        from: 'update',
      },
    });
  };

  const navigateToContractType = () => {
    localStorage.setItem('updateReviewState', JSON.stringify(review));
    if (review?.housingType === 'DORMITORY') {
      navigate('/review/dormitory-conditions', {
        state: {
          from: 'update',
        },
      });
    } else {
      navigate(`/review/${reviewId}/update/contract/`, {
        state: {
          from: 'update',
        },
      });
    }
  };

  const navigateToContractDetails = () => {
    localStorage.setItem('updateReviewState', JSON.stringify(review));
    if (review?.housingType === 'DORMITORY') {
      navigate('/review/dormitory-amenities', {
        state: {
          from: 'update',
        },
      });
    } else {

      navigate(`/review/${reviewId}/update/contract/price`, {
        state: {
          from: 'update',
        },
      });
    }
  };

  console.log(review);


  const navigateToPros = () => {
    localStorage.setItem('updateReviewState', JSON.stringify(review));
    navigate(`/review/${reviewId}/update/filter-ad`, {
      state: {
        ...review,
        from: "update",
        advantages: review?.pros || [],
      },
    });
  };

  const navigateToCons = () => {
    localStorage.setItem('updateReviewState', JSON.stringify(review));
    navigate(`/review/${reviewId}/update/filter-disad`, {
      state: {
        ...review,
        from: "update",
        disadvantages: review?.cons || [],
      },
    });
  };

  const navigateToContent = () => {
    navigate(`/review/${reviewId}/update/content`, {
      state: {
        ...review,
        content: review?.description,
        from: 'update',
      },
    });
  };
    const getIconFromLabel = (label: string): string => {
        // 기숙사 유형에 따라 적절한 필터 선택
        const currentFilters = isDormitory
          ? dormFilters
          : isAgency
          ? agencyFilters
          : filters;
    
        console.log("s:", currentFilters);
    
        let iconSrc = '';
        let tagKey = '';
    
        // longMessage에서 key 찾기 (사용자가 선택한 태그 "교통이 편리해요"로부터 "PO_LO_01" 키 확인)
        for (const [key, value] of Object.entries(tagLongMessages)) {
          if (value === label) {
            tagKey = key;
            break;
          }
        }
    
        // 찾은 키로 아이콘 가져오기
        if (tagKey) {
          const filter = review?.housingType === "AGENCY" ? agencyFilters : filters;
          iconSrc =
            currentFilters
              .find(
                (category) =>
                  category.positiveFilters.some((item) => item.key === tagKey) ||
                  category.negativeFilters.some((item) => item.key === tagKey)
              )
              ?.positiveFilters.find((item) => item.key === tagKey)?.icon ||
            currentFilters
              .find(
                (category) =>
                  category.positiveFilters.some((item) => item.key === tagKey) ||
                  category.negativeFilters.some((item) => item.key === tagKey)
              )
              ?.negativeFilters.find((item) => item.key === tagKey)?.icon ||
            '';
        }
    
        // 아이콘을 찾지 못했으면 라벨로 직접 찾기
        if (!iconSrc) {
          currentFilters.forEach((category) => {
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

    const renderTags = (tags: string[]) => {
      if (!tags || tags.length === 0) return null;

      return (
        <div className={styles.tags}>
          {tags.map((tagCode, index) => {
            const shortLabel = tagMessages[tagCode] || tagCode;
            const iconSrc = tagImages[tagCode];

            return (
              <span key={index} className={styles.tag}>
                {iconSrc && (
                  <img src={iconSrc} alt={shortLabel} className={styles.tagIcon} />
                )}
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
            // onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
        </div>

        <div className={styles.pageContent}>
          <h1 className={styles.title}>
            수정하실 정보를 확인해 주세요!
          </h1>
          <div className={styles.infoContainer}>
            <div
              className={styles.infoItem}
              onClick={() => 
                review?.housingType != "AGENCY" 
                ? review?.housingType != "DORMITORY" ?
                handleItemClick(navigateToHousingType)
                : undefined : undefined
              }
            >
              <span className={styles.label}>찐빵 유형</span>
              <div className={styles.value}>
                <span className={styles.valueText}>
                  {housingType}
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
                    {review?.address}
                  </span>
                </div>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>

            <div
              className={styles.infoItem}
              // onClick={() => handleItemClick(navigateToDetailedAddress)}
            >
              <span className={styles.label}>상세 주소</span>
              <div className={styles.value}>
                <span className={styles.valueText}>
                  {review?.detailedAddress}
                  <br />
                  {floor}
                </span>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>
            {review?.housingType != "AGENCY" && (
              <>
                <div
                  className={styles.infoItem}
                  onClick={() => handleItemClick(navigateToContractType)}
                >
                  <span className={styles.label}>
                    {review?.housingType === "DORMITORY"
                      ? "입주 조건"
                      : "계약 형태"}
                  </span>
                  <div className={styles.value}>
                    <div className={styles.contractDetails}>
                      {review?.housingType === "DORMITORY" ? (
                        review.dormitoryConditions ? (
                          <>
                            {review.dormitoryConditions.hasDistanceCriteria &&
                              review.dormitoryConditions.residenceArea && (
                                <span className={styles.valueText}>
                                  거주 지역{" "}
                                  {review.dormitoryConditions.residenceArea}
                                </span>
                              )}
                            {review.dormitoryConditions.hasGradeCriteria &&
                              review.dormitoryConditions.semesterGrade && (
                                <span className={styles.valueText}>
                                  학기 성적{" "}
                                  {review.dormitoryConditions.semesterGrade}
                                </span>
                              )}
                            {(review.dormitoryConditions.dormitoryFee ||
                              review.dormitoryFee) && (
                              <span className={styles.valueText}>
                                기숙사비{" "}
                                {review.dormitoryConditions.dormitoryFee ||
                                  review.dormitoryFee ||
                                  0}
                                만원
                              </span>
                            )}
                          </>
                        ) : (
                          <span className={styles.valueText}>
                            입주 조건을 입력해주세요
                          </span>
                        )
                      ) : (
                        <span className={styles.valueText}>
                          {contractType}
                        </span>
                      )}
                    </div>
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
                  <span className={styles.label}>
                    {review?.housingType === "DORMITORY"
                      ? "편의 시설"
                      : "계약 조건"}
                  </span>
                  <div className={styles.value}>
                    <div className={styles.contractDetails}>
                      {review?.housingType === "DORMITORY" ? (
                          <>
                            {/* {Object.entries(
                              review.facilityConditions || {}
                            ).map(([category, options]) => {
                              const selectedOption = Object.entries(
                                options
                              ).find(([_, selected]) => selected)?.[0];
                              return selectedOption ? (
                                <span
                                  key={category}
                                  className={styles.valueText}
                                >
                                  {facility} {selectedOption}
                                </span>
                              ) : null;
                            })} */}
                            {Object.entries(review.facilityConditions || {}).map(([category, options]) => {
                              return Object.entries(options)
                                .filter(([_, selected]) => selected)
                                .map(([option]) => {
                                  let typeLabel = "";
                                  switch (category) {
                                    case "private":
                                      typeLabel = "개인";
                                      break;
                                    case "public":
                                      typeLabel = "공용";
                                      break;
                                    case "lounge":
                                      typeLabel = "유";
                                      break;
                                    default:
                                      break;
                                  }

                                  // 휴게시설은 "유"만 붙이고 끝냄
                                  const label =
                                    category === "lounge"
                                      ? `${option} ${typeLabel}`
                                      : `${option} ${typeLabel}`;

                                  return (
                                    <span key={`${category}-${option}`} className={styles.valueText}>
                                      {label}
                                    </span>
                                  );
                                });
                            })}
                          </>
                        ) 
                        : (
                        <>
                          <span className={styles.valueText}>
                            {review?.deposit
                              ? `보증금 ${review.deposit}만원`
                              : "보증금 정보 없음"}
                          </span>
                          {(!review?.contractType ||
                            review.contractType === "MONTHLY_RENT") && (
                            <span className={styles.valueText}>
                              {review?.monthlyRent
                                ? `월세 ${review.monthlyRent}만원`
                                : "월세 정보 없음"}
                            </span>
                          )}
                          <span className={styles.valueText}>
                            {review?.managementFee
                              ? `관리비 ${review.managementFee}만원`
                              : "관리비 정보 없음"}
                          </span>
                        </>
                      )}
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
                  {renderTags(review?.pros || [])}
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
                  {renderTags(review?.cons || [])}
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
                    {review?.content ||
                      review?.description}
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
          {/* <button className={styles.nextButton} onClick={handleRateReview}> */}
          <button className={styles.nextButton}>
            다음
          </button>
        </footer>
      </div>

      {/* {showRatingModal && (
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
      )} */}
    </div>
  );
}

export default UpdateConfirmPage;