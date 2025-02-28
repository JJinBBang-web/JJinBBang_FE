import { useRecoilState } from "recoil"
import { filterState, selectedTypeNumState, selectedTypeState } from "../../recoil/map/mapRecoilState"
import { useState } from "react";
import iconFilter from "../../assets/image/iconFilter.svg"
import iconDown from "../../assets/image/downIcon.svg"
import styles from "./FilterBar.module.css"
import '../../styles/global.css'
import { isSheetOpenState } from "../../recoil/util/utilRecoilState";


const FilterBar = () => {
    const [filters, setFilters] = useRecoilState(filterState)
    // 바텀시트 열닫 상태
    const [, setBottomSheet] = useRecoilState(isSheetOpenState);
    const [, setSelectedType] = useRecoilState(selectedTypeState);
    const [, setSelectedTypeNum] = useRecoilState(selectedTypeNumState);
    
    return (
        <div className={styles.filter_bar}>
            <div className={styles.filter_slide_bar}>
                {/* 찐필터 아이콘 */}
                <button className={styles.filter_icon_btn} onClick={() => {
                console.log("바텀시트 열기 클릭!"); 
                setBottomSheet({ isOpen: true, type: "jjinFilter" }); }}>
                    <img src={iconFilter} alt="filter"/>
                </button>
                {/* 각종 필터들 */}
                <button className={`${styles.filter_btn} ${styles.filter_btn_select}`} onClick={() => {
                setBottomSheet({ isOpen: true, type: "reviewType" }); }}>
                    <p className={`${styles.filter_text} ${styles.filter_text_select}`}>{filters.reviewType}</p>
                    <img src={iconDown} alt="down" className={styles.filter_icon_select}/>
                </button>
                <button className={`${styles.filter_btn} ${filters.university ? styles.filter_btn_select : ""}`} 
                onClick={() => {
                setSelectedTypeNum(filters.university);
                setBottomSheet({ isOpen: true, type: "university" }); }}>
                    <p className={`${styles.filter_text} ${filters.university ? styles.filter_text_select : ""}`}>대학교</p>
                    <img src={iconDown} alt="down" className={filters.university ? styles.filter_icon_select : ""}/>
                </button>
                <button className={styles.filter_btn} onClick={() => {
                console.log("바텀시트 열기 클릭!"); 
                setBottomSheet({ isOpen: true, type: "contract" }); }}>
                    <p className={styles.filter_text}>계약 형태/조건</p>
                    <img src={iconDown} alt="down"/>
                </button>
            </div>
        </div>
    )
}

export default FilterBar;