import { useRecoilState } from "recoil";
import { housingTypeState, selectedTypeState } from "../recoil/mapRecoilState";
import housingIcon from "../../assets/image/iconHousing.svg"
import styles from './HousingFilter.module.css'
import { isSheetOpenState } from "../../recoil/util/utilRecoilState";
import { typeToKorean } from "../../util/mapping";
import useExplorationTracking, { trackExplorationStep } from '../../hooks/useExplorationTracking';


const HousingFilter = () => {
    // 찐빵 유형 상태 변경 함수
    const [housingType, setHousingType] = useRecoilState(housingTypeState);
    // 바텀시트 열닫 상태
    const [, setBottomSheet] = useRecoilState(isSheetOpenState);
    const [, setSelectedType] = useRecoilState(selectedTypeState);


    const housingTypeToKr = typeToKorean[housingType];
    const isOver = housingType!.length >= 7;

    // UI 디자인
    return (
      <div className={`${styles.container} ${styles.housing_btn}`} onClick={() => {
            trackExplorationStep('3.1_map_view_HousingFilter');
            setSelectedType(housingType);
            setBottomSheet({ isOpenModal: true, type: "housing" }); }}>
            <img src={housingIcon} alt="housing"/>
            <p className={`${styles.housing_type} ${isOver ? styles.housing_type_2 : ""}`}>{housingTypeToKr ? housingTypeToKr : "전체"}</p>
        </div>
    )
}

export default HousingFilter;