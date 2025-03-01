// src/pages/review/ReviewConfirmPage.tsx
// ReviewConfirmPage.tsx 전체 코드
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { reviewState } from '../../recoil/review/reviewAtoms';
import { JjinFilterState } from '../../recoil/util/filterRecoilState';
import styles from '../../styles/review/ReviewConfirm.module.css';
import characterIcon from '../../assets/image/characterIcon.svg';
import closeIcon from '../../assets/image/iconClose.svg';
import ArrowIcon from '../../assets/image/arrowIcon.svg';
import starFilledIcon from '../../assets/image/starIconOnRed.svg';
import starEmptyIcon from '../../assets/image/starIconOff.svg';

interface LocationState {
  address?: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
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
  housingType?: string; // 추가된 타입
}

const ReviewConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState) || {};

  const [review, setReview] = useRecoilState(reviewState);
  const filters = useRecoilValue(JjinFilterState);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // 컴포넌트 마운트 시 저장된 상태 로드
  useEffect(() => {
    const savedState = localStorage.getItem('reviewState');
    if (savedState) {
      setReview((prev) => ({ ...prev, ...JSON.parse(savedState) }));
    }
  }, []);

  // 데이터 로딩 로직
  useEffect(() => {
    console.log('현재 review 상태:', review);
    console.log('Location state:', locationState);

    if (locationState && Object.keys(locationState).length > 0) {
      setReview((prev) => ({
        ...prev,
        housingType: locationState.housingType || prev.housingType || '',
        pros: locationState.advantages || prev.pros || [],
        cons: locationState.disadvantages || prev.cons || [],
        content: locationState.content || prev.content || '',
        images: locationState.photos || prev.images || [],
        address: locationState.address?.roadAddress || prev.address || '',
        addressDetail:
          locationState.address?.jibunAddress || prev.addressDetail || '',
        detailedAddress: locationState.buildingName
          ? `${locationState.buildingName} ${locationState.floor || '저층'}`
          : prev.detailedAddress || '',
        contractType: locationState.paymentType || prev.contractType || '',
        deposit: locationState.priceData?.deposit || prev.deposit || 0,
        monthlyRent:
          locationState.priceData?.monthlyRent !== undefined
            ? locationState.priceData.monthlyRent
            : prev.monthlyRent || 0,
        managementFee:
          locationState.priceData?.managementFee || prev.managementFee || 0,
      }));
    }
  }, [locationState, setReview]);

  const getIconFromLabel = (label: string): string => {
    let iconSrc = '';
    filters.forEach((category) => {
      category.filter.forEach((item) => {
        if (item.label === label) {
          iconSrc = item.icon;
        }
      });
    });
    return iconSrc;
  };

  const handleItemClick = (navigationFunction: () => void) => {
    localStorage.setItem('reviewState', JSON.stringify(review));
    navigationFunction();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    setShowCancelModal(true);
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

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    try {
      setTimeout(() => {
        setIsSubmitting(false);
        setShowConfirmModal(false);
        navigate('/review/complete');
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      console.error('Failed to submit review:', error);
    }
  };

  // Navigation handlers with state preservation
  const navigateToHousingType = () => {
    navigate('/review/type', {
      state: {
        ...locationState,
        from: 'confirm',
      },
    });
  };

  const navigateToAddress = () => {
    navigate('/review/address', {
      state: {
        ...locationState,
        from: 'confirm',
      },
    });
  };

  const navigateToDetailedAddress = () => {
    navigate('/review/address/result', {
      state: {
        ...locationState,
        address: {
          roadAddress: review.address || '',
          jibunAddress: review.addressDetail || '',
          buildingName: '',
        },
        from: 'confirm',
      },
    });
  };

  const navigateToContractType = () => {
    navigate('/review/payment-type', {
      state: {
        ...locationState,
        address: locationState.address || {
          roadAddress: review.address || '',
          jibunAddress: review.addressDetail || '',
          buildingName: '',
        },
        buildingName:
          locationState.buildingName || review.detailedAddress || '',
        from: 'confirm',
      },
    });
  };

  const navigateToContractDetails = () => {
    const nextPath =
      review.contractType === '전세' ? '/review/jeonse' : '/review/wolse';
    navigate(nextPath, {
      state: {
        ...locationState,
        address: locationState.address || {
          roadAddress: review.address || '',
          jibunAddress: review.addressDetail || '',
          buildingName: '',
        },
        buildingName:
          locationState.buildingName || review.detailedAddress || '',
        paymentType: review.contractType || '월세',
        from: 'confirm',
      },
    });
  };

  const navigateToPros = () => {
    navigate('/review/advantages', {
      state: {
        ...locationState,
        advantages: review.pros,
        from: 'confirm',
      },
    });
  };

  const navigateToCons = () => {
    navigate('/review/disadvantages', {
      state: {
        ...locationState,
        disadvantages: review.cons,
        from: 'confirm',
      },
    });
  };

  const navigateToContent = () => {
    navigate('/review/content', {
      state: {
        ...locationState,
        photos: review.images,
        advantages: review.pros,
        disadvantages: review.cons,
        content: review.content,
        from: 'confirm',
      },
    });
  };

  const renderTags = (tags: string[], isProsTags: boolean) => {
    if (tags && tags.length > 0) {
      return tags.map((tag, index) => (
        <span key={index} className={styles.tag}>
          <img
            src={getIconFromLabel(tag)}
            alt={tag}
            className={styles.tagIcon}
          />
          {tag}
        </span>
      ));
    } else {
      return null;
    }
  };

  return (
    <div className="content">
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleClose}>
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
                {review.housingType || ''}
              </span>
              <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
            </div>
          </div>

          <div
            className={styles.infoItem}
            onClick={() => handleItemClick(navigateToAddress)}
          >
            <span className={styles.label}>주소</span>
            <div className={styles.value}>
              <div>
                <span className={styles.valueText}>{review.address || ''}</span>
                <span className={styles.subAddress}>
                  {review.addressDetail || ''}
                </span>
              </div>
              <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
            </div>
          </div>

          <div
            className={styles.infoItem}
            onClick={() => handleItemClick(navigateToDetailedAddress)}
          >
            <span className={styles.label}>상세 주소</span>
            <div className={styles.value}>
              <span className={styles.valueText}>
                {review.detailedAddress || ''}
              </span>
              <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
            </div>
          </div>

          <div
            className={styles.infoItem}
            onClick={() => handleItemClick(navigateToContractType)}
          >
            <span className={styles.label}>계약 형태</span>
            <div className={styles.value}>
              <span className={styles.valueText}>
                {review.contractType || ''}
              </span>
              <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
            </div>
          </div>

          <div
            className={styles.infoItem}
            onClick={() => handleItemClick(navigateToContractDetails)}
          >
            <span className={styles.label}>계약 조건</span>
            <div className={styles.value}>
              <div className={styles.contractDetails}>
                <span className={styles.valueText}>
                  {review.deposit ? `보증금 ${review.deposit}만원` : ''}
                </span>
                {!review.contractType || review.contractType === '월세' ? (
                  <span className={styles.valueText}>
                    {review.monthlyRent ? `월세 ${review.monthlyRent}만원` : ''}
                  </span>
                ) : null}
                <span className={styles.valueText}>
                  {review.managementFee
                    ? `관리비 ${review.managementFee}만원`
                    : ''}
                </span>
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
                <div className={styles.tags}>
                  {renderTags(review.pros, true)}
                </div>
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
                <div className={styles.tags}>
                  {renderTags(review.cons, false)}
                </div>
              </div>
              <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
            </div>
          </div>

          <div
            className={styles.infoItem}
            onClick={() => handleItemClick(navigateToContent)}
          >
            <span className={styles.label}>글 후기</span>
            <div className={styles.reviewTextContainer}>
              <div className={styles.reviewText}>{review.content || ''}</div>
              <img src={ArrowIcon} alt="arrow" className={styles.arrowIcon} />
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.prevButton} onClick={handleBack}>
            이전
          </button>
          <button className={styles.nextButton} onClick={handleRateReview}>
            다음
          </button>
        </div>
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
                작성해 주신 찐빵의 총점을 매겨 찐빵을 업로드해 보세요!
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
                    alt={star <= rating ? '채워진 별' : '빈 별'}
                    className={styles.starIcon}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
              </div>
              <button
                className={styles.uploadButton}
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
        <div
          className={styles.modalOverlay}
          onClick={() => setShowCancelModal(false)}
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHandle}></div>
            <div className={styles.cancelModal}>
              <h2 className={styles.modalTitle}>작성을 중단할까요?</h2>
              <p className={styles.modalSubtitle}>
                지금까지 작성해 주신 내용은 저장되지 않아요!
              </p>
              <img
                src={characterIcon}
                alt="찐빵 캐릭터"
                className={styles.characterImage}
              />
              <div className={styles.modalButtons}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowCancelModal(false)}
                >
                  이전
                </button>
                <button
                  className={styles.confirmButton}
                  onClick={() => navigate('/')}
                >
                  중단
                </button>
              </div>
            </div>
          </div>
        </div>
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
              <h2 className={styles.modalTitle}>찐빵 업로드 완료</h2>
              <p className={styles.modalSubtitle}>
                나의 찐빵에서 내가 작성한 찐빵을 확인하세요!
              </p>
              <img
                src={characterIcon}
                alt="찐빵 캐릭터"
                className={styles.characterImage}
              />
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
