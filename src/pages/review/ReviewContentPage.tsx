import React, { useState, useRef, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { reviewState } from "../../recoil/review/reviewAtoms";
import styles from "../../styles/review/ReviewContent.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import { useReviewAutoSave } from "../../hooks/useReviewAutoSave";
import { reviewAutoSave, REVIEW_STEPS } from "../../util/reviewAutoSave";

interface LocationState {
  photos?: string[];
  advantages?: string[];
  disadvantages?: string[];
  from?: string;
}

const AutoHeightTextarea: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  maxLength: number;
  housingType: string;
}> = ({ value, onChange, placeholder, maxLength, housingType }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formattedPlaceholder =
    housingType === "공인중개사"
      ? "자세한 이야기는 찐빵 유저들에게 큰 도움이 돼요!\n\nex) 방문 후기, 중개 수수료 문제"
      : "찐거주 후기를 위해 특징과 장단점을 최소 50자 이상 적어주세요! 자세한 이야기는 찐빵 유저들에게 큰 도움이 돼요!\n\nex) 학교까지의 거리, 집주인과의 문제";

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "inherit";
    const computedHeight = Math.max(150, textarea.scrollHeight);
    textarea.style.height = `${computedHeight}px`;
  };

  useLayoutEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={styles.contentTextarea}
      value={value}
      onChange={onChange}
      placeholder={formattedPlaceholder}
      maxLength={maxLength}
      autoFocus
    />
  );
};

const ReviewContentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState) || {};
  const { housingType } = location.state;
  const { photos, advantages, disadvantages, from } =
    (location.state as LocationState) || {};

  const [review, setReview] = useRecoilState(reviewState);
  const { restoreAutoSavedData, clearAutoSavedData, hasAutoSavedData } =
    useReviewAutoSave("content");

  const isNavigatingRef = useRef(false);

  const [content, setContent] = useState(() => {
    // 확인 페이지에서 돌아온 경우 location state의 content 우선
    if (from === "confirm" && (location.state as any)?.content) {
      return (location.state as any).content;
    }
    // 자동저장에서 복원된 경우 review state의 description 사용
    if (from === "autosave" && review.description) {
      return review.description;
    }
    // 확인 페이지에서 돌아온 경우 review state의 description 사용
    if (from === "confirm" && review.description) {
      return review.description;
    }
    // 새로운 리뷰 작성 시에는 항상 빈 내용으로 시작
    return "";
  });

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  const maxLength = 1000;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength && !isNavigatingRef.current) {
      const newContent = e.target.value;
      setContent(newContent);

      // 실시간으로 review state 업데이트 (자동 저장 트리거)
      // "다음" 버튼 클릭 후에는 업데이트하지 않음
      setReview((prev) => ({
        ...prev,
        description: newContent,
      }));
    }
  };

  const handleNext = async () => {
    const trimmedContent = content.trim();
    const trimmedLength = trimmedContent.length;

    if (trimmedLength === 0) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (trimmedLength < 50) {
      alert("최소 50자 이상 작성해야 해요!");
      return;
    }

    // review state 최종 업데이트 및 currentStep을 'confirm'으로 설정
    const updatedReview = {
      ...review,
      description: trimmedContent,
    };

    setReview(updatedReview);

    if (from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
          content: trimmedContent,
        },
      });
    } else {
      // "다음" 버튼 클릭 플래그 설정 (실시간 자동저장 방지)
      isNavigatingRef.current = true;

      // "다음" 버튼 클릭 시 자동저장에 confirm 단계로 기록
      await reviewAutoSave.save({
        reviewState: updatedReview,
        dormitoryReviewState: null,
        currentStep: REVIEW_STEPS.CONFIRM,
      });

      navigate("/review/confirm", {
        state: {
          housingType,
          photos,
          advantages,
          disadvantages,
          content: trimmedContent,
        },
      });
    }
  };

  const handleBack = () => {
    if (from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
        },
        replace: true,
      });
    } else {
      // 이전 페이지로 이동 (단점 페이지를 가정)
      navigate("/review/filter-disad", {
        state: location.state,
        replace: false,
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
            onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
          <h1>
            {housingType === "공인중개사"
              ? "마지막으로 이 공인중개사에 대해"
              : "마지막으로 이 찐빵에 대해"}
            <br></br>좀 더 자세하게 알려줄 수 있나요?
          </h1>
        </header>

        <div className={styles.textareaContainer}>
          <AutoHeightTextarea
            value={content}
            onChange={handleContentChange}
            placeholder=""
            maxLength={maxLength}
            housingType={housingType}
          />
          <div className={styles.charCount}>
            <span>{content.length}</span>
            <span>/{maxLength}</span>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={handleBack}>
          이전
        </button>
        <button
          className={`${styles.nextButton} ${
            content.trim().length >= 50 ? styles.enabled : ""
          }`}
          onClick={handleNext}
        >
          다음
        </button>
      </footer>

      {showCancelModal && (
        <CancelModal
          onClose={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
          currentStep="content"
        />
      )}
    </div>
  );
};

export default ReviewContentPage;
