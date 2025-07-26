import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {selectedInitialState, selectedUniversityState, universitiesFilterState, universitiesState, universityLabelState} from "../../recoil/map/universityRecoilState"
import styles from "./UniversityFilterModal.module.css"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { filterState, selectedTypeNumState } from "../../recoil/map/mapRecoilState";
import { isSheetOpenState } from "../../recoil/util/utilRecoilState";
import '../../styles/global.css'
import { useUnivList } from "../../hooks/useUnivList";
import { useEffect, useMemo, useState } from "react";
import { getInitial } from "../../util/getInitial";
import { CampusInterface } from "../../types/entity/user/UnivInterface";
import { UnivAPI } from "../../api/user/UnivAPI";

const INITIAL_LIST = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",];

type CachedCampusMap = {
  [univId: number]: CampusInterface[];
};

const UniversityFilterModal = () => {
    const [selectedInitial, setSelectedInitial] = useRecoilState(selectedInitialState);
    const [universities, setUniversities] = useRecoilState(universitiesState);
    // 캠퍼스 응답 캐시
    const [campusMap, setCampusMap] = useState<CachedCampusMap>({});
    
    // 대학교 선택 상태관리
    const [selectedTypeNum, setSelectedTypeNum] = useRecoilState(selectedTypeNumState);
    const setFilterState = useSetRecoilState(filterState);
    const [university, setUniversity] = useRecoilState(filterState);

    // 모달 상태관리
    const [,setBottomSheet] = useRecoilState(isSheetOpenState)

    const [selectedUniversityKey, setSelectedUniversityKey] = useState<string | null>("경상국립대학교_가좌캠퍼스");
    const setUniversityLabel = useSetRecoilState(universityLabelState);



    // const handleConfirm = () => {
    //     if(isConfirmActive) {
    //         setFilterState((prev) => ({
    //             ...prev,
    //             university : selectedTypeNum!,
    //         }))
    //         // 먼저 isOpen만 false로 설정해서 닫히는 애니메이션 실행
    //         setBottomSheet(prev => ({ ...prev, isOpen: false })); 
            
    //         // 300ms 후에 type을 null로 설정해서 완전히 제거
    //         setTimeout(() => {
    //             setBottomSheet({ isOpenModal: false, type: 'university' });
    //         }, 200);
    //     }
    // };
    
    const selectedUni = universities.find((u) => u.id === selectedTypeNum);
    
    const handleConfirm = () => {
        if (isConfirmActive && selectedUniversityKey) {
            setFilterState((prev) => ({
                ...prev,
                university: selectedTypeNum,
            }));

            setUniversityLabel(selectedUniversityKey);
            setBottomSheet((prev) => ({ ...prev, isOpen: false }));

            setTimeout(() => {
            setBottomSheet({ isOpenModal: false, type: 'university' });
            }, 200);
        }
    };

    // 대학교 목록
    const { data: universityList } = useUnivList();

    // 초성별 대학교 필터링
    const filteredUnivs = useMemo(() => {
        if (!universityList) return [];
        return universityList.filter(
            (uni) => getInitial(uni.universityName[0]) === selectedInitial
        );
    }, [universityList, selectedInitial]);

    // 초성 선택 시 캠퍼스 요청
    useEffect(() => {
        const fetchCampus = async () => {
            if (!filteredUnivs.length) return;

            const uncachedUnivs = filteredUnivs.filter(
            (uni) => !campusMap[uni.id]
            );

            const promises = uncachedUnivs.map((uni) =>
            UnivAPI.getUnivCampusList(uni.universityName).then((res) => ({
                id: uni.id,
                campuses: res.campusList,
            }))
            );

            const results = await Promise.all(promises);

            const newMap: CachedCampusMap = {};
            results.forEach((r) => {
            newMap[r.id] = r.campuses;
            });

            setCampusMap((prev) => ({ ...prev, ...newMap }));
        };

        fetchCampus();
    }, [filteredUnivs]);


    // // 초성활성화 조건
    // const activeInitials = new Set(universities.map((uni) => uni.initial));
    // // 대학교 필터링
    // const filteredUniversities = universities.filter((uni) => uni.initial === selectedInitial);


    const activeInitials = useMemo(() => {
        if (!universityList) return new Set();
        return new Set(
            universityList.map((uni) => uni.universityName[0]) // '경상국립대학교' → '경'
            .map(getInitial) // '경' → 'ㄱ'
        );
        }, [universityList]);

        const filteredUniversities = useMemo(() => {
        if (!universityList) return [];
        return universityList.filter(
            (uni) => getInitial(uni.universityName[0]) === selectedInitial
        );
    }, [universityList, selectedInitial]);

    // 확인버튼 활성화 조건
    const isConfirmActive = selectedTypeNum !== university.university;
    // 초기화버튼 활성화 조건
    const isResetActive = selectedTypeNum !== null;

    console.log(university.university);
    console.log(selectedTypeNum);
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
            {/* <Slider {...settingsUniversity}>
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
            </Slider> */}
            <Slider {...settingsUniversity}>
                {filteredUnivs.map((uni) => {
                    const campuses = campusMap[uni.id] || [];
                    return campuses.map((campus) => (
                    <div className={styles.uni_wrap} key={`${uni.id}-${campus.id}`}>
                        <button
                        className={`${styles.uni_btn} ${selectedTypeNum === campus.id ? styles.selected_uni_btn : ""}`}
                        onClick={() => {
                            setSelectedTypeNum(campus.id);
                            setSelectedUniversityKey(`${uni.universityName}_${campus.campusName}`);
                        }}
                        >
                            <img src={uni.universityLogo} alt={uni.universityName} />
                            <p className={`${styles.uni_title}`}>{uni.universityName}</p>
                            <p className={`${styles.uni_campus}`}>{campus.campusName}</p>
                        </button>
                    </div>
                    ));
                })}
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