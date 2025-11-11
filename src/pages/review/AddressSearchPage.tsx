import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { reviewState } from "../../recoil/review/reviewAtoms";
import styles from "../../styles/review/AddressSearch.module.css";

declare global {
  interface Window {
    kakao: any;
  }
}

const { kakao } = window;

const AddressSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};
  const [review, setReview] = useRecoilState(reviewState);
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
          if (window.daum && window.daum.Postcode && postcodeRef.current) {
            new window.daum.Postcode({
              width: "100%",
              height: "100%",
              oncomplete: (data) => {
                // Geocoder를 사용하여 좌표 얻기 (Postcode API에 좌표가 없는 경우를 대비)
                const getCoordinates = (
                  callback: (lat: number, lng: number) => void
                ) => {
                  // Postcode API에서 좌표를 제공하는 경우
                  if (data.y && data.x) {
                    callback(parseFloat(data.y), parseFloat(data.x));
                    return;
                  }

                  // 좌표가 없는 경우 Geocoder 사용
                  const geoCoder = new kakao.maps.services.Geocoder();
                  geoCoder.addressSearch(
                    data.roadAddress,
                    (result: any, status: any) => {
                      if (status === kakao.maps.services.Status.OK) {
                        const { x, y } = result[0];
                        callback(parseFloat(y), parseFloat(x));
                      } else {
                        // Geocoder도 실패한 경우 에러 알림
                        alert(
                          "주소의 좌표를 찾을 수 없습니다. 다른 주소를 선택해주세요."
                        );
                        navigate(-1);
                      }
                    }
                  );
                };

                getCoordinates((lat, lng) => {
                  const updatedReview = {
                    ...review,
                    address: data.roadAddress,
                    addressDetail: data.jibunAddress || "",
                    detailedAddress: data.buildingName || "",
                    buildingCode: data.buildingCode || data.bcode || "",
                    latitude: lat,
                    longitude: lng,
                  };
                  setReview(updatedReview);

                  // 수정 모드일 경우
                  if (locationState.from === "confirm" && data.buildingName) {
                    navigate("/review/confirm", {
                      state: {
                        ...locationState,
                        address: {
                          roadAddress: data.roadAddress,
                          jibunAddress: data.jibunAddress,
                          buildingName: data.buildingName,
                        },
                      },
                    });
                  } else if (locationState.housingType === "공인중개사") {
                    // 공인중개사 모드일 경우
                    if (data.buildingName === "") {
                      navigate("/review/agency", {
                        state: {
                          ...locationState,
                          address: {
                            roadAddress: data.roadAddress,
                            jibunAddress: data.jibunAddress,
                            buildingName: data.buildingName,
                            buildingCode: data.buildingCode || data.bcode || "",
                          },
                          buildingName: data.buildingName,
                        },
                      });
                    } else {
                      navigate("/review/result", {
                        state: {
                          ...locationState,
                          address: {
                            roadAddress: data.roadAddress,
                            jibunAddress: data.jibunAddress,
                            buildingName: data.buildingName,
                            buildingCode: data.buildingCode || data.bcode || "",
                          },
                          buildingName: data.buildingName,
                        },
                      });
                    }
                  } else {
                    // 기숙사 타입인 경우 DormitoryInputPage로 이동
                    if (locationState.housingType === "기숙사") {
                      navigate("/review/dormitory", {
                        state: {
                          ...locationState,
                          address: {
                            roadAddress: data.roadAddress,
                            jibunAddress: data.jibunAddress,
                            buildingName: data.buildingName,
                            buildingCode: data.buildingCode || data.bcode || "",
                          },
                        },
                      });
                    } else {
                      // 일반 주거 타입인 경우 FloorInputPage로 이동
                      navigate("/review/floor", {
                        state: {
                          ...locationState,
                          address: {
                            roadAddress: data.roadAddress,
                            jibunAddress: data.jibunAddress,
                            buildingName: data.buildingName,
                            buildingCode: data.buildingCode || data.bcode || "",
                          },
                        },
                      });
                    }
                  }
                });
              },
            }).embed(postcodeRef.current);
          }
        }, 300);
      } catch (error) {
        // Handle error silently or show user-friendly message
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

export default AddressSearchPage;
