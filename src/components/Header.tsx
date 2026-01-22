import styles from "./Header.module.css"
import backIcon from "../assets/image/backIcon.svg"
import closeIcon from '../assets/image/iconClose.svg';

interface HeaderProps {
  type?: 'title' | 'back' | 'close';
  title?: string;
  onClick?: () => void;
}

const Header:React.FC<HeaderProps> = ({type, onClick, title}) => {
    return (
        <div className={styles.content} >
            <img src={type === 'back' ? backIcon : closeIcon} alt={type === 'back' ? "백버튼" : "닫기버튼"} onClick={onClick}/>
            {type === 'title'
            ? 
            <>
            <p className={styles.title}>{title}</p>
                <div className={styles.nullPoint}/>
            </>    
            : null}
            
        </div>
    )
}

export default Header;