import { useRecoilState } from "recoil";
import { housingTypeState } from "../../recoil/map/mapRecoilState";
import housingIcon from "../../assets/image/iconHousing.svg"
import styles from './HousingFilter.module.css'
import '../../styles/global.css'
import { isSheetOpenState } from "../../recoil/util/utilRecoilState";


const HousingFilter = () => {
    // 찐빵 유형 상태 변경 함수
    const [housingType, setHousingType] = useRecoilState(housingTypeState);
    // 바텀시트 열닫 상태
    const [, setBottomSheet] = useRecoilState(isSheetOpenState);

    // UI 디자인
    return (
        <div className={styles.housing_btn} onClick={() => {
            console.log("바텀시트 열기 클릭!"); 
            setBottomSheet({ isOpen: true, type: "housing" }); }}>
            <img src={housingIcon} alt="housing"/>
            <p className={styles.housing_type}>전체</p>
        </div>
    )
}

export default HousingFilter;