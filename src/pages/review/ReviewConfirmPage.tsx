// src/pages/review/ReviewConfirmPage.tsx
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  reviewState,
  defaultReviewState,
} from "../../recoil/review/reviewAtoms";
import { dormitoryReviewState } from "../../recoil/review/dormitoryReviewAtoms";
import {
  JjinFilterState,
  JjinAgencyFilterState,
} from "../../recoil/util/filterRecoilState";
import { DormFilterState } from "../../recoil/util/dormFilterState";
import { tagMessages, tagLongMessages } from "../../components/Tag";
import styles from "../../styles/review/ReviewConfirm.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import ArrowIcon from "../../assets/image/arrowIcon.svg";
import starFilledIcon from "../../assets/image/starIconOnRed.svg";
import starEmptyIcon from "../../assets/image/starIconOff.svg";
import checkIcon from "../../assets/image/checkIconActive.svg";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import { useCreateReview } from "../../hooks/useCreateReview";
import { koreanToType } from "../../util/mapping";
import { reviewAutoSave } from "../../util/reviewAutoSave";
import useReviewStepTracking from "../../hooks/useReviewStepTracking";
import TagManager from "react-gtm-module";

interface LocationState {
  address?: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
    buildingCode?: string;
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
  roomData?: any;
  campusId?: number;
  universityName?: string;
  dormitoryId?: number;
  dormitoryName?: string;
  roomCapacity?: number;
}

const ReviewConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = useMemo(
    () => (location.state as LocationState) || {},
    [location.state]
  );

  const [review, setReview] = useRecoilState(reviewState);
  const [dormitoryReview, setDormitoryReview] =
    useRecoilState(dormitoryReviewState);
  const filters = useRecoilValue(JjinFilterState);
  const dormFilters = useRecoilValue(DormFilterState); // 기숙사 필터 추가
  const agencyFilters = useRecoilValue(JjinAgencyFilterState);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  console.log(review);
  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // ReviewConfirmPage에서는 실시간 자동저장 불필요
  // 리뷰 제출 시에만 자동저장 데이터 삭제

  // GA4 Review Funnel Tracking: Step 8 (Confirm)
  // 최종 확인 페이지 진입
  useReviewStepTracking('7_confirm');

  // 기숙사 유형인지 체크
  const isDormitory = review.housingType === "기숙사";
  const isAgency = review.housingType === "공인중개사";

  // 자동저장된 base64 이미지 데이터를 저장할 ref
  const autoSavedBase64ImagesRef = React.useRef<{
    reviewImages: string[];
    dormitoryImages: string[];
  }>({
    reviewImages: [],
    dormitoryImages: [],
  });

  // 페이지 로드 시 자동저장 데이터 복원 및 데이터 병합
  useEffect(() => {
    // 자동저장된 데이터가 있는지 확인
    const autoSavedData = reviewAutoSave.load();

    if (autoSavedData) {
      // base64 이미지 데이터 저장 (업로드용)
      autoSavedBase64ImagesRef.current = {
        reviewImages: autoSavedData.reviewBase64Images || [],
        dormitoryImages: autoSavedData.dormitoryBase64Images || [],
      };

      // 먼저 자동저장 데이터를 기본으로 복원
      if (autoSavedData.reviewState) {
        setReview(autoSavedData.reviewState);
      }
      if (autoSavedData.dormitoryReviewState) {
        setDormitoryReview(autoSavedData.dormitoryReviewState);
      }

      // locationState가 있으면 자동저장 데이터와 병합 (locationState 우선)
      if (locationState && Object.keys(locationState).length > 0) {
        const mergedState = {
          ...autoSavedData.reviewState, // 자동저장된 데이터를 기본으로
          // locationState에서 온 새로운 데이터로 덮어쓰기 (우선순위)
          ...(locationState.housingType && {
            housingType: locationState.housingType,
          }),
          ...(locationState.advantages && { pros: locationState.advantages }),
          ...(locationState.disadvantages && {
            cons: locationState.disadvantages,
          }),
          ...(locationState.content && { content: locationState.content }),
          // 이미지는 locationState의 photos가 없으면 자동저장된 데이터 유지
          ...(locationState.photos && locationState.photos.length > 0
            ? { images: locationState.photos }
            : autoSavedData.reviewState?.images
              ? { images: autoSavedData.reviewState.images }
              : {}),
          ...(locationState.address?.roadAddress && {
            address: locationState.address.roadAddress,
          }),
          ...(locationState.address?.jibunAddress && {
            addressDetail: locationState.address.jibunAddress,
          }),
          ...(locationState.buildingName && {
            detailedAddress: locationState.buildingName,
          }),
          ...(locationState.address?.buildingCode && {
            buildingCode: locationState.address.buildingCode,
          }),
          ...(locationState.paymentType && {
            contractType: locationState.paymentType,
          }),
          ...(locationState.priceData?.deposit !== undefined && {
            deposit: locationState.priceData.deposit,
          }),
          ...(locationState.priceData?.monthlyRent !== undefined && {
            monthlyRent: locationState.priceData.monthlyRent,
          }),
          ...(locationState.priceData?.managementFee !== undefined && {
            managementFee: locationState.priceData.managementFee,
          }),
          ...(locationState.campusId !== undefined && { campusId: locationState.campusId }),
          ...(locationState.universityName && { university: locationState.universityName }),
          ...(locationState.dormitoryId !== undefined && { dormitoryId: locationState.dormitoryId }),
          ...(locationState.dormitoryName && { dormitoryName: locationState.dormitoryName }),
          ...(locationState.roomCapacity !== undefined && { roomCapacity: locationState.roomCapacity, }),
          ...(locationState.floor && {
            floorType: locationState.floor,})
        };
        setReview(mergedState);
      }
    } else if (locationState && Object.keys(locationState).length > 0) {
      // 자동저장 데이터가 없고 locationState만 있는 경우
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
        buildingCode:
          locationState.address?.buildingCode || prev.buildingCode || "",
        contractType: locationState.paymentType || prev.contractType || "",
        deposit:
          locationState.priceData?.deposit !== undefined
            ? locationState.priceData.deposit
            : prev.deposit || 0,
        monthlyRent:
          locationState.priceData?.monthlyRent !== undefined
            ? locationState.priceData.monthlyRent
            : prev.monthlyRent || 0,
        managementFee:
          locationState.priceData?.managementFee !== undefined
            ? locationState.priceData.managementFee
            : prev.managementFee || 0,
      }));
    }
  }, [locationState, setReview, setDormitoryReview]);

  // 라벨에 맞는 아이콘 찾기 - 기숙사 필터 지원
  const getIconFromLabel = (label: string): string => {
    // 기숙사 유형에 따라 적절한 필터 선택
    const currentFilters = isDormitory
      ? dormFilters
      : isAgency
        ? agencyFilters
        : filters;

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
        "";
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

  const handleItemClick = (navigationFunction: () => void) => {
    navigationFunction();
  };

  const handleBack = () => {
    // 확인 페이지에서 뒤로 가기는 콘텐츠 작성 페이지로
    navigate("/review/content", {
      state: {
        ...locationState,
        from: null, // confirm에서 돌아가는 것이 아니므로 null로 설정
        photos: review.images,
        advantages: review.pros,
        disadvantages: review.cons,
        content: review.content || review.description,
        housingType: review.housingType,
      },
      replace: false,
    });
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

  const createReviewMutation = useCreateReview();

  const convertTagTextToCode = (tagTexts: string[]): string[] => {
    const tagCodes: string[] = [];

    tagTexts.forEach((text) => {
      // 현재 주거 유형에 따라 적절한 필터 사용
      const currentFilters = isDormitory
        ? dormFilters
        : isAgency
          ? agencyFilters
          : filters;

      // 필터에서 텍스트 매칭으로 코드 찾기
      let found = false;
      currentFilters.forEach((category) => {
        [...category.positiveFilters, ...category.negativeFilters].forEach(
          (item) => {
            if (item.label === text) {
              tagCodes.push(item.key);
              found = true;
            }
          }
        );
      });

      // 필터에서 찾지 못한 경우에만 tagLongMessages 사용 (fallback)
      if (!found) {
        for (const [code, message] of Object.entries(tagLongMessages)) {
          if (message === text) {
            tagCodes.push(code);
            break;
          }
        }
      }
    });

    return tagCodes;
  };

  // handleConfirmSubmit 함수 교체
  const handleConfirmSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    if (!review.latitude || !review.longitude) {
      alert(
        "주소 정보를 불러오는 중 오류가 발생했습니다. 주소를 다시 선택해주세요."
      );
      setShowConfirmModal(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // 태그 텍스트를 코드로 변환
      const positiveKeywords = convertTagTextToCode(review.pros || []);
      const negativeKeywords = convertTagTextToCode(review.cons || []);

      let reviewData: any;

      if (review.housingType === "기숙사") {
        // 편의시설 데이터 처리
        const privateFacilities: string[] = [];
        const publicFacilities: string[] = [];
        let lounge = false;

        if (dormitoryReview.facilityConditions) {
          Object.entries(dormitoryReview.facilityConditions).forEach(
            ([facility, options]) => {
              const selectedOption = Object.entries(options).find(
                ([_, selected]) => selected
              )?.[0];
              if (selectedOption) {
                if (facility === "휴게시설") {
                  // 휴게시설은 별도 처리
                  lounge = selectedOption === "있음";
                } else if (selectedOption === "개인") {
                  // 사용자가 '개인'을 선택한 시설들
                  privateFacilities.push(facility);
                } else if (selectedOption === "공용") {
                  // 사용자가 '공용'을 선택한 시설들
                  publicFacilities.push(facility);
                }
                // '없음'을 선택한 경우는 아무것도 추가하지 않음
              }
            }
          );
        }

        // DormitoryInputPage에서 저장된 campusId 사용
        // selectedTypeNum (대학교 ID)가 campusId로 저장되어 있음
        const dormitoryId = (review as any).dormitoryId;

        // if (!campusId) {
        //   alert(
        //     "대학교 캠퍼스 정보가 없습니다. 기숙사 정보를 다시 입력해주세요."
        //   );
        //   navigate("/review/university-input");
        //   return;
        // }

        if (!dormitoryId) {
          alert(
            "기숙사 위치 정보를 찾을 수 없습니다. 주소를 다시 입력해주세요."
          );
          navigate("/review/university-input");
          return;
        }

        reviewData = {
          dormitoryReview: {
            dormitoryId: dormitoryId,
            capacity:
              review.roomCapacity || dormitoryReview.roomType === "1인실"
                ? 1
                : 2,
            dormFee: review.dormitoryFee || 0,
            floor:
              review.floorType === "지하층"
                ? "BASEMENT"
                : review.floorType === "저층"
                  ? "LOW"
                  : review.floorType === "중층"
                    ? "MID"
                    : review.floorType === "고층"
                      ? "HIGH"
                      : review.floorType === "옥탑층"
                        ? "ATTIC"
                        : "MID",
            rating: rating,
            content:
              review.description ||
              review.content ||
              dormitoryReview.description ||
              "",
          },
          imageUrls: review.images || dormitoryReview.images || [],
          buildingRequest: {
            // 기숙사는 buildingCode에 Kakao 장소 ID를 저장
            // DormitoryInputPage에서 키워드 검색 API로 얻은 장소 ID 사용
            buildingCode: review.buildingCode,
            name:
              (review as any).dormitoryName ||
              review.detailedAddress ||
              "기숙사명",
            type: "DORMITORY",
            address: review.address || "",
            latitude: review.latitude!,
            longitude: review.longitude!,
          },
          keywords: {
            positive: positiveKeywords,
            negative: negativeKeywords,
          },
          condition: {
            currentRegion: review.dormitoryConditions?.residenceArea || "",
            currentGrade:
              review.dormitoryConditions?.semesterGrade?.toString() || "",
          },
          facilities: {
            privateFacilities: privateFacilities,
            publicFacilities: publicFacilities,
            lounge: lounge,
          },
        };
      } else if (review.housingType === "공인중개사") {
        reviewData = {
          agencyReview: {
            rating: rating,
            content: review.description || review.content || "",
          },
          imageUrls: review.images || [],
          buildingRequest: {
            ...(review.buildingCode && { buildingCode: review.buildingCode }),
            name: review.detailedAddress || "공인중개사명",
            type: "AGENCY",
            address: review.address || "",
            latitude: review.latitude!,
            longitude: review.longitude!,
          },
          keywords: {
            positive: positiveKeywords,
            negative: negativeKeywords,
          },
        };
      } else {
        reviewData = {
          generalReview: {
            contractType:
              review.contractType === "월세" ? "MONTHLY_RENT" : "DEPOSIT_RENT",
            deposit: review.deposit || 0,
            monthlyRent:
              review.contractType === "전세" ? null : review.monthlyRent || 0,
            maintenanceCost: review.managementFee || 0,
            floor:
              review.floorType === "지하층"
                ? "BASEMENT"
                : review.floorType === "저층"
                  ? "LOW"
                  : review.floorType === "중층"
                    ? "MID"
                    : review.floorType === "고층"
                      ? "HIGH"
                      : review.floorType === "옥탑층"
                        ? "ATTIC"
                        : "MID",
            space: review.space || 25, // 평수 필드 사용, 기본값 25
            rating: rating,
            content: review.description || review.content || "",
          },
          imageUrls: review.images || [],
          buildingRequest: {
            // 공인중개사가 아닌 경우에만 buildingCode 포함
            ...(review.buildingCode &&
              review.housingType !== "공인중개사" && {
                buildingCode: review.buildingCode,
              }),
            name: review.detailedAddress || "건물명",
            type: koreanToType[review.housingType] || "APARTMENT",
            address: review.address || "",
            latitude: review.latitude!,
            longitude: review.longitude!,
          },
          keywords: {
            positive: positiveKeywords,
            negative: negativeKeywords,
          },
        };
      }

      // 리뷰 제출 직전에 자동저장 데이터 재확인
      const latestAutoSavedData = reviewAutoSave.load();
      if (latestAutoSavedData) {
        autoSavedBase64ImagesRef.current = {
          reviewImages: latestAutoSavedData.reviewBase64Images || [],
          dormitoryImages: latestAutoSavedData.dormitoryBase64Images || [],
        };
      }

      // 자동저장된 base64 이미지 처리
      const isDormitoryType = review.housingType === "기숙사";
      const availableBase64Images = isDormitoryType
        ? autoSavedBase64ImagesRef.current.dormitoryImages
        : autoSavedBase64ImagesRef.current.reviewImages;

      // 이미지 데이터 최종 확인 (자동저장 데이터 및 현재 상태 모두 확인)
      let finalImageData: string[] = [];

      // 1. 먼저 사용 가능한 base64 이미지 확인
      if (availableBase64Images.length > 0) {
        finalImageData = availableBase64Images;
      }
      // 2. base64가 없으면 현재 reviewData의 imageUrls 확인
      else if (reviewData.imageUrls && reviewData.imageUrls.length > 0) {
        finalImageData = reviewData.imageUrls;
      }
      // 3. 그래도 없으면 자동저장 데이터에서 직접 확인
      else if (
        latestAutoSavedData &&
        ((isDormitoryType &&
          latestAutoSavedData.dormitoryBase64Images &&
          latestAutoSavedData.dormitoryBase64Images.length > 0) ||
          (!isDormitoryType &&
            latestAutoSavedData.reviewBase64Images &&
            latestAutoSavedData.reviewBase64Images.length > 0))
      ) {
        finalImageData = isDormitoryType
          ? latestAutoSavedData.dormitoryBase64Images || []
          : latestAutoSavedData.reviewBase64Images || [];
      }

      // 이미지가 있을 때만 업데이트
      if (finalImageData && finalImageData.length > 0) {
        reviewData.imageUrls = finalImageData;
      }

      // 이미지 URL 처리 - 자동저장된 base64 또는 blob URL 업로드
      if (reviewData.imageUrls && reviewData.imageUrls.length > 0) {
        const blobUrls = reviewData.imageUrls.filter((url: string) =>
          url.startsWith("blob:")
        );
        const base64Urls = reviewData.imageUrls.filter((url: string) =>
          url.startsWith("data:")
        );
        const cdnUrls = reviewData.imageUrls.filter(
          (url: string) => !url.startsWith("blob:") && !url.startsWith("data:")
        );

        let uploadedUrls: string[] = [];

        // base64 이미지가 있으면 업로드
        if (base64Urls.length > 0) {
          try {
            const { imageUploadAPI } = await import("../../api/imageUpload");
            uploadedUrls = await imageUploadAPI.uploadBase64Images(
              base64Urls,
              "review"
            );
          } catch (base64Error: any) {
            if (base64Error.response?.status === 401) {
              alert("로그인이 만료되었습니다. 다시 로그인해 주세요.");
            } else {
              alert("이미지 업로드에 실패했습니다. 다시 시도해 주세요.");
            }
            setIsSubmitting(false);
            return;
          }
        }
        // blob URL이 있으면 업로드
        else if (blobUrls.length > 0) {
          try {
            const { imageUploadAPI } = await import("../../api/imageUpload");
            uploadedUrls = await imageUploadAPI.uploadBlobUrls(
              blobUrls,
              "review"
            );
          } catch (blobError: any) {
            if (blobError.response?.status === 401) {
              alert("로그인이 만료되었습니다. 다시 로그인해 주세요.");
            } else {
              alert("이미지 업로드에 실패했습니다. 다시 시도해 주세요.");
            }
            setIsSubmitting(false);
            return;
          }
        }

        // 최종 이미지 URL 목록 구성
        reviewData.imageUrls = [...cdnUrls, ...uploadedUrls];
      }

      // 실제 API 호출
      try {
        await createReviewMutation.mutateAsync(reviewData);

        // 리뷰 제출 성공 시 자동저장 데이터 삭제
        reviewAutoSave.clear();

        // GA4 Review Funnel Tracking: Completion Event
        // 리뷰 작성 완료 이벤트 전송
        TagManager.dataLayer({
          dataLayer: {
            event: 'review_write_completed',
            buildingId: reviewData.buildingRequest?.buildingCode || 'new_building',
          },
        });

        setIsSubmitting(false);
        setShowConfirmModal(false);
        navigate("/mypage");
        setReview(defaultReviewState);
      } catch (error: any) {
        setIsSubmitting(false);

        // 에러 메시지 처리
        const errorMessage = error.response?.data?.message;

        alert(
          `리뷰 작성 중 오류가 발생했습니다: ${errorMessage || error.message}`
        );
      }
    } catch (error) {
      setIsSubmitting(false);
      alert("리뷰 제출 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const navigateToHousingType = () => {
    navigate("/review/type", {
      state: {
        ...locationState,
        housingType: review.housingType,
        from: "confirm",
      },
      replace: true,
    });
  };

  const navigateToAddress = () => {
    navigate("/review/address", {
      state: {
        ...locationState,
        housingType: review.housingType,
        from: "confirm",
      },
      replace: true,
    });
  };

  const navigateToDetailedAddress = () => {
    if (review.housingType === "공인중개사") {
      navigate("/review/result", {
        state: {
          ...locationState,
          address: {
            roadAddress: review.address || "",
            jibunAddress: review.addressDetail || "",
            buildingName: review.detailedAddress || "",
            buildingCode: review.buildingCode || "",
          },
          buildingName: review.detailedAddress || "",
          housingType: review.housingType,
          from: "confirm",
        },
      });
    } else if (review.housingType === "기숙사") {
      navigate("/review/dormitory", {
        state: {
          address: {
            roadAddress: review.address || "",
            jibunAddress: review.addressDetail || "",
            buildingName: review.detailedAddress || "",
          },
          buildingName: review.detailedAddress || "",
          roomCapacity: review.roomCapacity || 0,
          floor: review.floorType || "",
          from: "confirm",
        },
      });
    } else {
      navigate("/review/floor", {
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
    if (review.housingType === "기숙사") {
      navigate("/review/dormitory-conditions", {
        state: {
          from: "confirm",
        },
      });
    } else {
      navigate("/review/price", {
        state: {
          from: "confirm",
        },
      });
    }
  };

  const navigateToContractDetails = () => {
    if (review.housingType === "기숙사") {
      navigate("/review/dormitory-amenities", {
        state: {
          from: "confirm",
        },
      });
    } else {
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
    }
  };

  const navigateToPhotos = () => {
    navigate("/review/room-info", {
      state: {
        address: {
          roadAddress: review.address || "",
          jibunAddress: review.addressDetail || "",
          buildingName: review.detailedAddress || "",
        },
        buildingName: review.detailedAddress || "",
        floor: review.floorType || "",
        paymentType: review.contractType || locationState?.paymentType || "",
        priceData: {
          deposit: review.deposit || 0,
          monthlyRent: review.monthlyRent || 0,
          managementFee: review.managementFee || 0,
        },
        roomData: locationState?.roomData,
        housingType: review.housingType,
        from: "confirm",
      },
      replace: true,
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
        housingType: review.housingType,
        from: "confirm",
      },
      replace: true,
    });
  };

  const navigateToCons = () => {
    navigate("/review/filter-disad", {
      state: {
        ...locationState,
        photos: review.images,
        advantages: review.pros,
        disadvantages: review.cons,
        content: review.content,
        housingType: review.housingType,
        from: "confirm",
      },
      replace: true,
    });
  };

  const navigateToContent = () => {
    navigate("/review/content", {
      state: {
        ...locationState,
        photos: review.images,
        advantages: review.pros,
        disadvantages: review.cons,
        content: review.content,
        housingType: review.housingType,
        from: "confirm",
      },
      replace: true,
    });
  };

  const navigateToUniversityInput = () => {
    navigate("/review/university-input", {
      state: {
          address: {
            roadAddress: review.address || "",
            jibunAddress: review.addressDetail || "",
            buildingName: review.detailedAddress || "",
          },
          buildingName: review.detailedAddress || "",
          university: review.universityName || "",
          from: "confirm",
        },
        replace: true,
    })
  }

  // 65자 이상일 경우 ... 표시하는 함수
  const truncateReviewText = (text: string): string => {
    if (!text) return "후기를 작성해주세요";

    const maxChars = 68;

    if (text.length > maxChars) {
      return text.slice(0, maxChars) + "...";
    }

    return text;
  };


  // 태그 표시 함수 수정
  const renderTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return null;

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

          const iconSrc = getIconFromLabel(tagLabel);

          return (
            <span key={index} className={styles.tag}>
              {iconSrc && (
                <img
                  src={iconSrc}
                  alt={shortLabel}
                  className={styles.tagIcon}
                />
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
                  {review.housingType || "유형을 선택해주세요"}
                </span>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>

            <div
              className={styles.infoItem}
              onClick={() => isDormitory ? null : handleItemClick(navigateToAddress)}
            >
              <span className={styles.label}>주소</span>
              <div className={styles.value}>
                <div>
                  <span className={styles.valueText}>
                    {review.address || "주소를 입력해주세요"}
                  </span>
                </div>
                {!isDormitory && <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />}
              </div>
            </div>

            {isDormitory && (
              <div
                className={styles.infoItem}
                onClick={() => handleItemClick(navigateToUniversityInput)}
              >
                <span className={styles.label}>기숙사명</span>
                <div className={styles.value}>
                  <span className={styles.valueText}>
                      {(review as any).universityName || "대학교를 입력해주세요"}
                      <br />
                      {(review as any).dormitoryName ||
                        "기숙사명을 입력해주세요"}
                  </span>
                  <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
                </div>
              </div>
            )}

            <div
              className={styles.infoItem}
              onClick={() => handleItemClick(navigateToDetailedAddress)}
            >
              <span className={styles.label}>
                {isAgency ? "상호명" : "상세 주소"}
              </span>
              <div className={styles.value}>
                <span className={styles.valueText}>
                  {isDormitory ? `${review.roomCapacity}인실` : isAgency ? (
                    review.detailedAddress || "상호명을 입력해주세요"
                  ) : (
                    review.detailedAddress || "상세 주소를 입력해주세요"
                  )}
                  <br />
                  {!isAgency && review.floorType}
                </span>
                <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
              </div>
            </div>
            {review.housingType !== "공인중개사" && (
              <>
                <div
                  className={styles.infoItem}
                  onClick={() => handleItemClick(navigateToContractType)}
                >
                  <span className={styles.label}>
                    {review.housingType === "기숙사"
                      ? "입주 조건"
                      : "계약 형태"}
                  </span>
                  <div className={styles.value}>
                    <div className={styles.contractDetails}>
                      {review.housingType === "기숙사" ? (
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
                          {review.contractType || "계약 형태를 선택해주세요"}
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
                    {review.housingType === "기숙사"
                      ? "편의 시설"
                      : "계약 조건"}
                  </span>
                  <div className={styles.value}>
                    <div className={styles.contractDetails}>
                      {review.housingType === "기숙사" ? (
                        dormitoryReview.facilityConditions ? (
                          <>
                            {Object.entries(
                              dormitoryReview.facilityConditions
                            ).map(([facility, options]) => {
                              const selectedOption = Object.entries(
                                options as Record<string, boolean>
                              ).find(([_, selected]) => selected)?.[0];
                              // 선택된 옵션이 있으면 항상 표시 ("없음" 포함)
                              return selectedOption ? (
                                <span
                                  key={facility}
                                  className={styles.valueText}
                                >
                                  {facility} {selectedOption}
                                </span>
                              ) : null;
                            })}
                          </>
                        ) : (
                          <span className={styles.valueText}>
                            편의시설 정보를 입력해주세요
                          </span>
                        )
                      ) : (
                        <>
                          <span className={styles.valueText}>
                            {review.deposit
                              ? `보증금 ${review.deposit}만원`
                              : "보증금 정보 없음"}
                          </span>
                          {(!review.contractType ||
                            review.contractType === "월세") && (
                            <span className={styles.valueText}>
                              {review.monthlyRent
                                ? `월세 ${review.monthlyRent}만원`
                                : "월세 정보 없음"}
                            </span>
                          )}
                          <span className={styles.valueText}>
                            {review.managementFee
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
                  {review.images && review.images.length > 0 ? (
                    review.images
                      .slice(0, 3)
                      .map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`사진 ${index + 1}`}
                          className={styles.photoThumbnail}
                        />
                      ))
                  ) : (
                    <span className={styles.valueText}>
                      사진을 추가해주세요.
                    </span>
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
                    {truncateReviewText(
                      review.content || review.description || ""
                    )}
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
          currentStep="confirm"
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
