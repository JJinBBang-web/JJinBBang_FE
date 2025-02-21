import { useRecoilState } from "recoil";
import { JjinFilterState } from "../../recoil/util/filterRecoilState";
import styles from "./JjinFilterModal.module.css";
import iconDown from "../../assets/image/iconDown.svg"

const JjinFilterModal = () => {
    const [filters, setFilters] = useRecoilState(JjinFilterState);
    
    return (
        <div className={styles.content}>
            <div className={styles.filter_wrap}>
                {filters.map((category) => (
                    <div className={styles.jjin_filter_wrap}>
                        <p className={styles.title}>{category.category}</p>
                        <div className={styles.jjin_filter}>
                            {category.filter.map((item, index) => (
                                <button key={index} className={styles.filter_btn}>
                                    <img src={item.icon} alt={item.label} className={styles.filter_icon}/>
                                    <p className={styles.filter_text}>{item.label}</p>
                                </button>
                            ))}
                        </div>
                        <button className={styles.bottom_btn}>
                            <img src={iconDown} alt="스크롤"/>
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