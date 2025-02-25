// src/pages/review/AddressResultPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/review/AddressResult.module.css';
import { searchAddress, AddressResult } from '../../util/addressApi';

const AddressResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialKeyword = location.state?.keyword || '성북로4길';

  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [hasResults, setHasResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialKeyword) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const results = await searchAddress(searchTerm);
      setResults(results);
      setHasResults(results.length > 0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <p>주소를 검색 중입니다...</p>
        </div>
      );
    }

    if (!hasResults) {
      return (
        <div className={styles.resultSection}>
          <p className={styles.resultInfo}>
            검색결과가 없습니다. 검색어에 아래와 같은 조합을 이용하시면 더욱
            정확한 결과가 검색됩니다.
          </p>
          <div className={styles.tipSection}>
            <p>도로명 + 건물번호</p>
            <p className={styles.example}>예: 판교역로 166, 제주 첨단로 242</p>
            <p>지역명(동/리) + 번지</p>
            <p className={styles.example}>예: 백현동 532, 제주 영평동 2181</p>
            <p>지역명(동/리) + 건물명(아파트명)</p>
            <p className={styles.example}>예: 분당 주공, 연수동 주공3차</p>
            <p>사서함명 + 번호</p>
            <p className={styles.example}>예: 분당우체국사서함 1~100</p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.addressList}>
        {results.map((result, index) => (
          <button
            key={index}
            className={styles.addressItem}
            onClick={() =>
              navigate('/review/floor', { state: { address: result } })
            }
          >
            <div className={styles.roadAddress}>{result.roadAddress}</div>
            <div className={styles.jibunAddress}>{result.jibunAddress}</div>
            {result.buildingName && (
              <div className={styles.buildingName}>{result.buildingName}</div>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <img src="/assets/image/closeIcon.svg" alt="close" />
          </button>
        </header>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
              <img src="/assets/image/searchIcon.svg" alt="search" />
            </button>
          </div>
          <button
            className={styles.reSearchButton}
            onClick={() => navigate('/review/address')}
          >
            주소 재검색
          </button>
        </div>
        {renderResults()}
      </div>
    </div>
  );
};

export default AddressResultPage;
