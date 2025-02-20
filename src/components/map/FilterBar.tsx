import { useRecoilState } from "recoil"
import { filterState } from "../../recoil/map/mapRecoilState"
import { useState } from "react";
import iconFilter from "../../assets/image/iconFilter.svg"
import iconDown from "../../assets/image/downIcon.svg"
import styles from "./FilterBar.module.css"
import '../../styles/global.css'


const FilterBar = () => {
    const [filters, setFilters] = useRecoilState(filterState)
    const [openFilter, setOpenFilter] = useState<string | null>(null);


    // const handleFilterChange = (type: keyof typeof filters, value: string) => {
    //     setFilters((prev) => ({ ...prev, [type]: value }));
    //     setOpenFilter(null);
    //   };


    return (
        <div className={styles.filter_bar}>
            <div className={styles.filter_slide_bar}>
                {/* 찐필터 아이콘 */}
                <button className={styles.filter_icon_btn}>
                    <img src={iconFilter} alt="filter"/>
                </button>
                {/* 각종 필터들 */}
                <button className={styles.filter_btn}>
                    <p className={styles.filter_text}>후기별</p>
                    <img src={iconDown} alt="down"/>
                </button>
                <button className={styles.filter_btn}>
                    <p className={styles.filter_text}>대학교</p>
                    <img src={iconDown} alt="down"/>
                </button>
                <button className={styles.filter_btn}>
                    <p className={styles.filter_text}>계약 형태/조건</p>
                    <img src={iconDown} alt="down"/>
                </button>
            </div>
        </div>
    )
}

export default FilterBar;