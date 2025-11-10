import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { reviewState } from "../../recoil/review/reviewAtoms";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import { useReviewAutoSave } from "../../hooks/useReviewAutoSave";
import { reviewAutoSave, REVIEW_STEPS } from "../../util/reviewAutoSave";
import styles from "../../styles/review/PriceInput.module.css";
import closeIcon from "../../assets/image/iconClose.svg";

interface LocationState {
  address: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  buildingName: string;
  floor: string;
  paymentType: string;
  from?: string;
}

const WolseInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from, address, buildingName, floor, paymentType } =
    (location.state as LocationState) || {};
  const [review, setReview] = useRecoilState(reviewState);

  const [deposit, setDeposit] = useState<string>(
    review.deposit ? review.deposit.toString() : ""
  );
  const [monthlyRent, setMonthlyRent] = useState<string>(
    review.monthlyRent ? review.monthlyRent.toString() : ""
  );
  const [managementFee, setManagementFee] = useState<string>(
    review.managementFee ? review.managementFee.toString() : ""
  );

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // 자동 저장 기능 추가
  useReviewAutoSave('wolse');

  useEffect(() => {
    // 수정 모드일 경우 기존 상태 복원
    if (from === "confirm") {
      setDeposit(review.deposit ? review.deposit.toString() : "");
      setMonthlyRent(review.monthlyRent ? review.monthlyRent.toString() : "");
      setManagementFee(
        review.managementFee ? review.managementFee.toString() : ""
      );
    }
  }, [from, review]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
    field: 'deposit' | 'monthlyRent' | 'managementFee'
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setter(value);

    // 실시간으로 review state 업데이트 (자동 저장 트리거)
    setReview((prev) => ({
      ...prev,
      [field]: value === '' ? null : Number(value),
    }));
  };

  const formatNumber = (value: string) => {
    if (!value) return "";
    return Number(value).toLocaleString();
  };

  const validateInputs = () => {
    if (monthlyRent.trim() === "") {
      alert("월세를 입력해 주세요!");
      return false;
    }
    if (deposit.trim() === "") {
      alert("보증금을 입력해 주세요!");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateInputs()) return;

    // 단위 확인 alert 표시
    const confirmed = window.confirm(
      "단위를 맞게 기입하였나요?\n\n예시) 관리비 300,000 원 → 30 입력"
    );

    if (!confirmed) {
      return; // 사용자가 수정을 선택하면 현재 페이지에 머무름
    }

    const updatedReview = {
      ...review,
      contractType: paymentType,
      deposit: Number(deposit),
      monthlyRent: Number(monthlyRent),
      managementFee: Number(managementFee) || null,
    };

    setReview(updatedReview);

    const priceData = {
      deposit: Number(deposit),
      monthlyRent: Number(monthlyRent),
      managementFee: Number(managementFee) || null,
    };

    if (from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
          priceData,
        },
      });
    } else {
      // "다음" 버튼 클릭 시 자동저장에 다음 단계 기록
      reviewAutoSave.save({
        reviewState: updatedReview,
        dormitoryReviewState: null,
        currentStep: REVIEW_STEPS.ROOM_INFO
      });

      navigate("/review/room-info", {
        state: {
          ...location.state,
          priceData,
        },
      });
    }
  };

  const handleBack = () => {
    if (from === "confirm") {
      navigate("/review/confirm", { replace: true });
    } else {
      // 이전 페이지로 이동 (PaymentTypePage로)
      navigate("/review/price", {
        state: location.state,
        replace: false,
      });
    }
  };

  // 각 항목이 입력되었는지만 확인 (0도 유효한 값으로 허용)
  const isNextEnabled =
    deposit.trim() !== "" &&
    monthlyRent.trim() !== "" &&
    managementFee.trim() !== "";

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
          <h1>월세 계약 조건은 어떻게 되나요?</h1>
        </header>

        <div className={styles.inputGroup}>
          <div className={styles.inputContainer}>
            <label className={styles.label}>보증금</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                value={formatNumber(deposit)}
                onChange={(e) => handleInputChange(e, setDeposit, 'deposit')}
                placeholder="0"
              />
              <span className={styles.unit}>만원</span>
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label}>월세</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                value={formatNumber(monthlyRent)}
                onChange={(e) => handleInputChange(e, setMonthlyRent, 'monthlyRent')}
                placeholder="0"
              />
              <span className={styles.unit}>만원</span>
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label}>관리비</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                value={formatNumber(managementFee)}
                onChange={(e) => handleInputChange(e, setManagementFee, 'managementFee')}
                placeholder="0"
              />
              <span className={styles.unit}>만원</span>
            </div>
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
          currentStep="wolse"
        />
      )}
    </div>
  );
};

export default WolseInputPage;
