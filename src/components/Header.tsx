import styles from "./Header.module.css"
import backIcon from "../assets/image/backIcon.svg"

const Header:React.FC = () => {
    return (
        <div className={styles.content}>
            <img src={backIcon} alt="백버튼"/>
        </div>
    )
}

export default Header;