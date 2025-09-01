import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { updateReviewState } from "../../recoil/review/updateReviewAtoms";
import { koreanToContractType } from "../../util/mapping";
import styles from "./UpdateContractTypePage.module.css";
import backArrowIcon from "../../assets/image/backArrowIcon.svg";
import { defaultReviewState } from "../../recoil/review/reviewAtoms";



const UpdateContractTypePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state || {};
    const { contractType } = locationState;
    const [review,setReview] = useRecoilState(updateReviewState);
    const originalType = review?.contractType || contractType || null;


    const [selectedType, setSelectedType] = useState<string | null>(
        review?.contractType || null
    );
    const { reviewId } = useParams();
      
    const handleTypeSelect = (korean: string) => {
        const englishType = koreanToContractType[korean];
        setSelectedType(englishType);
    };

    const handleNext = () => {
        const englishType = selectedType as string;
        
        setReview((prev) => {
            const safePrev = prev ?? defaultReviewState;
            return {
            ...safePrev,
            contractType: englishType,
            };
        });

        const safeReview = review ?? defaultReviewState;

        localStorage.setItem(
            'updateReviewState',
            JSON.stringify({
                ...safeReview,
                contractType: englishType,
            })
        )
        navigate(`/review/${reviewId}/update/contract-price`, {
            state: {
            ...locationState,
            contractType: englishType,
            from: "contractType",
            },
        }); 
    };

    useEffect(() => {
        setSelectedType(review?.contractType || null);
      }, [review]);

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
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleBack}
          >
            <img src={backArrowIcon} alt="close" />
          </button>
          <h1>좋아요! 계약 형태를 선택해 주세요</h1>
        </header>
        <div className={styles.optionContainer}>
          <button
            className={`${styles.optionButton} ${
              selectedType === 'DEPOSIT_RENT' ? styles.selected : ''
            }`}
            onClick={() => handleTypeSelect('전세')}
          >
            전세
          </button>
          <button
            className={`${styles.optionButton} ${
              selectedType === 'MONTHLY_RENT' ? styles.selected : ''
            }`}
            onClick={() => handleTypeSelect('월세')}
          >
            월세
          </button>
        </div>
      </div>
      <footer className={styles.footer}>
        <button
          className={styles.prevButton}
          onClick={handleBack}
        >
          이전
        </button>
        <button
          className={`${styles.nextButton} ${
            selectedType ? styles.enabled : ''
          }`}
          onClick={handleNext}
          disabled={!selectedType}
        >
          확인
        </button>
      </footer>
    </div>
  );
};

export default UpdateContractTypePage;

