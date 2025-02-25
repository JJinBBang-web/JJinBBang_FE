// src/pages/review/AddressSearchPage.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/review/AddressSearch.module.css';
import backArrowIcon from '../../assets/image/backArrowIcon.svg';

const AddressSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const postcodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.getElementById('kakao_postcode_script')) return;

    const script = document.createElement('script');
    script.id = 'kakao_postcode_script';
    script.src =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (postcodeRef.current) {
        new (window as any).daum.Postcode({
          oncomplete: (data: any) => {
            console.log('✅ 주소 선택 완료:', data);
            // 선택된 주소 데이터를 다음 페이지로 전달
            navigate('/review/floor', {
              state: {
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
    };
  }, [navigate]);

  return (
    <div className="content">
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img src={backArrowIcon} alt="back" />
        </button>
        <h1 className={styles.title}>주소검색</h1>
      </header>
      <div className={styles.postcodeBox}>
        <div ref={postcodeRef} className={styles.postcodeContainer}></div>
      </div>
    </div>
  );
};

export default AddressSearchPage;
