import { useRecoilState } from "recoil"
import { searchKeywordState } from "../../recoil/map/mapRecoilState"
import styles from "./SearchBar.module.css"
import '../../styles/global.css'
import searchIcon from "../../assets/image/searchIcon.svg"


const SearchBar = () => {
    // keyword 상태 관리 함수
    const [keyword, setKeyword] = useRecoilState(searchKeywordState);

    // UI 개발
    return (
        <div className={styles.search_bar}>
            <input
                type="text"
                value={keyword}
                placeholder="주소 및 대학교를 검색해 보세요!"
                onChange={(e) => setKeyword(e.target.value)}
                className={styles.search_text}
            />
            <img src={searchIcon} alt="search"/>
        </div>
    )
}

export default SearchBar;