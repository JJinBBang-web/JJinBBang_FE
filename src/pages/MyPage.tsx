// src/pages/MyPage.tsx
import React, { useState } from 'react';
import styles from '../styles/MyPage.module.css';
import questionIcon from '../assets/image/questionIcon.svg';
import arrowIcon from '../assets/image/arrowIcon.svg';
import characterIcon from '../assets/image/characterIcon.svg';
import pencilIcon from '../assets/image/pencilIcon.svg';
import emptyCharacterIcon from '../assets/image/emptyCharacterIcon.svg';
import KakaoLoginModal from '../components/auth/KakaoLoginModal';

const MyPage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleKakaoLogin = () => {
    // 카카오 로그인 처리 로직
    setShowLoginModal(false);
  };

  return (
    <div className="content">
      <h1 className={styles.title}>나의 찐빵</h1>

      <div className={styles.guide}>
        <img src={questionIcon} alt="question" className={styles.guideIcon} />
        <p>학교 인증을 통해 모든 기능을 무료로 즐겨보세요!</p>
      </div>

      <div className={styles.menuList}>
        <button
          className={styles.menuItem}
          onClick={() => setShowLoginModal(true)}
        >
          <img src={characterIcon} alt="character" />
          <span>로그인을 해주세요</span>
          <img src={arrowIcon} alt="arrow" />
        </button>

        <button className={styles.menuItem}>
          <img src={pencilIcon} alt="pencil" />
          <div>
            <span className={styles.menuTitle}>찐빵 작성하기</span>
            <span className={styles.menuDescription}>
              찐심이 담긴 실거주 후기를 공유해주세요!
            </span>
          </div>
          <img src={arrowIcon} alt="arrow" />
        </button>
      </div>

      <div className={styles.reviewContainer}>
        <h2>나의 찐빵</h2>
        <div className={styles.emptyState}>
          <img src={emptyCharacterIcon} alt="empty character" />
          <p>앗! 아직 등록된 찐빵이 없어요!</p>
        </div>
      </div>

      {showLoginModal && (
        <KakaoLoginModal
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default MyPage;
