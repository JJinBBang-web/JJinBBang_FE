import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import styles from "./UpdateBuildTypePage.module.css";
import backArrowIcon from "../../assets/image/backArrowIcon.svg";
import { updateReviewState } from "../../recoil/review/updateReviewAtoms";
import { defaultReviewState } from "../../recoil/review/reviewAtoms";
import { koreanToType, typeToKorean } from "../../util/mapping";


const UpdateBuildTypePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state || {};
    const { housingType } = locationState;
    const [review,setReview] = useRecoilState(updateReviewState);
    const originalType = review?.housingType || housingType || null;
    const [selectedType, setSelectedType] = useState<string | null>(
        review?.housingType || null
    );

    const handleTypeSelect = (korean: string) => {
        const englishType = koreanToType[korean];
        setSelectedType(englishType);
    };

    const { reviewId } = useParams();


    const handleNext = () => {
        if (selectedType) {
            // Recoil 상태 업데이트
            setReview((prev) => {
            // prev가 null이면 defaultReviewState 기반으로 생성
            const safePrev = prev ?? defaultReviewState;

            return {
                ...safePrev,
                housingType: selectedType,
            };
            });
        
            // 로컬 스토리지에 저장
            localStorage.setItem(
                "updateReviewState",
                JSON.stringify({
                ...review,
                housingType: selectedType,
                })
            );

            navigate(`/review/${reviewId}/update`, {
                state: {
                ...locationState,
                housingType: selectedType,
                },
            });
            }
      };
    
    const handleBack = () => {
        // 수정 모드일 경우
        if (locationState.from === "update") {
        navigate(`/review/${reviewId}/update`, {
            state: {
            ...location.state,
            },
        });
        }
    };

    return (
        <div className="content" style={{ backgroundColor: "var(--white)" }}>
            <div className={styles.container}>
                <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={backArrowIcon} alt="back" />
                </button>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill}></div>
                </div>
                <h1>찐빵 유형을 선택해 볼까요?</h1>
                </header>
                <div className={styles.buttonGroup}>
                {Object.values(typeToKorean).map((korean) => (
                    <button
                        key={korean}
                        className={`${styles.typeButton} ${
                        selectedType === koreanToType[korean] ? styles.selected : ""
                        }`}
                        onClick={() => handleTypeSelect(korean)}
                    >
                        {korean}
                    </button>
                    ))}
                </div>

                {/* 유형 선택 여부에 따라 버튼 레이아웃 변경 */}
                {selectedType ? (
                // 유형이 선택되면 [이전]과 [다음] 버튼을 함께 표시
                <div className={styles.buttonContainer}>
                    <button className={styles.prevButton} onClick={handleBack}>
                    이전
                    </button>
                    <button
                    className={`${styles.nextButton} ${styles.enabled}`}
                    onClick={handleNext}
                    >
                    확인
                    </button>
                </div>
                ) : (
                // 유형이 선택되지 않으면 [다음] 버튼만 표시 (비활성화 상태)
                <button
                    className={styles.nextButton}
                    onClick={handleNext}
                    disabled={!selectedType || selectedType === originalType}
                >
                    확인
                </button>
                )}
            </div>
        </div>
    );
}

export default UpdateBuildTypePage;