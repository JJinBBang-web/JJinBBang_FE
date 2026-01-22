// src/pages/review/DormitoryInputPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { reviewState, ReviewState } from "../../recoil/review/reviewAtoms";
import { selectedTypeNumState } from "../../Map/recoil/mapRecoilState";
import { universitiesState } from "../../Map/recoil/universityRecoilState";
import { isSheetOpenState } from "../../recoil/util/utilRecoilState";
import { UnivAPI } from "../../api/User/UserAPI";
import { UnivCampusInterface } from "../../types/entity/user/UnivInterface";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import styles from "../../styles/review/DormitoryInputPage.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import useReviewStepTracking from "../../hooks/useReviewStepTracking";

declare global {
  interface Window {
    kakao: any;
  }
}

const { kakao } = window;

// Extended ReviewState interface to include dormitory-specific fields
interface ExtendedReviewState extends ReviewState {
  university?: string;
  dormitoryName?: string;
}

interface LocationState {
  address?: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  buildingName?: string;
  floor?: string;
  from?: string;
}

const DormitoryInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState) || {};
  const { from, address } = locationState;
  const [review, setReview] = useRecoilState(reviewState);
  const [selectedTypeNum, setSelectedTypeNum] = useRecoilState(selectedTypeNumState);
  const universities = useRecoilValue(universitiesState);
  const setBottomSheet = useSetRecoilState(isSheetOpenState);
  const bottomSheet = useRecoilValue(isSheetOpenState);

  // 확장된 캠퍼스 인터페이스 (universityName 포함)
  interface ExtendedCampusInterface extends UnivCampusInterface {
    universityName: string;
  }
  const [campusList, setCampusList] = useState<ExtendedCampusInterface[]>([]);

  // Cast to ExtendedReviewState to work with our additional properties
  const extendedReview = review as unknown as ExtendedReviewState;

  // State for form fields
  const [university, setUniversity] = useState<string>(
    extendedReview.university || ""
  );
  const [dormitoryName, setDormitoryName] = useState<string>(
    extendedReview.dormitoryName || ""
  );
  const [roomCapacity, setRoomCapacity] = useState<string>(
    review.roomCapacity ? review.roomCapacity.toString() : ""
  );
  const [selectedFloor, setSelectedFloor] = useState<string>(
    review.floorType || "저층"
  );

  useReviewStepTracking('3-2.1_dormitory_input');

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // API에서 캠퍼스 목록 가져오기
  useEffect(() => {
    const fetchCampusList = async () => {
      try {
        const response = await UnivAPI.getUnivCampusList();
        // 모든 캠퍼스를 평탄화하여 하나의 배열로 만들기
        const allCampuses = response.flatMap((univ) =>
          univ.campuses.map((campus) => ({
            ...campus,
            logoImageUrl: campus.logoImageUrl || univ.universityLogo,
            universityName: univ.universityName, // 대학교 이름 추가
          }))
        );
        setCampusList(allCampuses);
      } catch (error) {
        console.error("캠퍼스 목록 로드 실패:", error);
      }
    };

    fetchCampusList();
  }, []);

  // Geocoder를 사용하여 주소를 좌표로 변환
  useEffect(() => {
    if (!address?.roadAddress) return;

    // 주소가 변경되었는지 확인 - review.address와 다르면 재변환
    const needsUpdate = review.address !== address.roadAddress;

    // 이미 좌표가 있고 주소가 동일하면 변환하지 않음
    if (review.latitude && review.longitude && !needsUpdate) {
      return;
    }

    const geoCoder = new kakao.maps.services.Geocoder();

    geoCoder.addressSearch(address.roadAddress, (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        const { x, y } = result[0];
        const lat = parseFloat(y);
        const lng = parseFloat(x);

        setReview((prev) => ({
          ...prev,
          address: address.roadAddress,
          latitude: lat,
          longitude: lng,
        }));
      }
    });
  }, [address?.roadAddress, review.address, review.latitude, review.longitude, setReview]);

  useEffect(() => {
    // Restore state from review if coming from confirm page
    if (from === "confirm") {
      setUniversity(extendedReview.university || "");
      setDormitoryName(extendedReview.dormitoryName || "");
      setRoomCapacity(
        review.roomCapacity ? review.roomCapacity.toString() : ""
      );
      setSelectedFloor(review.floorType || "저층");
    } else {
      // 처음 진입할 때는 대학교 선택 초기화
      setSelectedTypeNum(null);
      setUniversity("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from]);

  // Update university name when selectedTypeNum changes
  useEffect(() => {
    // selectedTypeNum이 변경될 때마다 대학교 정보를 업데이트
    // confirm 페이지에서 돌아온 경우는 제외 (이미 university가 설정되어 있음)
    if (selectedTypeNum && from !== "confirm" && campusList.length > 0) {
      // API에서 가져온 캠퍼스 목록에서 선택된 캠퍼스 찾기
      const selectedCampus = campusList.find(
        (campus) => campus.id === selectedTypeNum
      );

      if (selectedCampus) {
        setUniversity(
          `${selectedCampus.universityName} ${selectedCampus.campusName}`
        );
      } else {
        // 폴백: 하드코딩된 데이터에서 찾기
        const selectedUniversity = universities.find(
          (uni) => uni.id === selectedTypeNum
        );
        if (selectedUniversity) {
          setUniversity(
            `${selectedUniversity.universityName} ${selectedUniversity.campus}`
          );
        }
      }
    }
  }, [selectedTypeNum, campusList, universities, from]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setter(value);
  };

  const handleDormitoryNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDormitoryName(e.target.value);
  };

  const handleUniversityClick = () => {
    setBottomSheet({ isOpenModal: true, type: "university" });
  };

  const handleFloorSelect = (floor: string) => {
    setSelectedFloor(floor);
  };

  const handleNext = () => {
    // campusId 검증
    if (!selectedTypeNum) {
      alert("대학교를 선택해주세요.");
      return;
    }

    // 기숙사명으로 정확한 장소 ID 조회
    let finalBuildingCode = review.buildingCode || "";

    // 키워드 검색을 통해 장소 ID 업데이트 시도
    if (
      dormitoryName &&
      address?.roadAddress &&
      review.latitude &&
      review.longitude
    ) {
      // "도로명주소 + 기숙사명"으로 키워드 검색
      const searchQuery = `${address.roadAddress} ${dormitoryName}`;

      // Kakao Places 서비스 (키워드 검색 API를 JavaScript SDK로 접근)
      const ps = new kakao.maps.services.Places();

      // 검색 옵션: 좌표 기준으로 정확도 높이기
      const searchOptions = {
        location: new kakao.maps.LatLng(review.latitude, review.longitude),
        radius: 2000, // 2km 반경 내 검색
        size: 5,
      };

      ps.keywordSearch(
        searchQuery,
        (result: any, status: any) => {
          let updatedLat = review.latitude || undefined;
          let updatedLng = review.longitude || undefined;

          if (status === kakao.maps.services.Status.OK && result.length > 0) {
            finalBuildingCode = result[0].id; // Kakao 장소 ID
            // 키워드 검색 결과의 좌표 사용 (더 정확함)
            updatedLat = parseFloat(result[0].y);
            updatedLng = parseFloat(result[0].x);
          }

          // 검색 완료 후 다음 단계로 진행 (좌표도 함께 전달)
          proceedToNextStep(finalBuildingCode, updatedLat, updatedLng);
        },
        searchOptions
      );
    } else {
      proceedToNextStep(finalBuildingCode);
    }
  };

  // 다음 단계로 진행하는 함수 (키워드 검색 완료 후 호출)
  const proceedToNextStep = (
    finalBuildingCode: string,
    updatedLat?: number,
    updatedLng?: number
  ) => {
    const updatedReview = {
      ...review,
      roomCapacity: Number(roomCapacity),
      floorType: selectedFloor,
      dormitoryFee: 0, // 기숙사비 제거, 기본값 설정
      buildingCode: finalBuildingCode, // Kakao 장소 ID를 buildingCode로 업데이트
      // 키워드 검색으로 얻은 좌표가 있으면 업데이트
      ...(updatedLat && updatedLng && {
        latitude: updatedLat,
        longitude: updatedLng,
      }),
    };

    const extendedUpdatedReview = {
      ...updatedReview,
      university: university,
      dormitoryName: dormitoryName,
      campusId: selectedTypeNum, // 선택한 캠퍼스의 ID 저장
    } as unknown as ReviewState;

    setReview(extendedUpdatedReview);

    const dormitoryData = {
      university: university,
      dormitoryName: dormitoryName,
      roomCapacity: Number(roomCapacity),
      floorType: selectedFloor,
    };

    if (from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
          dormitoryData,
        },
      });
    } else {
      navigate("/review/dormitory-conditions", {
        state: {
          ...location.state,
          dormitoryData,
        },
      });
    }
  };

  const handleBack = () => {
    if (from === "confirm") {
      navigate("/review/confirm");
    } else {
      navigate(-1);
    }
  };

  // 수정된 조건: 기숙사비 제거, 층수 선택 추가
  const isNextEnabled =
    university !== "" &&
    dormitoryName !== "" &&
    roomCapacity !== "" &&
    selectedFloor !== "";

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
          <h1>기숙사명 및 상세정보가 있으면 좋겠어요!</h1>
        </header>

        <div className={styles.inputSection}>
          <label className={styles.label}>대학교</label>
          <div
            className={`${styles.buildingInput} ${!university ? styles.empty : ""}`}
            onClick={handleUniversityClick}
          >
            {university || "예) 찐빵대학교"}
          </div>

          <label className={styles.label}>기숙사명</label>
          <input
            type="text"
            className={`${styles.buildingInput} ${!dormitoryName ? styles.empty : ""}`}
            value={dormitoryName}
            onChange={handleDormitoryNameChange}
            placeholder="예) 찐빵관"
          />

          <label className={styles.label}>방 인원</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.buildingInput}
              value={roomCapacity}
              onChange={(e) => handleInputChange(e, setRoomCapacity)}
              placeholder="0"
            />
            <span className={styles.unit}>인실</span>
          </div>
        </div>

        <div className={styles.floorSection}>
          <label className={styles.label}>층수</label>
          <div className={styles.floorOptions}>
            <button
              className={`${styles.floorButton} ${
                selectedFloor === "저층" ? styles.selected : ""
              }`}
              onClick={() => handleFloorSelect("저층")}
            >
              저층
            </button>
            <button
              className={`${styles.floorButton} ${
                selectedFloor === "중층" ? styles.selected : ""
              }`}
              onClick={() => handleFloorSelect("중층")}
            >
              중층
            </button>
            <button
              className={`${styles.floorButton} ${
                selectedFloor === "고층" ? styles.selected : ""
              }`}
              onClick={() => handleFloorSelect("고층")}
            >
              고층
            </button>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={handleBack}>
          이전
        </button>
        <button
          className={`${styles.nextButton} ${
            isNextEnabled ? styles.enabled : ""
          }`}
          onClick={handleNext}
          disabled={!isNextEnabled}
        >
          다음
        </button>
      </footer>

      {showCancelModal && (
        <CancelModal
          onClose={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
};

export default DormitoryInputPage;
