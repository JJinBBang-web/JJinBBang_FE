import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {selectedInitialState, selectedUniversityState, universitiesFilterState, universitiesState} from "../../recoil/map/universityRecoilState"
import styles from "./UniversityFilterModal.module.css"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { filterState, selectedTypeNumState } from "../../recoil/map/mapRecoilState";
import { isSheetOpenState } from "../../recoil/util/utilRecoilState";
import '../../styles/global.css'
import styled from "styled-components";

const INITIAL_LIST = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",];

const UniversityFilterModal = () => {
    const [selectedInitial, setSelectedInitial] = useRecoilState(selectedInitialState);
    const universities = useRecoilValue(universitiesState);
    
    // 대학교 선택 상태관리
    const [selectedTypeNum, setSelectedTypeNum] = useRecoilState(selectedTypeNumState);
    const setFilterState = useSetRecoilState(filterState);
    const [university, setUniversity] = useRecoilState(filterState);

    // 모달 상태관리
    const [,setBottomSheet] = useRecoilState(isSheetOpenState)

    const handleConfirm = () => {
        if(isConfirmActive) {
            setFilterState((prev) => ({
                ...prev,
                university : selectedTypeNum!,
            }))
            // 먼저 isOpen만 false로 설정해서 닫히는 애니메이션 실행
            setBottomSheet(prev => ({ ...prev, isOpen: false })); 
            
            // 300ms 후에 type을 null로 설정해서 완전히 제거
            setTimeout(() => {
                setBottomSheet({ isOpen: false, type: null });
            }, 300);
        }
    };


    // 초성활성화 조건
    const activeInitials = new Set(universities.map((uni) => uni.initial));
    // 대학교 필터링
    const filteredUniversities = universities.filter((uni) => uni.initial === selectedInitial);

    // 확인버튼 활성화 조건
    const isConfirmActive = selectedTypeNum !== university.university;
    // 초기화버튼 활성화 조건
    const isResetActive = selectedTypeNum !== null;

    const settingsInitial = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "1px",
        slidesToShow: 9,
        speed: 300,
        focusOnSelect: true, // 클릭 시 선택 가능
        arrows: false,      // 이전/다음 버튼 제거
        swipe: true,        // 터치 스와이프 활성화
        swipeToSlide : true,
      };

    const settingsUniversity = {
        className : "University",
        dots: true,
        speed: 300,
        slidesToShow : 2,
        slidesToScroll: 1,
        focusOnSelect: true, // 클릭 시 선택 가능
        arrows: false,      // 이전/다음 버튼 제거
        swipe: true,        // 터치 스와이프 활성화
        swipeToSlide : true,
    }

//     const Container = styled.div`
//     padding: 0px 6px;
  
//     && .slick-dots {
//       bottom: -50px !important;
//     }
  
//     && .slick-dots li.slick-active button:before {
//       color: #B5B5B5 !important;
//     }
  
//     && .slick-dots li button:before {
//       color: #E8E8E8 !important;
//     }
//   `;

    return (
        <div className={styles.content}>
            {/* 초성필터슬라이더 */}
            {/* <Container> */}
            <Slider {...settingsInitial}>
                {INITIAL_LIST.map((init) => {
                    const isActive = activeInitials.has(init);
                    const isSeleted = selectedInitial === init;

                    return (
                    <div key={init} className={styles.initial_wrap}>
                        <button className={
                            isSeleted 
                            ? styles.selected_initial_btn
                            : isActive
                            ? styles.unselected_initial_btn
                            : styles.initial_btn
                        }
                        onClick={() => {
                            console.log("초성 선택:", init, "isActive:", isActive);
                            if (isActive) setSelectedInitial(init);
                        }
                        }
                        disabled={!isActive}
                        >
                            {init}
                        </button>
                    </div>
                    );
                })}
            </Slider>
            {/* </Container> */}
            {/* 대학교 선택 슬라이더 */}
            <div className={styles.uni_slider}>
            <Slider {...settingsUniversity}>
                {filteredUniversities.map((uni, index) => (
                    <div className={styles.uni_wrap} key={uni.id}>
                        <button key={index} className={`${styles.uni_btn} ${selectedTypeNum === uni.id ? styles.selected_uni_btn : ""}`}
                        onClick={() => setSelectedTypeNum(uni.id)}>
                            <img src={uni.logoImageUrl} alt={uni.universityName} />
                            <p className={`${styles.uni_title} ${selectedTypeNum === uni.id ? styles.selected_text : ""}` }>{uni.universityName}</p>
                            <p className={`${styles.uni_campus} ${selectedTypeNum === uni.id ? styles.selected_text : ""}`}>{uni.campus}</p>
                        </button>
                    </div>
                ))}
            </Slider>
            </div>
            <div className={styles.btn_content}>
                <button className={`${styles.reset_btn} ${isResetActive ? styles.reset_btn_active : ""}`} 
                onClick={() => {
                    setSelectedTypeNum(null);
                    setSelectedInitial("ㄱ");
                }}
                >초기화</button>
                <button className={`${styles.confirm_btn} ${isConfirmActive ? styles.confirm_btn_active : ""}`} 
                onClick={() => {handleConfirm();}}
                    >확인</button>
            </div>
        </div>
    )
}

export default UniversityFilterModal;