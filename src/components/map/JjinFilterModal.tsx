import { useRecoilState } from "recoil";
import { JjinFilterState } from "../../recoil/util/filterRecoilState";
import styles from "./JjinFilterModal.module.css";
import iconDown from "../../assets/image/iconDown.svg"
import iconUp from "../../assets/image/iconUp.svg"
import { useRef, useState } from "react";
import { isSheetOpenState } from "../../recoil/util/utilRecoilState";
import { filterState, selectedJjinFilterState } from "../../recoil/map/mapRecoilState";
import { isEqual } from "lodash";

const JjinFilterModal = () => {
    const [filters, setFilters] = useRecoilState(JjinFilterState);
    const [selectedJjinFilter, setSelectedJjinFilter] = useRecoilState(selectedJjinFilterState);
    const [filter, setFilter] = useRecoilState(filterState);

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

    


    const handleFilterClick = (filterKey: string) => {
        const isSelected = selectedJjinFilter.some(([key]) => key === filterKey);
    
        if (isSelected) {
            // 이미 선택된 필터면 제거
            setSelectedJjinFilter(prev => prev.filter(([key]) => key !== filterKey));
        } else {
            // 선택된 필터가 5개 미만일 때만 추가
            if (selectedJjinFilter.length < 5) {
                setSelectedJjinFilter(prev => [...prev, [filterKey, 'positive']]);
            }
        }
    };

    const handleConfirm = () => {
        if(isConfirmActive) {
            const selectedKeys = selectedJjinFilter.map(([key]) => key); 

            setFilter((prev) => ({
                ...prev,
                reviewKeyword: selectedKeys
            }));
            // 먼저 isOpen만 false로 설정해서 닫히는 애니메이션 실행
            setBottomSheet(prev => ({ ...prev, isOpen: false })); 
            
            // 300ms 후에 type을 null로 설정해서 완전히 제거
            setTimeout(() => {
                setBottomSheet({ isOpen: false, type: null });
            }, 300);
        }
    };

    const selectedKeywordKeys = selectedJjinFilter.map(f => f.keys);

    // 확인버튼 활성화 조건
    const isConfirmActive = !isEqual(filter.reviewKeyword, selectedKeywordKeys) || (selectedJjinFilter?.length ?? 0) > 0;
    // 초기화버튼 활성화 조건
    const isResetActive = selectedJjinFilter.length > 0;

    return (
        <div className={styles.content}>
            <div className={styles.filter_wrap}>
                {filters.map((category, index) => (
                    <div className={styles.jjin_filter_wrap}>
                        <p className={styles.title}>{category.category}</p>
                        <div className={styles.jjin_filter} 
                        ref={(el: HTMLDivElement | null) => {filterContentRefs.current[index] = el;}}>
                            {category.positiveFilters.map((item, index) => (
                                <button 
                                key={index} 
                                className={`${styles.filter_btn} ${selectedJjinFilter?.some(([key]) => key === item.key) ? styles.selected : ''}`}
                                onClick={()=> handleFilterClick(item.key)}
                                >
                                    <img src={item.icon} alt={item.label} className={styles.filter_icon}/>
                                    <p className={`${styles.filter_text} ${selectedJjinFilter?.some(([key]) => key === item.key) ? styles.selected_text : ''}`}>{item.label}</p>
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
                <button className={`${styles.reset_btn} ${isResetActive ? styles.reset_btn_active  : ""}`} 
                onClick={() => setSelectedJjinFilter([])}
                >초기화</button>
                <button className={`${styles.confirm_btn} ${isConfirmActive ? styles.confirm_btn_active : ""}`} 
                onClick={() => {
                    handleConfirm()
                    }}
                    >확인</button>
            </div>
        </div>
    )
}

export default JjinFilterModal;