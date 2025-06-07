// src/components/review/UniversityCampusSelectModal.tsx
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  selectedInitialState,
  universitiesState,
} from '../../recoil/map/universityRecoilState';
import { selectedTypeNumState } from '../../recoil/map/mapRecoilState';
import styles from './UniversityCampusSelectModal.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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

// 독립형 모달 props 정의
interface UniversityCampusSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// DormitoryInputPage에서 사용하는 모달
const UniversityCampusSelectModal: React.FC<
  UniversityCampusSelectModalProps
> = ({ isOpen, onClose }) => {
  const [selectedInitial, setSelectedInitial] =
    useRecoilState(selectedInitialState);
  const universities = useRecoilValue(universitiesState);
  const [selectedTypeNum, setSelectedTypeNum] =
    useRecoilState(selectedTypeNumState);

  // 초성활성화 조건
  const activeInitials = new Set(universities.map((uni) => uni.initial));
  // 대학교 필터링
  const filteredUniversities = universities.filter(
    (uni) => uni.initial === selectedInitial
  );

  const handleReset = () => {
    setSelectedTypeNum(null);
    setSelectedInitial('ㄱ');
  };

  // 모달이 닫혀있을 때 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // 슬라이더 설정
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
    initialSlide: INITIAL_LIST.indexOf(selectedInitial),
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
    infinite: false,
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.handleBar}></div>
          <h2 className={styles.modalTitle}>대학교</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <img src={iconClose} alt="닫기" />
          </button>
        </div>

        <div className={styles.content}>
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
                      if (isActive) setSelectedInitial(init);
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
              {filteredUniversities.map((uni) => (
                <div className={styles.uni_wrap} key={uni.id}>
                  <button
                    className={`${styles.uni_btn} ${
                      selectedTypeNum === uni.id ? styles.selected_uni_btn : ''
                    }`}
                    onClick={() => {
                      setSelectedTypeNum(uni.id);
                      onClose();
                    }}
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
            <button
              className={`${styles.reset_btn} ${
                selectedTypeNum !== null ? styles.reset_btn_active : ''
              }`}
              onClick={handleReset}
            >
              초기화
            </button>
            <button className={styles.confirm_btn} onClick={onClose}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityCampusSelectModal;
