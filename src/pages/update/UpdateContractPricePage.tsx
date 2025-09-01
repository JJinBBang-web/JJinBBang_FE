import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { updateReviewState } from "../../recoil/review/updateReviewAtoms";
import styles from "./UpdateContractPricePage.module.css";
import backArrowIcon from "../../assets/image/backArrowIcon.svg";

const UpdateContractPriceTypePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};
  const { deposit: initDeposit, monthlyRent: initMonthlyRent, managementFee: initManagementFee } = locationState;

  const [review, setReview] = useRecoilState(updateReviewState);
  const contractType = review?.contractType;
  const { reviewId } = useParams();

  // useState로 입력값 관리
  const [deposit, setDeposit] = useState<string>(String(initDeposit ?? review?.deposit ?? ""));
  const [monthlyRent, setMonthlyRent] = useState<string>(String(initMonthlyRent ?? review?.monthlyRent ?? ""));
  const [managementFee, setManagementFee] = useState<string>(String(initManagementFee ?? review?.managementFee ?? ""));

  const formatNumber = (value: string) => {
    if (!value) return '';
    return Number(value).toLocaleString();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(value);
  };

  const isNextEnabled =
    contractType === 'DEPOSIT_RENT'
      ? deposit.trim() !== ''
      : deposit.trim() !== '' && monthlyRent.trim() !== '';

  const validateInputs = () => {
    if (contractType === 'MONTHLY_RENT' && monthlyRent.trim() === '') {
      alert('월세를 입력해 주세요!');
      return false;
    }
    if (deposit.trim() === '') {
      alert('보증금을 입력해 주세요!');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!review) return;
    
    if (!validateInputs()) return;

    const updatedReview = {
      ...review,
      deposit: Number(deposit),
      monthlyRent: contractType === 'MONTHLY_RENT' ? Number(monthlyRent) : null,
      managementFee: Number(managementFee),
    };

    setReview(updatedReview);
    localStorage.setItem('updateReviewState', JSON.stringify(updatedReview));

    // 다음 단계로 이동 (예: Confirm 페이지)
    navigate(`/review/${reviewId}/update`);
  };

  const handleBack = () => {
    if (!validateInputs()) return;
    
    if (locationState.from === "contractType") {
      // 계약 형태 페이지에서 온 경우 - 뒤로 가기 (계약 형태 페이지로)
      navigate(-1);
    } else if (locationState.from === "update") {
      // 수정 페이지에서 직접 온 경우 - ReviewConfirmPage로 돌아가기
      navigate(`/review/${reviewId}/update`, {
        state: { ...location.state },
      });
    } else {
      // 기본값: 이전 페이지로 돌아가기
      navigate(-1);
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
          {contractType === 'DEPOSIT_RENT'
            ? '전세 계약 조건은 어떻게 되나요?'
            : '월세 계약 조건은 어떻게 되나요?'}
            </h1>
        </header>

        

        <div className={styles.inputGroup}>
          {contractType === 'DEPOSIT_RENT' ? (
            <div className={styles.inputContainer}>
              <label className={styles.label}>전세</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  value={formatNumber(deposit)}
                  onChange={(e) => handleInputChange(e, setDeposit)}
                  placeholder="0"
                />
                <span className={styles.unit}>만원</span>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.inputContainer}>
                <label className={styles.label}>보증금</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formatNumber(deposit)}
                    onChange={(e) => handleInputChange(e, setDeposit)}
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
                    onChange={(e) => handleInputChange(e, setMonthlyRent)}
                    placeholder="0"
                  />
                  <span className={styles.unit}>만원</span>
                </div>
              </div>
            </>
          )}

          <div className={styles.inputContainer}>
            <label className={styles.label}>관리비</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                value={formatNumber(managementFee)}
                onChange={(e) => handleInputChange(e, setManagementFee)}
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
          className={`${styles.nextButton} ${styles.enabled}`}
          onClick={handleNext}
        >
          확인
        </button>
      </footer>
    </div>
  );
};

export default UpdateContractPriceTypePage;
