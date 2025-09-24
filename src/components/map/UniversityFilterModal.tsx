import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {selectedInitialState, campusCenterState, universitiesState, universityLabelState} from "../../recoil/map/universityRecoilState"
import styles from "./UniversityFilterModal.module.css"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { filterState, selectedTypeNumState } from "../../recoil/map/mapRecoilState";
import { isSheetOpenState } from "../../recoil/util/utilRecoilState";
import '../../styles/global.css'
import { useEffect, useMemo, useState } from "react";
import { getInitial } from "../../util/getInitial";
import { UnivAPI } from "../../api/user/UnivAPI";
import { CampusResponse, UnivCampusInterface } from "../../types/entity/user/UnivInterface";

const INITIAL_LIST = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",];

type GroupedUniversity = {
  universityName: string;
  campuses: UnivCampusInterface[];
  initial: string;
};

const DEFAULT_CAMPUS_CENTER = {
    lat: 35.154,  // 경상국립대 위도
    lng: 128.1, // 경상국립대 경도
};

const UniversityFilterModal = () => {
    const [selectedInitial, setSelectedInitial] = useRecoilState(selectedInitialState);
    const [universities, setUniversities] = useRecoilState(universitiesState);
    
    // 대학교 선택 상태관리
    const [selectedTypeNum, setSelectedTypeNum] = useRecoilState(selectedTypeNumState);
    const setFilterState = useSetRecoilState(filterState);
    const [filter, setFilter] = useRecoilState(filterState);

    // 모달 상태관리
    const [,setBottomSheet] = useRecoilState(isSheetOpenState)

    const [selectedUniversityKey, setSelectedUniversityKey] = useState<string | null>("경상국립대학교_가좌캠퍼스");
    const setUniversityLabel = useSetRecoilState(universityLabelState);
    const [groupedUniversities, setGroupedUniversities] = useState<GroupedUniversity[]>([]);
    
    const selectedUni = universities.find((u) => u.id === selectedTypeNum);
    
    // 대학교 바운더리 상태관리
    const setCampusCenter = useSetRecoilState(campusCenterState);

    const handleConfirm = () => {
        const selectedCampus = filteredUniversities
            .flatMap((uni) => uni.campuses)
            .find((campus) => campus.id === selectedTypeNum);

        if (selectedTypeNum === null) {
            // 초기화 시 처리
            setFilterState((prev) => ({
                ...prev,
                university: null,
            }));
            setUniversityLabel(""); // UI에서 대학명 표시 없앰
            setCampusCenter(DEFAULT_CAMPUS_CENTER);  // 지도 초기화 (기본 중심점으로?)
            setBottomSheet({ isOpenModal: false, type: "university" });
            return;
        }

        if (isConfirmActive && selectedUniversityKey && selectedCampus) {
            setFilterState((prev) => ({
                ...prev,
                university: selectedTypeNum,
            }));

            setUniversityLabel(selectedUniversityKey);

            // ✅ 캠퍼스 중심 위치 recoil에 저장
            setCampusCenter({
                lat: selectedCampus.latitude,
                lng: selectedCampus.longitude,
            });

            setBottomSheet((prev) => ({ ...prev, isOpen: false }));
            setTimeout(() => {
                setBottomSheet({ isOpenModal: false, type: 'university' });
            }, 200);
        }
    };


    // 초성별 대학교 필터링
    const groupCampusesByUniversity = (data: CampusResponse[]): GroupedUniversity[] => {
        return data.map((univ) => ({
        universityName: univ.universityName,
        campuses: univ.campuses.map((campus) => ({
            ...campus,
            logoImageUrl: campus.logoImageUrl || univ.universityLogo,
        })),
        initial: getInitial(univ.universityName[0]),
        }));
    };

    // 대학교 목록
    useEffect(() => {
        const fetchCampusList = async () => {
            const response = await UnivAPI.getUnivCampusList();
            const grouped = groupCampusesByUniversity(response);
            setGroupedUniversities(grouped);
        };

        fetchCampusList();
    }, []);

    const activeInitials = useMemo(() => {
        return new Set(groupedUniversities.map((g) => g.initial));
    }, [groupedUniversities]);

    const filteredUniversities = useMemo(() => {
        return groupedUniversities.filter((g) => g.initial === selectedInitial);
    }, [groupedUniversities, selectedInitial]);

    const isConfirmActive = selectedTypeNum !== filter.university;
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

    const selectedCampus = filteredUniversities
        .flatMap((uni) => uni.campuses)
        .find((campus) => campus.id === selectedTypeNum);

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
                {filteredUniversities.map((uni) =>
                    uni.campuses.map((campus) => (
                    <div className={styles.uni_wrap} key={`${uni.universityName}-${campus.id}`}>
                        <button
                        className={`${styles.uni_btn} ${selectedTypeNum === campus.id ? styles.selected_uni_btn : ""}`}
                        onClick={() => {
                            setSelectedTypeNum(campus.id);
                            setSelectedUniversityKey(`${uni.universityName}_${campus.campusName}`);
                        }}
                        >
                        <img src={campus.logoImageUrl} alt={uni.universityName} className={styles.univLogo} />
                        <p className={`${styles.uni_title} ${selectedTypeNum === campus.id ? styles.selected_text : ""}`}>{uni.universityName}</p>
                        <p className={`${styles.uni_campus} ${selectedTypeNum === campus.id ? styles.selected_text : ""}`}>{campus.campusName}</p>
                        </button>
                    </div>
                    ))
                )}
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