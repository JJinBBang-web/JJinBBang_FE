import { useRecoilState } from "recoil"
import { depositRangeState, filterState, maintenanceCostState, monthlyRentRangeState, selectedContractState, selectedJjinFilterState, selectedTypeNumState, selectedTypeState } from "../recoil/mapRecoilState"
import iconFilter from "../../assets/image/iconFilter.svg"
import iconDown from "../../assets/image/downIcon.svg"
import styles from "./FilterBar.module.css"
import '../../styles/global.css'
import { isSheetOpenState } from "../../recoil/util/utilRecoilState";
import useExplorationTracking, { trackExplorationStep } from '../../hooks/useExplorationTracking';

const FilterBar = () => {
    const [filters, setFilters] = useRecoilState(filterState)
    // 바텀시트 열닫 상태
    const [, setBottomSheet] = useRecoilState(isSheetOpenState);
    const [, setSelectedTypeNum] = useRecoilState(selectedTypeNumState);
    const [, setSelectedContractState] = useRecoilState(selectedContractState);
    const [, setMaintenanceCostState] = useRecoilState(maintenanceCostState);
    const [, setDepositRangeState] = useRecoilState(depositRangeState);
    const [, setMonthlyRentRange] = useRecoilState(monthlyRentRangeState);
    const [, setJjinFilterState] = useRecoilState(selectedJjinFilterState);

    return (
        <div className={styles.filter_bar}>
            <div className={styles.filter_slide_bar}>
                {/* 찐필터 아이콘 */}
                <button className={`${styles.filter_icon_btn} ${filters.reviewKeyword.length > 0 ? styles.filter_btn_select : ""}`} 
                onClick={() => {
                trackExplorationStep('3.3_map_view_jjinFilter');
                setBottomSheet({ isOpenModal: true, type: "jjinFilter" }); }}>
                    <img src={iconFilter} className={`${filters.reviewKeyword.length > 0 ? styles.filter_icon_select : ""}`} alt="filter"/>
                </button>
                {/* 각종 필터들 */}
                <button className={`${styles.filter_btn} ${styles.filter_btn_select}`} onClick={() => {
                trackExplorationStep('3.4_map_view_reviewType');
                setBottomSheet({ isOpenModal: true, type: "reviewType" }); }}>
                    <p className={`${styles.filter_text} ${styles.filter_text_select}`}>{filters.reviewType}</p>
                    <img src={iconDown} alt="down" className={styles.filter_icon_select}/>
                </button>
                <button className={`${styles.filter_btn} ${filters.university ? styles.filter_btn_select : ""}`} 
                onClick={() => {
                trackExplorationStep('3.5_map_view_university');
                setSelectedTypeNum(filters.university);
                setBottomSheet({ isOpenModal: true, type: "university" }); }}>
                    <p className={`${styles.filter_text} ${filters.university ? styles.filter_text_select : ""}`}>대학교</p>
                    <img src={iconDown} alt="down" className={filters.university ? styles.filter_icon_select : ""}/>
                </button>
                <button className={`${styles.filter_btn} ${filters.contractType!==null || filters.depositMax || filters.depositMin || filters.monthlyRentMin || filters.monthlyRentMax || filters.inMaintenanceCost ? styles.filter_btn_select : ""}`} 
                onClick={() => {
                trackExplorationStep('3.6_map_view_contract');
                setSelectedContractState(filters.contractType);
                setMaintenanceCostState(filters.inMaintenanceCost);
                setDepositRangeState([filters.depositMin, filters.depositMax]);
                setMonthlyRentRange([filters.monthlyRentMin, filters.monthlyRentMax]);
                setBottomSheet({ isOpenModal: true, type: "contract" }); }}>
                    <p className={`${styles.filter_text} ${filters.contractType!==null || filters.depositMax || filters.depositMin || filters.monthlyRentMin || filters.monthlyRentMax || filters.inMaintenanceCost ? styles.filter_text_select : ""}`}>계약 형태/조건</p>
                    <img src={iconDown} alt="down" className={filters.contractType!==null || filters.depositMax || filters.depositMin || filters.monthlyRentMin || filters.monthlyRentMax || filters.inMaintenanceCost ? styles.filter_icon_select : ""}/>
                </button>
            </div>
        </div>
    )
}

export default FilterBar;