import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { reviewState } from '../../recoil/review/reviewAtoms';
import styles from '../../styles/review/AddressSearch.module.css';

const AddressSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};
  const [review, setReview] = useRecoilState(reviewState);
  const postcodeRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded && postcodeRef.current) {
      try {
        setTimeout(() => {
          if (window.daum && window.daum.Postcode && postcodeRef.current) {
            new window.daum.Postcode({
              width: '100%',
              height: '100%',
              oncomplete: (data) => {
                const updatedReview = {
                  ...review,
                  address: data.roadAddress,
                  addressDetail: data.jibunAddress || '',
                  detailedAddress: data.buildingName || '',
                };
                setReview(updatedReview);
                localStorage.setItem(
                  'reviewState',
                  JSON.stringify(updatedReview)
                );

                // 수정 모드일 경우
                if (locationState.from === 'confirm') {
                  navigate('/review/confirm', {
                    state: {
                      ...locationState,
                      address: {
                        roadAddress: data.roadAddress,
                        jibunAddress: data.jibunAddress,
                        buildingName: data.buildingName,
                      },
                    },
                  });
                } else {
                  // 일반 모드일 경우
                  navigate('/review/floor', {
                    state: {
                      ...locationState,
                      address: {
                        roadAddress: data.roadAddress,
                        jibunAddress: data.jibunAddress,
                        buildingName: data.buildingName,
                      },
                    },
                  });
                }
              },
            }).embed(postcodeRef.current);
          } else {
            console.error('Daum postcode API not loaded correctly');
          }
        }, 300);
      } catch (error) {
        console.error('Error initializing Daum postcode:', error);
      }
    }
  }, [isScriptLoaded, locationState, review, setReview, navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>주소검색</h1>
      <div className={styles.postcodeBox}>
        <div
          ref={postcodeRef}
          className={styles.postcodeContainer}
          style={{
            width: '100%',
            position: 'relative',
            maxWidth: '393px',
            margin: '0 auto',
          }}
        ></div>
      </div>
    </div>
  );
};

export default AddressSearchPage;
