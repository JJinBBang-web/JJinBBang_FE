// src/components/util/UniversityCampusModal.tsx
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  selectedInitialState,
  universitiesState,
} from '../../recoil/map/universityRecoilState';
import {
  filterState,
  selectedTypeNumState,
} from '../../recoil/map/mapRecoilState';
import { isSheetOpenState } from '../../recoil/util/utilRecoilState';
import styles from './UniversityCampusModal.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

// ModalBottomSheet에서 사용하는 모달
const UniversityCampusModal = () => {
  const [selectedInitial, setSelectedInitial] =
    useRecoilState(selectedInitialState);
  const universities = useRecoilValue(universitiesState);
  const [selectedTypeNum, setSelectedTypeNum] =
    useRecoilState(selectedTypeNumState);
  const [filter, setFilterState] = useRecoilState(filterState);
  const [, setBottomSheet] = useRecoilState(isSheetOpenState);

  // 초성활성화 조건
  const activeInitials = new Set(universities.map((uni) => uni.initial));
  // 대학교 필터링
  const filteredUniversities = universities.filter(
    (uni) => uni.initial === selectedInitial
  );

  // 확인버튼 활성화 조건
  const isConfirmActive = selectedTypeNum !== filter.university;
  // 초기화버튼 활성화 조건
  const isResetActive = selectedTypeNum !== null;

  const handleReset = () => {
    setSelectedTypeNum(null);
    setSelectedInitial('ㄱ');
  };

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
        <button
          className={`${styles.reset_btn} ${
            isResetActive ? styles.reset_btn_active : ''
          }`}
          onClick={handleReset}
        >
          초기화
        </button>
        <button
          className={`${styles.confirm_btn} ${
            isConfirmActive ? styles.confirm_btn_active : ''
          }`}
          onClick={() => {
            if (isConfirmActive) {
              setFilterState((prev) => ({
                ...prev,
                university: selectedTypeNum!,
              }));
              setBottomSheet({ isOpenModal: false, type: null });
            }
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default UniversityCampusModal;
