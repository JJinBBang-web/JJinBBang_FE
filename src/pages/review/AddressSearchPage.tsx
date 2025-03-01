// src/pages/review/AddressSearchPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/review/AddressSearch.module.css';

const AddressSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postcodeRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // 스크립트 로딩
    if (!document.getElementById('kakao_postcode_script')) {
      const script = document.createElement('script');
      script.id = 'kakao_postcode_script';
      script.src =
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    // postcode 초기화
    if (isScriptLoaded && postcodeRef.current) {
      new (window as any).daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: (data: any) => {
          console.log('✅ 주소 선택 완료:', data);
          navigate('/review/floor', {
            state: {
              ...location.state,
              address: {
                roadAddress: data.roadAddress,
                jibunAddress: data.jibunAddress,
                buildingName: data.buildingName,
              },
            },
          });
        },
      }).embed(postcodeRef.current);
    }
  }, [isScriptLoaded, navigate, location.state]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>주소검색</h1>
      <div className={styles.postcodeBox}>
        <div ref={postcodeRef} className={styles.postcodeContainer}></div>
      </div>
    </div>
  );
};

export default AddressSearchPage;
