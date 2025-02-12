import { useLocation } from "react-router-dom";
import styles from './Nav.module.css'
import { NavLink } from "react-router-dom";
import nav_home_off from '../assets/image/navHomeOff.svg'
import nav_home_on from '../assets/image/navHomeOn.svg'
import nav_heart_off from '../assets/image/navHeartOff.svg'
import nav_heart_on from '../assets/image/navHeartOn.svg'
import nav_map_off from '../assets/image/navLocationOff.svg'
import nav_map_on from '../assets/image/navLocationOn.svg'
import nav_mypage_off from '../assets/image/navMypageOff.svg'
import nav_mypage_on from '../assets/image/navMypageOn.svg'


const Nav = () => {
    const location = useLocation()

    const getActiveNav = (path:string) => {
        switch(path) {
            case '/':
                return 1;
            case '/heart':
                return 2;
            case '/map':
                return 3;
            case '/mypage':
                return 4;
            default:
                return 0;
        }
    }

    const activeNav = getActiveNav(location.pathname);


    return (
        <div className={styles.navbar_div}>
            <div>
                <NavLink to="/" className={styles.navbar_tab}>
                    <img 
                    src={activeNav === 1 ? nav_home_on : nav_home_off} 
                    alt="home"
                    className={styles.navbar_icon}/>
                    <p className={activeNav === 1 ? styles.navbar_title : styles.navbar_text}>홈</p>
                </NavLink>
            </div>
            <div>
                <NavLink to="/heart" className={styles.navbar_tab}>
                    <img 
                    src={activeNav === 2 ? nav_heart_on : nav_heart_off}
                    alt="heart"
                    className={styles.navbar_icon}/>
                    <p className={activeNav === 2 ? styles.navbar_title : styles.navbar_text}>관심목록</p>
                </NavLink>
            </div>
            <div>
                <NavLink to="/map" className={styles.navbar_tab}>
                    <img 
                    src={activeNav === 3 ? nav_map_on : nav_map_off} 
                    alt="map"
                    className={styles.navbar_icon}/>
                    <p className={activeNav === 3 ? styles.navbar_title : styles.navbar_text}>지도</p>
                </NavLink>
            </div>
            <div>
                <NavLink to="/mypage" className={styles.navbar_tab}>
                    <img 
                    src={activeNav === 4 ? nav_mypage_on : nav_mypage_off} 
                    alt="mypage"
                    className={styles.navbar_icon}/>
                    <p className={activeNav === 4    ? styles.navbar_title : styles.navbar_text}>나의 찐빵</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Nav;