import styles from "./Header.module.css"
import backIcon from "../../assets/image/backIcon.svg"

interface HeaderProps {
  type?: 'title' | 'icon';
  title?: string;
  onClick?: () => void;
}

const Header:React.FC<HeaderProps> = ({type, onClick, title}) => {
    return (
        <div className={styles.content} >
            <img src={backIcon} alt="백버튼" onClick={onClick}/>
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