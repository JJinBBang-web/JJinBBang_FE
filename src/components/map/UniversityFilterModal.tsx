import { useRecoilState, useRecoilValue } from "recoil";
import {selectedInitialState, universitiesFilterState, universitiesState} from "../../recoil/map/universityRecoilState"
import styles from "./UniversityFilterModal.module.css"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const INITIAL_LIST = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",];

const UniversityFilterModal = () => {
    const [selectedInitial, setSelectedInitial] = useRecoilState(selectedInitialState);
    const universities = useRecoilValue(universitiesState);

    // 초성활성화 조건
    const activeInitials = new Set(universities.map((uni) => uni.initial));

    console.log("activeInitials", activeInitials);

    // 대학교 필터링
    const filteredUniversities = universities.filter((uni) => uni.initial === selectedInitial);

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

    return (
        <div className={styles.content}>
            {/* 초성필터슬라이더 */}
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
            {/* 대학교 선택 슬라이더 */}
            <div className={styles.uni_slider}>
            <Slider {...settingsUniversity}>
                {filteredUniversities.map((uni, index) => (
                    <div className={styles.uni_wrap}>
                        <button key={index} className={styles.uni_btn}>
                            <img src={uni.logoImageUrl} alt={uni.universityName} />
                            <p className={styles.uni_title}>{uni.universityName}</p>
                            <p className={styles.uni_campus}>{uni.campus}</p>
                        </button>
                    </div>
                ))}
            </Slider>
            </div>
            <div className={styles.btn_content}>
                <button className={`${styles.reset_btn}`} 
                // onClick={() => setSelectedType("전체")}
                >초기화</button>
                <button className={`${styles.confirm_btn}`} 
                // onClick={() => {
                //         if (isConfirmActive) {
                //             setHousingType(selectedType);
                //             setBottomSheet({ isOpen: false, type: null }); 
                //         }
                //     }}
                    >확인</button>
            </div>
        </div>
    )
}

export default UniversityFilterModal;