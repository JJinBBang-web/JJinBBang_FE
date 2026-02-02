import styles from "./UpdateConfirmPage.module.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { tagMessages, tagImages } from '../../components/Tag';
import closeIcon from '../../assets/image/iconClose.svg';
import ArrowIcon from '../../assets/image/arrowIcon.svg';
import starFilledIcon from '../../assets/image/starIconOnRed.svg';
import starEmptyIcon from '../../assets/image/starIconOff.svg';
import checkIcon from '../../assets/image/checkIconActive.svg';
import { updateReviewState } from "../../recoil/review/updateReviewAtoms";
import { contractTypeToKorean, floorToKorean, typeToKorean } from "../../util/mapping";
import { useCancelModal } from "../../util/useCancelModal";
import CancelModal from "../../components/review/CancelModal";
import { defaultReviewState, ReviewState } from "../../recoil/review/reviewAtoms";
import emptyCharacterIcon from "../../assets/image/emptyCharacterIcon.svg";
import { deleteAPI, putAPI } from "../../api/baseAPI";
import { UpdateReviewRequest } from "../../types/entity/review/ReviewUpdateInterface";
import UpdateCancelModal from "../../components/review/UpdateCancelModal";
import { imageUploadAPI } from "../../api/imageUpload";
import { useQueryClient } from '@tanstack/react-query';




type AddressPick = {
  roadAddress?: string;
  jibunAddress?: string;
  buildingName?: string;
  buildingCode?: string;
};


const UpdateConfirmPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const { reviewId } = useParams();

    const [review,setReview] = useRecoilState(updateReviewState);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteMConfirmodal] = useState(false);

    const housingType = typeToKorean[review?.housingType ?? ''] || '';
    const contractType = contractTypeToKorean[review?.contractType ?? ''] || '';
    const floor = floorToKorean[review?.floorType ?? ''] || ""; 
    const roomCapacity = review?.dormitoryConditions?.roomCapacity;

    const [showRatingModal, setShowRatingModal] = useState(false);
    
    const {
        showCancelModal,
        handleCloseButtonClick,
        handleCancelModalClose,
      } = useCancelModal();
    
      useEffect(() => {
          const state = location.state as { address?: AddressPick } | undefined;
          const addr = state?.address;
          if (!addr || review?.detailedAddress) return;
          
          setReview((prev) => {
            // prev가 null이어도 항상 ReviewState가 되도록 보정
            const base: ReviewState = prev ?? defaultReviewState;

            console.log(prev);
            const next: ReviewState = { ...base };

            const newAddress = addr.roadAddress ?? addr.jibunAddress;
            if (newAddress && newAddress.trim().length > 0) {
              next.address = newAddress;
            }
            if (addr.buildingName && addr.buildingName.trim().length > 0) {
              next.detailedAddress = addr.buildingName.trim();
            }
            if (addr.buildingCode && addr.buildingCode.trim().length > 0) {
              next.buildingCode = addr.buildingCode.trim();
            }

            return next;
          });

          // 중복 갱신 방지: history state에서 address 제거
          navigate(location.pathname, {
            replace: true,
            state: { ...(location.state as object), address: undefined },
          });
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [location.state, navigate, setReview]);

    // 뒤로가기 함수
    const handleBack = () => {
      navigate(`/building/review/${reviewId}`, {replace: true, state: { from: 'update-exit' }});
    };
    
    // 삭제 모달 함수
    const handleDelete = () => {
      setShowDeleteModal(true);
    };

    // 별점 모달 함수
    const handleRateReview = () => {
      setShowRatingModal(true);
    };

    console.log(review);

    // api 연동해야함.
    // 최종 재업로드 함수
    const handleSubmitRating = async () => {
      if (!reviewId || !review || rating <= 0) return;

      try {
          setIsSubmitting(true);

          const finalImageUrls = await ensureCdnImages(review.images as any);
          // UI 반영 (선반영)
          setReview((prev) => (prev ? { ...prev, rating, images: finalImageUrls } : prev));

          const body = buildUpdatePayload(review, rating, finalImageUrls);
          
          // ✅ 인증 필요하면 true
          await putAPI(`/api/v1/review/${reviewId}`, body, true);

          queryClient.invalidateQueries({ queryKey: ['userReview'] });

          setShowRatingModal(false);
          setShowConfirmModal(true);
      } catch (e) {
          console.error('리뷰 수정 실패:', e);
          alert('수정에 실패했어요. 잠시 후 다시 시도해 주세요.');
      } finally {
          setIsSubmitting(false);
      }
    };

    // 최종 삭제 함수
    const handleDeleteConfirm = async () => {
      if (!reviewId) return;

      try {
        setIsDelete(true);

        const response = await deleteAPI(`/api/v1/review/${reviewId}`, true);
        
        queryClient.invalidateQueries({ queryKey: ['userReview'] });

        setReview(defaultReviewState);
        setShowDeleteMConfirmodal(true);
        setShowDeleteModal(false);

      } catch (error) {
        console.error("리뷰 삭제 실패:", error);
        setIsDelete(false); // 실패 시 다시 버튼 활성화
      }
    };

    // 아이템 클릭 & 이동 함수
    const handleItemClick = (navigationFunction: () => void) => {
      
      navigationFunction();
    };

    // 재업로드 후 이동 함수
    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);
    
        try {
          setTimeout(() => {
            setIsSubmitting(false);
            setShowConfirmModal(false);
            navigate(`/mypage`, {replace: true, state: { from: 'update-exit' }});
            setReview(defaultReviewState);
          }, 1000);
        } catch (error) {
          setIsSubmitting(false);
          console.error('Failed to submit review:', error);
        }
      };

    // 삭제 확인 함수
    const handleDeleteSubmit = () => {
      setIsDelete(true);
      setShowDeleteMConfirmodal(false);
      navigate('/mypage', {replace: true, state: { from: 'update-exit' }});
    }

    // 
    const navigateToHousingType = () => {
      

      navigate(`/review/${reviewId}/update/type`, {
        replace: true,
        state: {
          from: 'update',
        },
      });
    };


    const navigateToAddress = () => {
      
      navigate(`/review/${reviewId}/update/input-address`, {
        replace: true,
        state: { from: 'update', housingType: review?.housingType },
      });
    };

    const navigateToDetailedAddress = () => {
      
      if (review?.housingType === 'DORMITORY') {
        navigate(`/review/${reviewId}/update/dormitory`, {
          replace: true,
          state: {
            from: "update",
            universityName : review?.universityName,
            roomCapacity: review?.dormitoryConditions?.roomCapacity,
            floorType: floor || '',
            buildingName: review?.detailedAddress,
          }
        })

      } else {
          navigate(`/review/${reviewId}/update/floor`, {
            replace: true,
            state: {
              address: {
                roadAddress: review?.address || '',
                jibunAddress: '',
                buildingName: review?.detailedAddress || '',
              },
              buildingName: review?.detailedAddress || '',
              floor: floor || '',
              space: review?.space || 0,
              from: 'update',
            },
        });
      }
    };
    const navigateToContractType = () => {
      
      if (review?.housingType === 'DORMITORY') {
        navigate(`/review/${reviewId}/update/dormitory-conditions`, {
          replace: true,
          state: {
            from: 'update',
            facfacilities:review?.facilityConditions
          },
        });
      } else {
        navigate(`/review/${reviewId}/update/contract/`, {
          replace: true,
          state: {
            from: 'update',
          },
        });
      }
    };

    const navigateToContractDetails = () => {
      
      if (review?.housingType === 'DORMITORY') {
        navigate(`/review/${reviewId}/update/dormitory-amenities`, {
          replace: true,
          state: {
            from: 'update',
          },
        });
      } else {

        navigate(`/review/${reviewId}/update/contract/price`, {
          replace: true,
          state: {
            from: 'update',
          },
        });
      }
    };

    const navigateToPros = () => {
      
      navigate(`/review/${reviewId}/update/filter-ad`, {
        replace: true,
        state: {
          from: "update",
          housingType: review?.housingType,
          advantages: review?.pros || [],
        },
      });
    };

    const navigateToCons = () => {
      
      navigate(`/review/${reviewId}/update/filter-disad`, {
        replace: true,
        state: {
          from: "update",
          housingType: review?.housingType,
          disadvantages: review?.cons || [],
        },
      });
    };

    const navigateToPhotos = () => {
      navigate(`/review/${reviewId}/update/photo-upload`, {
        replace: true,
        state: {
          housingType: review?.housingType,
          from: "update",
        },
      });
    };

    const navigateToContent = () => {
      navigate(`/review/${reviewId}/update/content`, {
        replace: true,
        state: {
          content: review?.description,
          from: 'update',
        },
      });
    };

    const truncateReviewText = (text: string): string => {
      if (!text) return "후기를 작성해주세요";

      const maxChars = 68;

      if (text.length > maxChars) {
        return text.slice(0, maxChars) + "...";
      }

      return text;
    };

    // Request 매핑 함수
    const buildUpdatePayload = (r : ReviewState, finalRating: number, imageUrls: string[]) : UpdateReviewRequest => {
      // 공통 키워드 처리
      const keywords = {
          positive: r.pros ?? [],
          negative: r.cons ?? [],
        };
      
      // 공통 건물 정보 처리
      const buildingRequest = (() => {
        if (!r.buildingCode) return undefined;
        return {
          buildingCode: r.buildingCode,
          name: r.detailedAddress || undefined,
          type: r.housingType || undefined,
          address: r.address || undefined,
          latitude: (r as any).latitude,
          longitude: (r as any).longitude,
        };
      })();

      switch (r.housingType) {
        case "AGENCY" :
          return {
          agencyReview: {
            rating: finalRating as 1|2|3|4|5,
            content: r.content ?? r.description ?? '',
          },
          imageUrls,
          keywords,
          ...(buildingRequest ? { buildingRequest } : {}),
        };

        case "DORMITORY" :
          return {
            dormitoryReview: {
              dormitoryId: r.dormitoryId ?? 1,
              capacity: r.dormitoryConditions?.roomCapacity ?? 1,
              dormFee: r.dormitoryFee ?? r.dormitoryConditions?.dormitoryFee ?? 0,
              floor: r.floorType ?? 'LOW',
              rating: finalRating as 1|2|3|4|5,
              content: r.content ?? r.description ?? '',
            },
            imageUrls,
            keywords,
            condition: {
              currentRegion: r.dormitoryConditions?.residenceArea ?? '',
              currentGrade: String(r.dormitoryConditions?.semesterGrade) ?? 0, 
            },
            facilities: {
              privateFacilities: Object.keys(r.facilityConditions?.private ?? {}).filter(
                key => r.facilityConditions?.private?.[key]
              ),
              publicFacilities: Object.keys(r.facilityConditions?.public ?? {}).filter(
                key => r.facilityConditions?.public?.[key]
              ),
              lounge: Object.values(r.facilityConditions?.lounge ?? {})[0] ?? false
            },
            // ...(buildingRequest ? { buildingRequest } : {}),
          };

        default : 
          const contractType = r.contractType === 'MONTHLY_RENT' ? 'MONTHLY_RENT' : 'DEPOSIT_RENT';
          const monthlyRent = contractType === 'MONTHLY_RENT' ? (r.monthlyRent ?? null) : null;
          return {
            generalReview: {
              contractType,
              deposit: r.deposit ?? 0,
              monthlyRent,
              maintenanceCost: r.managementFee ?? 0,
              floor: r.floorType ?? 'LOW',
              space: r.space ?? 0,
              rating: (finalRating as 1|2|3|4|5),
              content: r.content ?? r.description ?? '',
            },
            imageUrls,
            keywords,
            ...(buildingRequest ? { buildingRequest } : {}),
        };
      }
    }

    const isRemoteUrl = (url: string) => {
      if (!url) return false;
      // blob:, data: 로 시작하면 로컬
      if (url.startsWith("blob:") || url.startsWith("data:")) return false;
      // http(s) 이면 일단 원격으로 간주 (필요하면 도메인 화이트리스트 추가)
      return /^https?:\/\//i.test(url);
    };
    const ensureCdnImages = async (
      images: Array<string | File> | undefined
    ): Promise<string[]> => {
      if (!images || images.length === 0) return [];

      const remoteUrls: string[] = [];
      const blobUrls: string[] = [];
      const base64s: string[] = [];
      const files: File[] = [];

      for (const img of images) {
        if (img instanceof File) {
          files.push(img);
          continue;
        }
        if (img.startsWith("blob:")) {
          blobUrls.push(img);
          continue;
        }
        if (img.startsWith("data:")) {
          base64s.push(img);
          continue;
        }
        if (isRemoteUrl(img)) {
          remoteUrls.push(img);
          continue;
        }
        // 혹시 모르는 케이스는 원격으로 간주 (원한다면 더 엄격히 필터링)
        remoteUrls.push(img);
      }

      const [uploadedFromBlob, uploadedFromBase64, uploadedFromFiles] =
        await Promise.all([
          blobUrls.length
            ? imageUploadAPI.uploadBlobUrls(blobUrls, "review")
            : Promise.resolve<string[]>([]),
          base64s.length
            ? imageUploadAPI.uploadBase64Images(base64s, "review")
            : Promise.resolve<string[]>([]),
          files.length
            ? imageUploadAPI.uploadImages(files, "review")
            : Promise.resolve<string[]>([]),
        ]);

      return [
        ...remoteUrls,
        ...uploadedFromBlob,
        ...uploadedFromBase64,
        ...uploadedFromFiles,
      ];
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
            onClick={handleCloseButtonClick}
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
                review?.housingType !== "AGENCY" 
                ? review?.housingType !== "DORMITORY" ?
                handleItemClick(navigateToHousingType)
                : undefined : undefined
              }
            >
              <span className={styles.label}>찐빵 유형</span>
              <div className={styles.value}>
                <span className={styles.valueText}>
                  {housingType}
                </span>
                {review?.housingType !== "AGENCY" ? review?.housingType !== "DORMITORY" ? <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} /> : <div></div> : <div></div>}
              </div>
            </div>

            <div
              className={styles.infoItem}
              onClick={() => 
                // review?.housingType !== "AGENCY" ?
                review?.housingType !== "DORMITORY" ?
                handleItemClick(navigateToAddress)
                : undefined
              }
            >
              <span className={styles.label}>주소</span>
              <div className={styles.value}>
                <div>
                  <span className={styles.valueText}>
                    {review?.address}
                  </span>
                </div>
                {review?.housingType !== "AGENCY" ? review?.housingType !== "DORMITORY" ? <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} /> : <div></div> : <div></div>}
              </div>
            </div>

            {review?.housingType === "DORMITORY" && (
              <div
                className={styles.infoItem}
              >
                <span className={styles.label}>기숙사명</span>
                <div className={styles.value}>
                  <span className={styles.valueText}>
                      {review?.universityName}
                      <br />
                      {review?.detailedAddress}
                  </span>
                </div>
              </div>
            )}

            <div
              className={styles.infoItem}
              onClick={() => 
                review?.housingType == "AGENCY" ? undefined :
                handleItemClick(navigateToDetailedAddress)}
            >
              <span className={styles.label}>상세 주소</span>
              <div className={styles.value}>
                {review?.housingType === "DORMITORY" ? (
                <>
                  <span className={styles.valueText}>
                    {roomCapacity}인실
                    <br/>
                    {floor}
                  </span>
                </>
                ) : (
                <>
                  <span className={styles.valueText}>
                      {review?.detailedAddress}
                    <br />
                    {floor}
                  </span>
                </>
                )
                }
                {review?.housingType !== "AGENCY" ? <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} /> : <div></div>}
              </div>
            </div>
            {review?.housingType !== "AGENCY" && (
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
                                      ? `휴게시설 ${typeLabel}`
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
              onClick={() => handleItemClick(navigateToPhotos)}
            >
              <span className={styles.label}>사진</span>
              <div className={styles.value}>
                <div className={styles.photosContainer}>
                  {review?.images && review.images.length > 0 ? (
                    review.images.slice(0, 3).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`사진 ${index + 1}`}
                        className={styles.photoThumbnail}
                      />
                    ))
                  ) : (
                    <span className={styles.valueText}>사진을 추가해주세요</span>
                  )}
                </div>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>

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
                      {truncateReviewText(
                        review?.content || review?.description || ""
                      )}
                  </span>
                </div>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <button className={styles.prevButton} onClick={handleDelete}>
            찐빵 삭제
          </button>
          <button className={styles.nextButton} onClick={handleRateReview}>
            재업로드
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
              <h2 className={styles.ratingTitle}>찐빵을 재업로드 할까요?</h2>
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
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHandle}></div>
            <div className={styles.cancelModal}>
              <h2 className={styles.modalTitle}>찐빵을 삭제할까요?</h2>
              <p className={styles.modalSubtitle}>
                삭제된 내용은 복구할 수 없어요!
                <br /> 신중하게 고민해 주세요!
              </p>
              <img
                src={emptyCharacterIcon}
                alt="비어있는 찐빵 캐릭터"
                className={styles.emptyCharacterIcon}
              />
              <div className={styles.modalButtons}>
                <button className={styles.cancelButton} onClick={() => setShowDeleteModal(false)}>
                  이전
                </button>
                <button
                  className={styles.cm_confirmButton}
                  onClick={() => {
                    handleDeleteConfirm();
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isDelete}
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
              <h2 className={styles.completeModalTitle}>삭제 완료</h2>
              <p className={styles.modalSubtitle}>
                나의 찐빵에서 삭제 여부를<br />
                확인해 주세요!
              </p>
              <button
                className={styles.confirmButton}
                onClick={handleDeleteSubmit}
                disabled={!isDelete}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <UpdateCancelModal
          onClose={handleCancelModalClose}
          onConfirm={handleBack}
        />
      )}

      {showConfirmModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isSubmitting}
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
}

export default UpdateConfirmPage;