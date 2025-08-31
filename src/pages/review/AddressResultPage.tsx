// src/pages/review/AddressResultPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import styles from "../../styles/review/AddressResult.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import JBMarker from "../../assets/image/JBMarker.svg";

interface LocationState {
  address: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  buildingName: string;
  floor: string;
  squareFootage?: string; // 평수 정보 추가
}

const AddressResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};
  const { housingType } = location.state;
  const { address, buildingName, floor, squareFootage } =
    (location.state as LocationState) || {
      address: { roadAddress: "", jibunAddress: "", buildingName: "" },
      buildingName: "",
      floor: "",
      squareFootage: "",
    };

  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 기본값: 서울시청
  const [isMapLoading, setIsMapLoading] = useState(true);

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // Geocoder를 사용한 주소 → 좌표 변환
  useEffect(() => {
    if (!address.roadAddress) return;

    const geoCoder = new kakao.maps.services.Geocoder();
    
    geoCoder.addressSearch(address.roadAddress, (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        const { x, y } = result[0];
        const coords = new kakao.maps.LatLng(y, x);
        setMapCenter({ lat: coords.getLat(), lng: coords.getLng() });
      }
      setIsMapLoading(false);
    });
  }, [address.roadAddress]);

  const handleNext = () => {
    if (housingType === "공인중개사") {
      navigate("/review/room-info", {
        state: {
          ...location.state,
        },
      });
    } else {
      navigate("/review/price", {
        state: {
          ...location.state,
        },
      });
    }
  };

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
        </header>
        <div className={styles.titleBox}>
          <span className={styles.title}>
            {housingType === "공인중개사"
              ? "정확한 정보가 맞나요?"
              : "정확한 주소가 맞나요?"}
            <button
              className={styles.searchButton}
              onClick={() =>
                navigate("/review/address", {
                  state: {
                    ...locationState,
                  },
                })
              }
            >
              주소 재검색
            </button>
          </span>
        </div>
        <div className={styles.addressInfo}>
          <div className={styles.addressSection}>
            <span className={styles.label}>주소</span>
            <p className={styles.address}>{address.roadAddress}</p>
          </div>
          <div className={styles.addressSection}>
            <span className={styles.label}>
              {housingType === "공인중개사" ? "상호명" : "상세 주소"}
            </span>
            <p className={styles.detailAddress}>{buildingName}</p>
          </div>
          {housingType != "공인중개사" && (
            <>
              <div className={styles.addressSection}>
                <span className={styles.label}>평수</span>
                <p className={styles.floor}>
                  {squareFootage ? `${squareFootage}평` : ""}
                </p>
              </div>
              <div className={styles.addressSection}>
                <span className={styles.label}>층수</span>
                <p className={styles.floor}>{floor}</p>
              </div>
            </>
          )}
        </div>
        <div id="map" className={styles.map}>
          {isMapLoading ? (
            <div className={styles.mapPlaceholder}>
              <p>지도를 불러오는 중...</p>
            </div>
          ) : (
            <Map
              center={mapCenter}
              style={{ width: '100%', height: '100%' }}
              level={3}
              draggable={true}
              zoomable={true}
            >
              <MapMarker 
                position={mapCenter}
                image={{ src: JBMarker, size: { width: 40, height: 40 } }}
              />
            </Map>
          )}
        </div>
      </div>
      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={() => navigate(-1)}>
          이전
        </button>
        <button className={styles.nextButton} onClick={handleNext}>
          다음
        </button>
      </footer>
      {showCancelModal && (
        <CancelModal
          onClose={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
};

export default AddressResultPage;
