import styles from "./Header.module.css"
import backIcon from "../assets/image/backIcon.svg"

interface HeaderProps {
  onClick?: () => void;
}

const Header:React.FC<HeaderProps> = ({onClick}) => {
    return (
        <div className={styles.content} onClick={onClick}>
            <img src={backIcon} alt="백버튼"/>
        </div>
    )
}

export default Header;