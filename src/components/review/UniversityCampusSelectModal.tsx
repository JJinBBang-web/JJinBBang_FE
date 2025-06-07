import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  selectedInitialState,
  selectedUniversityState,
  universitiesFilterState,
  universitiesState,
} from '../../recoil/map/universityRecoilState';
import styles from './UniversityCampusSelectModal.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  filterState,
  selectedTypeNumState,
} from '../../recoil/map/mapRecoilState';
import { isSheetOpenState } from '../../recoil/util/utilRecoilState';
import iconClose from '../../assets/image/iconClose.svg';

const INITIAL_LIST = [
  'ㄱ',
  'ㄴ',
  'ㄷ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅅ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const UniversityFilterModal = () => {
  const [selectedInitial, setSelectedInitial] =
    useRecoilState(selectedInitialState);
  const universities = useRecoilValue(universitiesState);
  const [selectedTypeNum, setSelectedTypeNum] =
    useRecoilState(selectedTypeNumState);
  const setFilterState = useSetRecoilState(filterState);
  const [university, setUniversity] = useRecoilState(filterState);
  const [, setBottomSheet] = useRecoilState(isSheetOpenState);

  // 모달 닫기 함수
  const closeModal = () => {
    setBottomSheet({ isOpenModal: false, type: null });
  };

  // 초성활성화 조건
  const activeInitials = new Set(universities.map((uni) => uni.initial));

  // 대학교 필터링
  const filteredUniversities = universities.filter(
    (uni) => uni.initial === selectedInitial
  );

  // 확인버튼 활성화 조건
  const isConfirmActive =
    selectedTypeNum !== null && selectedTypeNum !== university.university;

  // 초기화버튼 활성화 조건
  const isResetActive = selectedTypeNum !== null || selectedInitial !== 'ㄱ';

  // 초기화 함수 - selectedTypeNum을 null로 설정하여 확인 버튼 비활성화
  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedTypeNum(null);
    setSelectedInitial('ㄱ');
  };

  // 확인 함수
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (selectedTypeNum !== null) {
      setFilterState((prev) => ({
        ...prev,
        university: selectedTypeNum,
      }));
      closeModal();
    }
  };

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // 닫기 버튼 클릭 핸들러
  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    closeModal();
  };

  const settingsInitial = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '1px',
    slidesToShow: 9,
    speed: 300,
    focusOnSelect: true,
    arrows: false,
    swipe: true,
    swipeToSlide: true,
  };

  const settingsUniversity = {
    className: 'University',
    dots: true,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: false,
    swipe: true,
    swipeToSlide: true,
  };

  return (
    <>
      {/* 모달 컨테이너 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderRadius: '24px 24px 0 0',
          padding: '0.62rem 1.5rem 2.75rem 1.5rem',
          maxWidth: '100vw',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.content}>
          <div className={styles.modalHeader}>
            <span
              className={styles.modalTitle}
              style={{ position: 'absolute', left: '0', marginTop: '1.5rem' }}
            >
              대학교
            </span>
            {/* 닫기 버튼 - 클릭 시 모달 닫힘 */}
            <button className={styles.closeButton} onClick={handleCloseClick}>
              <img src={iconClose} alt="닫기" />
            </button>
          </div>

          {/* 초성필터슬라이더 */}
          <Slider {...settingsInitial}>
            {INITIAL_LIST.map((init) => {
              const isActive = activeInitials.has(init);
              const isSelected = selectedInitial === init;

              return (
                <div key={init} className={styles.initial_wrap}>
                  <button
                    className={
                      isSelected
                        ? styles.selected_initial_btn
                        : isActive
                        ? styles.unselected_initial_btn
                        : styles.initial_btn
                    }
                    onClick={() => {
                      if (isActive) {
                        setSelectedInitial(init);
                        setSelectedTypeNum(null);
                      }
                    }}
                    disabled={!isActive}
                  >
                    {init}
                  </button>
                </div>
              );
            })}
          </Slider>

          {/* 대학교 선택 슬라이더 */}
          <div className={styles.uni_slider}>
            <Slider {...settingsUniversity}>
              {filteredUniversities.map((uni, index) => (
                <div className={styles.uni_wrap} key={uni.id}>
                  <button
                    key={index}
                    className={`${styles.uni_btn} ${
                      selectedTypeNum === uni.id ? styles.selected_uni_btn : ''
                    }`}
                    onClick={() => setSelectedTypeNum(uni.id)}
                  >
                    <img src={uni.logoImageUrl} alt={uni.universityName} />
                    <p
                      className={`${styles.uni_title} ${
                        selectedTypeNum === uni.id ? styles.selected_text : ''
                      }`}
                    >
                      {uni.universityName}
                    </p>
                    <p
                      className={`${styles.uni_campus} ${
                        selectedTypeNum === uni.id ? styles.selected_text : ''
                      }`}
                    >
                      {uni.campus}
                    </p>
                  </button>
                </div>
              ))}
            </Slider>
          </div>

          <div className={styles.btn_content}>
            {/* 초기화 버튼 - 클릭 시 'ㄱ'으로 돌아감 */}
            <button
              className={`${styles.reset_btn} ${
                isResetActive ? styles.reset_btn_active : ''
              }`}
              onClick={handleReset}
            >
              초기화
            </button>
            {/* 확인 버튼 - 캠퍼스 선택 후 클릭 시 모달 닫힘 */}
            <button
              className={`${styles.confirm_btn} ${
                isConfirmActive ? styles.confirm_btn_active : ''
              }`}
              onClick={handleConfirm}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UniversityFilterModal;
