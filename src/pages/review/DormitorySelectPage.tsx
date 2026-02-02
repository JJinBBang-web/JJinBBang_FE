import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/review/FloorInput.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { reviewState } from "../../recoil/review/reviewAtoms";
import { useDormitoriesByCampusId } from "../../hooks/useDormitoriesByCampusId";
import DormitoryCard from "../../components/review/DormitoryCard";
import { useCancelModal } from "../../util/useCancelModal";
import CancelModal from "../../components/review/CancelModal";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lottie/loading.json";
import bigSearchIcon from "../../assets/image/bigSearchIcon.svg";

interface LocationState {
  address: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  from?: string;

  campusId?: number;
}

const DormitorySelectPage:React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [review, setReview] = useRecoilState(reviewState);
  const { from, campusId } = (location.state as LocationState) || {};

  const [selectedDormitoryId, setSelectedDormitoryId] = useState<number | null>(null);

  const dormQuery = useDormitoriesByCampusId({
    campusId,
    enabled: true,
  });

  const dormitories = dormQuery.data?.dormitories ?? []; 

  const selectedDormitory = useMemo(
    () => dormitories.find((d: any) => d.dormitoryId === selectedDormitoryId) ?? null,
    [dormitories, selectedDormitoryId]
  );

  const nextEnabled = !!selectedDormitory;

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();
    
  const handleBack = () => {
    if (from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
        },
      });
    } else {
      navigate("/review/university-input", {
        state: {
          ...location.state,
        },
      });
    }
  };

  const handleNext = () => {
    if (!selectedDormitory) return;

    setReview(prev => ({
        ...prev,
        dormitoryId: selectedDormitory.dormitoryId,
        dormitoryName: selectedDormitory.dormitoryName,
        address: selectedDormitory.dormitoryAddress,   // ✅ Confirm 주소에 뜸
        detailedAddress: selectedDormitory.dormitoryName, // UI에 쓸 거면
        // latitude: selectedDormitory.latitude,          // ✅ 제출 체크 통과
        // longitude: selectedDormitory.longitude,
        // buildingCode: selectedDormitory.buildingCode,  // ✅ 카카오 place id 같은 값
    }));

    const nextState = {
      ...location.state,
      dormitoryId: selectedDormitory.dormitoryId,
      dormitoryName: selectedDormitory.dormitoryName, // 필드명 맞춰서
    };

    if (from === "confirm") {
      navigate("/review/confirm", {
        state: nextState
      });
    } else {
      navigate("/review/dormitory", {
        state: nextState
      });
    }
  };

  return (
    <div
      className="content"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <div
        className={styles.container}
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{width:"33%"}}></div>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
          <h1>살았던 학교 기숙사를 선택해주세요</h1>
        </header>

        <div style={{ flex: 1, overflow: "auto", padding: "2px" }}>
          {dormQuery.isFetching && (
            <div
                style={{
                  padding: "6.5rem 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection:"column",
                  gap: "32px",
                }}
              >
                <div className={styles.lottiesImg}>
                  <Lottie
                    animationData={loadingAnimation}
                    loop
                    autoplay
                    style={{ width:70 }}
                />
                <img src={bigSearchIcon} className={styles.bigSearchIcon}/>
                </div>
                <p className={styles.loadingText}>검색중이에요<br/>잠시만 기다려주세요!</p>
              </div>
          )}

          {dormQuery.isError && (
            <div style={{ padding: "8px 0", fontSize: 13, color: "#ff3b30" }}>
              기숙사 목록을 불러오지 못했어요.
            </div>
          )}

          {!dormQuery.isFetching && dormitories.length === 0 && (
            <div style={{ padding: "12px 0", fontSize: 13, color: "#777" }}>
              등록된 기숙사 정보가 없어요.
            </div>
          )}
          {/* 리스트 */}
          <div style={{ display: "grid", paddingBottom: "6.5rem"}}>
            {dormitories.map((d) => (
              <div key={d.dormitoryId}>
              <DormitoryCard
                  campusName={d.campusName}
                  dormitoryName = {d.dormitoryName}
                  address = {d.dormitoryAddress}
                  selected={d.dormitoryId === selectedDormitoryId}
                  onClick={() => setSelectedDormitoryId(d.dormitoryId)}
                />
              <hr style={{ width: "100%", border:"none", height: "1px", backgroundColor:"var(--color-gray10)", margin:"0"}}/>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.buttonContainer}>
            <button className={styles.prevButton} onClick={handleBack}>
                이전
            </button>
            <button
                className={`${styles.nextButton} ${nextEnabled ? styles.enabled : ""}`}
                onClick={handleNext}
                disabled={!nextEnabled}
            >
                다음
            </button>
        </div>
      </div>
      {showCancelModal && (
        <CancelModal
          onClose={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  )
};

export default DormitorySelectPage; 