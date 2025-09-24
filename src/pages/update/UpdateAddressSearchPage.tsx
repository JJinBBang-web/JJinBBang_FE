  import React, { useEffect, useRef, useState } from 'react';
  import { useNavigate, useLocation, useParams } from 'react-router-dom';
  import { useRecoilState } from 'recoil';
  import { ReviewState, reviewState } from '../../recoil/review/reviewAtoms';
  import styles from '../../styles/review/AddressSearch.module.css';
  import { updateReviewState } from '../../recoil/review/updateReviewAtoms';
  import { defaultReviewState } from '../../recoil/review/reviewAtoms';


  const UpdateAddressSearchPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state || {};
    const [review, setReview] = useRecoilState(updateReviewState);
    const postcodeRef = useRef<HTMLDivElement>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    const { reviewId } = useParams();
    const geoCoder = new kakao.maps.services.Geocoder();

    const getAddressCoords = (address: string): Promise<{ lat: number; lng: number }> => {
      return new Promise((resolve, reject) => {
        geoCoder.addressSearch(address, (result: any, status: any) => {
          if (status === kakao.maps.services.Status.OK) {
            const { x, y } = result[0];
            const coords = new kakao.maps.LatLng(y, x);
            resolve({ lat: coords.getLat(), lng: coords.getLng() });
          } else {
            reject(status);
          }
        });
      });
    };


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
                oncomplete: async (data) => {
                  const mainAddress = data.roadAddress || data.jibunAddress;
                  const { lat, lng } = await getAddressCoords(mainAddress);
                  
                  // 수정 모드일 경우
                  setReview(prev => {
                      const base: ReviewState = prev ?? defaultReviewState;
                      return {
                        ...base,
                        address: data.roadAddress || data.jibunAddress || '',
                        detailedAddress: data.buildingName || '',
                        latitude : lat,
                        longitude : lng,
                        buildingCode: data.buildingCode
                      };
                  });
                  navigate(`/review/${reviewId}/update`, { replace: true });
                  }
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

  export default UpdateAddressSearchPage;
