import room from "../../assets/image/houseIconOneTwo.svg"
import apt from "../../assets/image/houseIconApt.svg"
import villa from "../../assets/image/houseIconVilla.svg"
import office from "../../assets/image/houseIconOffice.svg"
import domitory from "../../assets/image/houseIconDomitory.svg"
import gosiwon from "../../assets/image/houseIconGosiwon.svg"
import agency from "../../assets/image/houseIconAgency.svg"
import styles from "./HousingFilterModal.module.css"
import { useRecoilState, useRecoilValue } from "recoil"
import { housingTypeState, selectedTypeState } from "../../recoil/map/mapRecoilState"
import { isSheetOpenState } from "../../recoil/util/utilRecoilState"

const housingTypes = [
    { id : "room", label : "원/투룸", icon : room},
    { id : "apt", label : "아파트", icon : apt},
    { id : "villa", label : "주택/빌라", icon : villa},
    { id : "office", label : "오피스텔", icon : office},
    { id : "domitory", label : "기숙사", icon : domitory},
    { id : "gosiwon", label : "하숙집/고시원", icon : gosiwon},
    { id: "AGENCY", label: "공인중개사", icon: agency}
]

const HousingFilterModal = () => {
    // 임시 유형 함수
    const [selectedType, setSelectedType] = useRecoilState(selectedTypeState);
    // 타입 설정 함수
    const [, setHousingType] = useRecoilState(housingTypeState);
    // 현재 타입
    const housingType = useRecoilValue(housingTypeState);
    // 모달 상태관리
    const [,setBottomSheet] = useRecoilState(isSheetOpenState)

    // 확인 버튼 활성화 조건: 현재 housingType과 다를 때
    const isConfirmActive = selectedType !== housingType;
    
    // 초기화 버튼 활성화 조건: "전체"가 아닐 때
    const isResetActive = selectedType !== "전체";

    const handleConfirm = () => {
        if (isConfirmActive) {
            setHousingType(selectedType);
            
            // 먼저 isOpen만 false로 설정해서 닫히는 애니메이션 실행
            setBottomSheet(prev => ({ ...prev, isOpen: false })); 
            
            // 300ms 후에 type을 null로 설정해서 완전히 제거
            setTimeout(() => {
                setBottomSheet({ isOpenModal: false, type: 'housing' });
            }, 200);
        }
    };

    return (
        <div className={styles.content}>
            <div className={styles.grid_content}>
                {housingTypes.map((option) => (
                    <button key={option.id} className={`${styles.type_btn} ${selectedType === option.label ? styles.selected : ""}`} 
                    onClick={() => setSelectedType(option.label)}>
                        <img src={option.icon} alt={option.id} width="44px" />
                        <p className={`${styles.type_text} ${selectedType === option.id ? styles.selected_text : ""}`}>{option.label}</p>
                    </button>
                ))}
            </div>
            <div className={styles.btn_content}>
                <button className={`${styles.reset_btn} ${isResetActive ? styles.reset_btn_active : ""}`} 
                onClick={() => setSelectedType("전체")}>초기화</button>
                <button className={`${styles.confirm_btn} ${isConfirmActive ? styles.confirm_btn_active : ""}`} 
                onClick={() => {
                    handleConfirm();
                    }}>확인</button>
            </div>
        </div>
    )
}

export default HousingFilterModal;