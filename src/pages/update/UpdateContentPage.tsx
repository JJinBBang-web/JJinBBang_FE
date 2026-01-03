import { useNavigate, useLocation, useParams } from "react-router-dom";
import styles from "./UpdateContentPage.module.css";
import { useRecoilState } from "recoil";
import { updateReviewState } from "../../recoil/review/updateReviewAtoms";
import backArrowIcon from "../../assets/image/backArrowIcon.svg";
import { useLayoutEffect, useRef, useState } from "react";

const AutoHeightTextarea: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  maxLength: number;
  housingType: string;
}> = ({ value, onChange, placeholder, maxLength, housingType }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formattedPlaceholder =
    housingType === "AGENCY"
      ? "자세한 이야기는 찐빵 유저들에게 큰 도움이 돼요!\n\nex) 방문 후기, 중개 수수료 문제"
      : "찐거주 후기를 위해 특징과 장단점을 최소 100자 이상 적어주세요! 자세한 이야기는 찐빵 유저들에게 큰 도움이 돼요!\n\nex) 학교까지의 거리, 집주인과의 문제";

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

const UpdateContentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};
  const { housingType, from } = locationState;
  const [review, setReview] = useRecoilState(updateReviewState);
  const [content, setContent] = useState(() => {
    return locationState.description || review?.description || "";
  });

  const maxLength = 1000;

  const { reviewId } = useParams();

  const handleBack = () => {
    // 수정 모드일 경우
    if (locationState.from === "update") {
      navigate(`/review/${reviewId}/update`, {
        replace: true,
        state: {
          ...location.state,
        },
      });
    }
  };

  const handleNext = () => {
    if (!review) return;

    if (content.trim().length === 0) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (content.trim().length < 50) {
      alert("최소 50자 이상 작성해야 해요!");
      return;
    }

    const updatedReview = {
      ...review,
      description: content,
      content: content,
    };

    setReview(updatedReview);

    if (from === "update") {
      navigate(`/review/${reviewId}/update`, {
        replace: true,
        state: {
          updatedReview,
        },
      });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setContent(e.target.value);
    }
  };

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <button className={styles.closeButton} onClick={handleBack}>
            <img src={backArrowIcon} alt="close" />
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
            content.trim().length > 0 ? styles.enabled : ""
          }`}
          onClick={handleNext}
          disabled={content.trim().length === 0}
        >
          확인
        </button>
      </footer>
    </div>
  );
};

export default UpdateContentPage;
