import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { reviewState } from "../../recoil/review/reviewAtoms";
import { AgencyAPI } from "../../api/agency/AgencyAPI";
import { AgencyInfo } from "../../types/entity/agency/AgencyInterface";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import styles from "../../styles/review/FloorInput.module.css";
import closeIcon from "../../assets/image/iconClose.svg";

interface LocationState {
  address: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  from?: string;
}

const AgencyInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [review, setReview] = useRecoilState(reviewState);
  const { address, from } = (location.state as LocationState) || {};

  const [buildingName, setBuildingName] = useState(
    review.detailedAddress || address?.buildingName || ""
  );
  const [searchResults, setSearchResults] = useState<AgencyInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const ITEMS_PER_PAGE = 4;

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    // 수정 모드일 경우 기존 상태 복원
    if (from === "confirm") {
      setBuildingName(review.detailedAddress || "");
    }
  }, [from, review]);

  // Debounce를 위한 타이머 - 최소 2글자 이상일 때만 검색
  useEffect(() => {
    const trimmedName = buildingName.trim();

    if (trimmedName.length >= 2) {
      const timer = setTimeout(() => {
        setCurrentPage(1); // 검색 시 첫 페이지로 리셋
        handleSearch();
      }, 800); // 800ms 후에 검색 (입력이 끝날 때까지 대기)

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setHasSearched(false);
      setCurrentPage(1);
      setTotalPages(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingName]);

  // 공인중개사 검색 함수
  const handleSearch = async () => {
    const trimmedName = buildingName.trim();

    if (!trimmedName || trimmedName.length < 2) {
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await AgencyAPI.searchAgency({
        agencyName: trimmedName,
        num: 10,
        page: 1,
      });

      if (response.code === 200 && response.data.items.length > 0) {
        setSearchResults(response.data.items);
        // 전체 페이지 수 계산
        setTotalPages(Math.ceil(response.data.items.length / ITEMS_PER_PAGE));
      } else {
        setSearchResults([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("공인중개사 조회 실패:", error);
      // 개발 환경에서 API가 없을 수 있으므로 조용히 처리
      setSearchResults([]);
      setHasSearched(false);
      setTotalPages(0);
    } finally {
      setIsSearching(false);
    }
  };

  // 현재 페이지에 표시할 데이터 계산
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return searchResults.slice(startIndex, endIndex);
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 공인중개사 선택 함수
  const handleSelectAgency = (agency: AgencyInfo) => {
    const updatedReview = {
      ...review,
      detailedAddress: agency.companyName, // 상호명
      address: agency.roadAddress,
      addressDetail: agency.jibunAddress,
      buildingCode: agency.registerNumber, // 개설등록번호를 buildingCode로 사용
      latitude: agency.latitude,
      longitude: agency.longitude,
    };

    setReview(updatedReview);

    if (from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
        },
      });
    } else {
      navigate("/review/result", {
        state: {
          ...location.state,
          buildingName: agency.companyName,
          address: {
            roadAddress: agency.roadAddress,
            jibunAddress: agency.jibunAddress,
            buildingName: agency.companyName,
            buildingCode: agency.registerNumber,
          },
        },
      });
    }
  };

  const handleBack = () => {
    if (from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
        },
      });
    } else {
      // 공인중개사 리뷰 플로우: 유형 선택 페이지로 이동
      navigate("/review/type", {
        state: {
          ...location.state,
        },
      });
    }
  };

  const isSearchEnabled = buildingName.trim() !== "";

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
          <h1>공인중개사의 상호명을 입력해 주세요!</h1>
        </header>
        <div className={styles.inputSection}>
          <label className={styles.label}>상호명</label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className={styles.buildingInput}
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              placeholder="예) 찐빵중개사"
              onKeyPress={(e) => {
                if (e.key === "Enter" && isSearchEnabled) {
                  handleSearch();
                }
              }}
            />

            {/* 드롭다운 검색 결과 표시 */}
            {hasSearched && searchResults.length > 0 && (
              <div>
                {getCurrentPageData().map((agency, index) => (
                  <div
                    key={`${agency.registerNumber}-${index}`}
                    onClick={() => handleSelectAgency(agency)}
                    style={{
                      padding: "16px",
                      borderBottom:
                        index < getCurrentPageData().length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f5f5f5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        marginBottom: "6px",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      {agency.companyName}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#888",
                        marginBottom: "4px",
                      }}
                    >
                      {agency.roadAddress}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 검색 결과 없음 안내 */}
            {hasSearched &&
              !isSearching &&
              searchResults.length === 0 &&
              buildingName.trim().length >= 2 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: "4px",
                    padding: "16px",
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    textAlign: "center",
                    color: "#666",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    검색 결과가 없습니다.
                  </div>
                  <div style={{ fontSize: "13px", color: "#999" }}>
                    '다음' 버튼을 눌러 진행하세요.
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* 페이지네이션 */}
      {hasSearched && searchResults.length > 0 && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            padding: "16px 0",
            marginTop: "8px",
          }}
        >
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border:
                  currentPage === pageNum
                    ? "2px solid #4CAF50"
                    : "1px solid #e0e0e0",
                backgroundColor: currentPage === pageNum ? "#4CAF50" : "white",
                color: currentPage === pageNum ? "white" : "#333",
                fontSize: "14px",
                fontWeight: currentPage === pageNum ? "600" : "400",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== pageNum) {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== pageNum) {
                  e.currentTarget.style.backgroundColor = "white";
                }
              }}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}

      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={handleBack}>
          이전
        </button>
        {/* 검색 결과가 있으면 다음 버튼 숨김 (리스트에서 직접 선택) */}
        {!(hasSearched && searchResults.length > 0) && (
          <button
            className={`${styles.nextButton} ${
              isSearchEnabled ? styles.enabled : ""
            }`}
            onClick={() => {
              // 검색 결과가 없으면 수동으로 입력한 상호명으로 진행
              if (buildingName.trim()) {
                const manualAgency: AgencyInfo = {
                  registerNumber: "MANUAL",
                  companyName: buildingName.trim(),
                  brokerName: "",
                  roadAddress: "",
                  jibunAddress: "",
                  latitude: 0,
                  longitude: 0,
                };
                handleSelectAgency(manualAgency);
              }
            }}
            disabled={!isSearchEnabled}
          >
            다음
          </button>
        )}
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

export default AgencyInputPage;
