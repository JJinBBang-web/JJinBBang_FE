import room from "../../assets/image/houseIconOneTwo.svg"
import apt from "../../assets/image/houseIconApt.svg"
import villa from "../../assets/image/houseIconVilla.svg"
import office from "../../assets/image/houseIconOffice.svg"
import domitory from "../../assets/image/houseIconDomitory.svg"
import gosiwon from "../../assets/image/houseIconGosiwon.svg"
import styles from "./HousingFilterModal.module.css"

const housingTypes = [
    { id : "room", label : "원/투룸", icon : room},
    { id : "apt", label : "아파트", icon : apt},
    { id : "villa", label : "주택/빌라", icon : villa},
    { id : "office", label : "오피스텔", icon : office},
    { id : "domitory", label : "기숙사", icon : domitory},
    { id : "gosiwon", label : "하숙집/고시원", icon : gosiwon}
]

const HousingFilterModal = () => {
    return (
        <div className={styles.content}>
            <div className={styles.grid_content}>
                {housingTypes.map((option) => (
                    <button key={option.id} className={styles.type_btn}>
                        <img src={option.icon} alt={option.id} width="44px" />
                        <p className={styles.type_text}>{option.label}</p>
                    </button>
                ))}
            </div>
            <div className={styles.btn_content}>
                <button className={styles.reset_btn}>초기화</button>
                <button className={styles.confirm_btn}>확인</button>
            </div>
        </div>
    )
}

export default HousingFilterModal;