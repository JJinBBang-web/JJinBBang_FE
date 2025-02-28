import { useRecoilState, useRecoilValue } from "recoil"
import { isSheetOpenState } from "../../recoil/util/utilRecoilState"
import styles from "./ModalBottomSheet.module.css"
import iconClose from "../../assets/image/iconClose.svg"
import HousingFilterModal from "../map/HousingFilterModal"
import '../../styles/global.css'
import { useEffect, useState } from "react"
import ReviewTypeFilterModal from "../map/ReviewTypeFilterModal"
import UniversityFilterModal from "../map/UniversityFilterModal"
import ContractFilterModal from "../map/ContractFilterModal"
import JjinFilterModal from "../map/JjinFilterModal"
import { filterState, housingTypeState, selectedTypeNumState, selectedTypeState } from "../../recoil/map/mapRecoilState"
import { selectedUniversityState } from "../../recoil/map/universityRecoilState"


const ModalBottomSheet = () => {
    const [{ isOpen, type }, setBottomSheet] = useRecoilState(isSheetOpenState);
    const [isRendered, setIsRendered] = useState(false);
    const [,setSelectedType] = useRecoilState(selectedTypeState);
    const [, setSelectedTypeNum] = useRecoilState(selectedTypeNumState);
    const housingType = useRecoilValue(housingTypeState);
    const university = useRecoilValue(filterState).university;

    console.log("isOpen:", isOpen, "type:", type); // 상태 변경 확인

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
        } else {
            const timer = setTimeout(() => setIsRendered(false), 300); // transition 시간과 일치
            return () => clearTimeout(timer);
        }
    }, [isOpen]);
    

    const closeModal = () => {
        setBottomSheet({ isOpen: false, type: null });
    
        if (type === "housing") {
            setSelectedType(housingType);
        } 
        if (type == "university") {
            setSelectedTypeNum(university);
        }
    };
    
    if (!isOpen) return null;

    // type에 따른 제목 설정
    const titleMap: Record<NonNullable<typeof type>, string> = {
        housing: "찐빵 유형",
        reviewType: "보기 유형",
        university: "대학교",
        contract: "계약 형태",
        jjinFilter: "찐 후기 필터",
      };

    return (
        <>
        <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`} 
                 onClick={closeModal} />
        <div className={`${styles.sheet} ${isOpen ? styles.open : ""}`}>
            <div className={styles.sheet_header}>
                <div className={styles.header_divider}></div>
            </div>
            <div className={styles.sheet_title_wrap}>
                {/* 제목설정 */}
                <div className={styles.sheet_info_wrap}>
                    <p className={styles.sheet_title}>
                        {type ? titleMap[type] : "목록"}
                    </p>
                    {type === "jjinFilter" && <p className={styles.sheet_info}>원하는 키워드를 1개~5개 골라주세요!</p>}
                </div>
                <img src={iconClose} width="24px" onClick={closeModal}/>
            </div>
            {type === "housing" && <HousingFilterModal/>}
            {type === "reviewType" && <ReviewTypeFilterModal/>}
            {type === "university" && <UniversityFilterModal/>}
            {type === "contract" && <ContractFilterModal/>}
            {type === "jjinFilter" && <JjinFilterModal/>}
        </div>
        </>
    )
}

export default ModalBottomSheet;