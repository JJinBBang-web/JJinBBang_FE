// src/pages/event/EventAddressSearchPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { eventReviewFormState } from "../../recoil/event/eventReviewFormState";
import styles from "../../styles/review/AddressSearch.module.css";

const EventAddressSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const setForm = useSetRecoilState(eventReviewFormState);
  const postcodeRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
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
          const daum = (window as any).daum;
          const kakao = (window as any).kakao;
          if (daum && daum.Postcode && postcodeRef.current) {
            new daum.Postcode({
              width: "100%",
              height: "100%",
              oncomplete: (data: any) => {
                // 주소 표시 형식: 도로명 주소 + 건물명 (있는 경우)
                const displayAddress = data.buildingName
                  ? `${data.roadAddress} (${data.buildingName})`
                  : data.roadAddress;

                // Geocoder를 사용하여 좌표 얻기
                const saveAndNavigate = (lat?: number, lng?: number) => {
                  // eventReviewFormState에 주소 정보 저장
                  setForm((prev) => ({
                    ...prev,
                    address: {
                      keyword: displayAddress,
                      roadAddress: data.roadAddress,
                      detail: data.buildingName || "",
                      lat: lat || undefined,
                      lng: lng || undefined,
                    },
                  }));

                  // 이벤트 리뷰 페이지로 돌아가기 (replace로 히스토리 대체)
                  navigate("/event/review/write", { replace: true });
                };

                // Postcode API에서 좌표를 제공하는 경우
                if (data.y && data.x) {
                  saveAndNavigate(parseFloat(data.y), parseFloat(data.x));
                  return;
                }

                // 좌표가 없는 경우 Geocoder 사용 시도
                if (kakao && kakao.maps && kakao.maps.services) {
                  const geoCoder = new kakao.maps.services.Geocoder();
                  geoCoder.addressSearch(
                    data.roadAddress,
                    (result: any, status: any) => {
                      if (status === kakao.maps.services.Status.OK) {
                        const { x, y } = result[0];
                        saveAndNavigate(parseFloat(y), parseFloat(x));
                      } else {
                        // Geocoder 실패 시 좌표 없이 저장
                        saveAndNavigate();
                      }
                    }
                  );
                } else {
                  // Kakao Maps가 없으면 좌표 없이 저장
                  saveAndNavigate();
                }
              },
            }).embed(postcodeRef.current);
          }
        }, 300);
      } catch (error) {
        console.error("Postcode API 로드 실패:", error);
      }
    }
  }, [isScriptLoaded, setForm, navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>주소검색</h1>
      <div className={styles.postcodeBox}>
        <div
          ref={postcodeRef}
          className={styles.postcodeContainer}
          style={{
            width: "100%",
            position: "relative",
            maxWidth: "393px",
            margin: "0 auto",
          }}
        ></div>
      </div>
    </div>
  );
};

export default EventAddressSearchPage;
