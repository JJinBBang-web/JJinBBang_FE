import { useRecoilState } from "recoil"
import { searchKeywordState } from "../../recoil/map/mapRecoilState"
import styles from "./SearchBar.module.css"
import '../../styles/global.css'
import searchIcon from "../../assets/image/iconSearch.svg"
import searchDeleteIcon from "../../assets/image/searchDelete.svg";

interface SearchBarProps {
    onSearch: () => void;
    isSearchMode?: boolean; // 검색 모드 여부
    onClearSearch?: () => void; // 검색 클리어 함수
}

const SearchBar = ({ onSearch, isSearchMode = false, onClearSearch }: SearchBarProps) => {
    // keyword 상태 관리 함수
    const [keyword, setKeyword] = useRecoilState(searchKeywordState);

    const handleIconClick = () => {
        if (isSearchMode) {
            // 검색 모드일 때는 검색 클리어
            if (onClearSearch) {
                onClearSearch();
            }
        } else {
            // 일반 모드일 때는 검색 실행 (키워드가 있을 때만)
            if (keyword.trim()) {
                onSearch();
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && keyword.trim() && !isSearchMode) {
            onSearch();
        }
    };

    // UI 개발
    return (
        <div className={`${styles.container} ${styles.search_bar}`}>
            <input
                type="text"
                value={keyword}
                placeholder="주소 및 대학교를 검색해 보세요!"
                onChange={handleInputChange}
                disabled={isSearchMode}          
                className={styles.search_text}
                onKeyDown={handleKeyDown}
            />
            <img 
                src={isSearchMode ? searchDeleteIcon : searchIcon} 
                alt={isSearchMode ? "clear" : "search"} 
                className={styles.searchIcon} 
                onClick={handleIconClick}
            />
        </div>
    )
}

export default SearchBar;