  import React from 'react';
  import { useNavigate, useLocation, useParams } from 'react-router-dom';
  import { useCancelModal } from '../../util/useCancelModal';
  import styles from './UpdateAddressInputPage.module.css';
  import backArrowIcon from "../../assets/image/backArrowIcon.svg";
  import searchIcon from '../../assets/image/iconSearch.svg';
  import { useRecoilState } from 'recoil';
  import { updateReviewState } from '../../recoil/review/updateReviewAtoms';

  const UpdateAddressInputPage: React.FC = () => {
      const navigate = useNavigate();
      const location = useLocation();
      const locationState = location.state || {};
      const [review] = useRecoilState(updateReviewState);

      const { housingType } = location.state;
      const { reviewId } = useParams();


    const {
      showCancelModal,
      handleCloseButtonClick,
      handleCancelModalClose,
      handleConfirmCancel,
    } = useCancelModal();

    const handleSearchClick = () => {
      navigate(`/review/${reviewId}/update/address`, {replace:true, state: { from: 'update', housingType }});
    };


    const handleBack = () => {
      navigate(`/review/${reviewId}/update`, {replace:true});
    };

    return (
      <div className="content">
        <div className={styles.container}>
          <header className={styles.header}>
              <button className={styles.backButton} onClick={handleBack}>
                      <img src={backArrowIcon} alt="back" />
              </button>
              <div className={styles.progressBar}>
                  <div className={styles.progressFill}></div>
              </div>
            <h1 className={styles.title}>
              {housingType === "AGENCY"
                ? "공인중개사의 주소를 입력해 주세요!"
                : "주소를 입력해 주세요!"}
            </h1>
          </header>
          <p className={styles.description}>
            {housingType === "AGENCY"
              ? "상호명이나 주소 일부만 입력해도 검색할 수 있어요!"
              : "검색 결과에서 동, 호수까지 확인해주세요"}
          </p>
          <div className={styles.searchBox} onClick={handleSearchClick}>
            <span className={styles.placeholder}>
              {housingType === "AGENCY"
                ? "예) 찐빵공인중개사"
                : "예) 찐빵로 47, 찐빵동 122"}
            </span>
            <img src={searchIcon} alt="search" className={styles.searchIcon} />
          </div>
        </div>
        <footer className={styles.footer}>
          <button className={styles.prevButton} onClick={handleBack}>
            이전
          </button>
          <button className={styles.nextButton} disabled={true}>
            확인
          </button>
        </footer>
      </div>
    );
  };

  export default UpdateAddressInputPage;
