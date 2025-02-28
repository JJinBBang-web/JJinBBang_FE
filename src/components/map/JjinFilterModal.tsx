import { useRecoilState } from "recoil";
import { JjinFilterState } from "../../recoil/util/filterRecoilState";
import styles from "./JjinFilterModal.module.css";
import iconDown from "../../assets/image/iconDown.svg"
import iconUp from "../../assets/image/iconUp.svg"
import { useRef, useState } from "react";
import { isSheetOpenState } from "../../recoil/util/utilRecoilState";
import { selectedJjinFilterState } from "../../recoil/map/mapRecoilState";

const JjinFilterModal = () => {
    const [filters, setFilters] = useRecoilState(JjinFilterState);
    const [selectedJjinFilter, setSelectedJjinFilter] = useRecoilState(selectedJjinFilterState);

    // 모달 상태관리
    const [,setBottomSheet] = useRecoilState(isSheetOpenState)
    
    // 스크롤 상태 관리
    const [scrolled, setScrolled] = useState<{[key:number]:Boolean}>({});
    const filterContentRefs = useRef<(HTMLDivElement | null)[]>([]);

    // 아래로 스크롤 (한 번에 250px 이동)
    const handleScrollDown = (index: number) => {
        const ref = filterContentRefs.current[index];
        if (ref) {
            ref.scrollBy({ top: 250, behavior: "smooth" });
            // 스크롤이 내려가면 이미지를 위로 스크롤로 바꿔줍니다.
            setScrolled((prevState) => ({
                ...prevState,
                [index]: true,
            }));
        }
    };

    // 위로 스크롤
    const handleScrollUp = (index : number) => {
        const ref = filterContentRefs.current[index];
        if (ref) {
            ref.scrollBy({ top: -250, behavior: "smooth" });
             // 스크롤이 내려가면 이미지를 위로 스크롤로 바꿔줍니다.
             setScrolled((prevState) => ({
                ...prevState,
                [index]: false,
            }));
        }
    };

    // 확인버튼 활성화 조건
    // const isConfirmActive = selectedTypeNum !== university.university;
    // // 초기화버튼 활성화 조건
    // const isResetActive = selectedTypeNum !== null;

    return (
        <div className={styles.content}>
            <div className={styles.filter_wrap}>
                {filters.map((category, index) => (
                    <div className={styles.jjin_filter_wrap}>
                        <p className={styles.title}>{category.category}</p>
                        <div className={styles.jjin_filter} 
                        ref={(el: HTMLDivElement | null) => {filterContentRefs.current[index] = el;}}>
                            {category.filter.map((item, index) => (
                                <button key={index} className={styles.filter_btn}>
                                    <img src={item.icon} alt={item.label} className={styles.filter_icon}/>
                                    <p className={styles.filter_text}>{item.label}</p>
                                </button>
                            ))}
                        </div>
                        <button className={styles.bottom_btn} 
                        onClick={() => {
                            if (scrolled[index]) {
                                handleScrollUp(index);  // 위로 스크롤
                            } else {
                                handleScrollDown(index); // 아래로 스크롤
                            }
                        }}>
                            <img src={scrolled[index] ? iconUp : iconDown} alt="스크롤"/>
                        </button>
                    </div>
                ))}
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

export default JjinFilterModal;