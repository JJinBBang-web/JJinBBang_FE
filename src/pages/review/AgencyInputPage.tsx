import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { reviewState } from "../../recoil/review/reviewAtoms";
import { AgencyAPI } from "../../api/agency/AgencyAPI";
import { AgencyInfo } from "../../types/entity/agency/AgencyInterface";
import CancelModal from "../../components/review/CancelModal";
import AgencyPagination from "../../components/review/AgencyPagination";
import { useCancelModal } from "../../util/useCancelModal";
import { reviewAutoSave, REVIEW_STEPS } from "../../util/reviewAutoSave";
import styles from "../../styles/review/FloorInput.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import useReviewStepTracking from "../../hooks/useReviewStepTracking";

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
  const [selectedAgency, setSelectedAgency] = useState<AgencyInfo | null>(null);

  const ITEMS_PER_PAGE = 5;

  useReviewStepTracking('3-3_agency_input');

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    // result 페이지에서 돌아온 경우 입력 필드 초기화
    if (from === "result") {
      setBuildingName("");
      setSearchResults([]);
      setHasSearched(false);
      setCurrentPage(1);
      setTotalPages(0);
      setSelectedAgency(null);
    }
    // 수정 모드일 경우 기존 상태 복원
    else if (from === "confirm" && review.detailedAddress) {
      setBuildingName(review.detailedAddress);
      // 기존 리뷰 정보로부터 selectedAgency 복원
      const restoredAgency: AgencyInfo = {
        registerNumber: review.buildingCode || "",
        companyName: review.detailedAddress,
        brokerName: "",
        roadAddress: review.address || "",
        jibunAddress: review.addressDetail || "",
        latitude: review.latitude || 0,
        longitude: review.longitude || 0,
      };
      setSelectedAgency(restoredAgency);
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
      // 첫 번째 요청
      const response = await AgencyAPI.searchAgency({
        agencyName: trimmedName,
        num: 10,
      });

      let allResults = [...(response.items || [])];
      let cursor = response.nextCursor;
      let hasMore = response.hasMore;

      // hasMore가 true인 동안 추가 데이터 가져오기
      while (hasMore && cursor) {
        const nextResponse = await AgencyAPI.searchAgency({
          agencyName: trimmedName,
          num: 10,
          cursor: cursor, // 커서를 사용하여 다음 페이지 요청
        });

        allResults = [...allResults, ...(nextResponse.items || [])];
        cursor = nextResponse.nextCursor;
        hasMore = nextResponse.hasMore;

        // 무한 루프 방지 (최대 100개)
        if (allResults.length >= 100) break;
      }

      if (allResults.length > 0) {
        setSearchResults(allResults);
        // 전체 페이지 수 계산
        setTotalPages(Math.ceil(allResults.length / ITEMS_PER_PAGE));
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

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지 번호 배열 생성 (첨부된 이미지와 같은 형태)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5; // 한 번에 보여줄 최대 페이지 수

    if (totalPages <= maxVisiblePages + 2) {
      // 총 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지를 중심으로 표시
      if (currentPage <= 3) {
        // 시작 부분
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 끝 부분
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 중간 부분
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // 공인중개사 선택 함수 (드롭다운에서 선택 시) - 선택 시 바로 다음 페이지로 이동
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

    // Recoil state 업데이트
    setReview(updatedReview);

    if (from === "confirm") {
      // 수정 모드: 업데이트된 정보와 함께 confirm 페이지로 복귀
      navigate("/review/confirm", {
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
        replace: true, // 히스토리 스택 교체
      });
    } else {
      // 일반 모드: 자동저장에 다음 단계 기록 후 다음 페이지(result)로 이동
      reviewAutoSave.save({
        reviewState: updatedReview,
        dormitoryReviewState: null,
        currentStep: REVIEW_STEPS.ADDRESS_RESULT,
      });

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
    <div
      className="content"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <div
        className={styles.container}
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
        </div>

        {/* 검색 결과 영역 - 스크롤 가능 */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "0.5rem" }}>
          {/* 검색 중 표시 */}
          {isSearching && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "15rem",
                color: "var(--color-gray60)",
                fontSize: "16px",
              }}
            >
              검색 중이에요. 잠시만 기다려주세요!
            </div>
          )}

          {/* 드롭다운 검색 결과 표시 */}
          {!isSearching && hasSearched && searchResults.length > 0 && (
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
                  padding: "16px",
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  textAlign: "center",
                  color: "#666",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  margin: "1rem",
                }}
              >
                <div style={{ marginBottom: "8px" }}>검색 결과가 없습니다.</div>
                <div style={{ fontSize: "13px", color: "#999" }}>
                  '다음' 버튼을 눌러 진행하세요.
                </div>
              </div>
            )}
        </div>
      </div>

      {/* 하단 영역: 페이지네이션 + footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: "393px",
          margin: "0 auto",
          backgroundColor: "var(--white)",
          zIndex: 100,
        }}
      >
        {/* 페이지네이션 - footer 위에 위치 */}
        {hasSearched && searchResults.length > 0 && totalPages > 1 && (
          <AgencyPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* footer - 페이지네이션 아래에 위치 */}
        <div
          style={{
            padding: "0.5rem 1rem 2.75rem",
            display: "flex",
            gap: "0.38rem",
          }}
        >
          <button
            className={styles.prevButton}
            onClick={handleBack}
            style={{ flex: 1 }}
          >
            이전
          </button>
        </div>
      </div>
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
