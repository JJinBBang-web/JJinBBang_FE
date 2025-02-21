import { useRecoilState } from "recoil";
import styles from "./ReviewTypeFilterModal.module.css"
import { filterState } from "../../recoil/map/mapRecoilState";
import { isSheetOpenState } from "../../recoil/util/utilRecoilState";

const ReviewTypeFilterModal = () => {

    const [filters, setFilters] = useRecoilState(filterState)
    const [, setBottomSheet] = useRecoilState(isSheetOpenState);

    const handleSelect = (type: string) => {
        setFilters((prev) => ({ ...prev, reviewType: type }));
    };
    
    return (
        <div className={styles.content}>
            <div className={styles.btn_content}>
                <button className={filters.reviewType === "후기별" ? styles.select_btn : styles.unselect_btn}
                onClick={() => handleSelect("후기별")}>
                    후기별</button>
                <button className={filters.reviewType === "건물별" ? styles.select_btn : styles.unselect_btn}
                onClick={() => handleSelect("건물별")}>
                    건물별</button>
            </div>
        </div>
    )
}

export default ReviewTypeFilterModal;