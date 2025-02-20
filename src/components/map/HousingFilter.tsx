import { useRecoilState } from "recoil";
import { housingTypeState } from "../../recoil/map/mapRecoilState";
import housingIcon from "../../assets/image/housingIcon.svg"
import styles from './HousingFilter.module.css'
import '../../styles/global.css'


const HousingFilter = () => {
    // 찐빵 유형 상태 변경 함수
    const [housingType, setHousingType] = useRecoilState(housingTypeState);

    // UI 디자인
    return (
        <div className={styles.housing_btn}>
            <img src={housingIcon} alt="housing"/>
            <p className={styles.housing_type}>전체</p>
        </div>
    )
}

export default HousingFilter;