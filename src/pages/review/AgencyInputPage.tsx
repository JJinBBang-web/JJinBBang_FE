import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { reviewState } from "../../recoil/review/reviewAtoms";
import { AgencyAPI } from "../../api/agency/AgencyAPI";
import { AgencyInfo } from "../../types/entity/agency/AgencyInterface";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import { reviewAutoSave, REVIEW_STEPS } from "../../util/reviewAutoSave";
import styles from "../../styles/review/FloorInput.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import useReviewStepTracking from "../../hooks/useReviewStepTracking";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lottie/loading.json";
import bigSearchIcon from "../../assets/image/bigSearchIcon.svg";

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

  const [selectedAgency, setSelectedAgency] = useState<AgencyInfo | null>(null);

  // 결과 리스트(누적)
  const [searchResults, setSearchResults] = useState<AgencyInfo[]>([]);

  // 검색 상태
  const [isSearching, setIsSearching] = useState(false); // 첫 검색 로딩
  const [isFetchingMore, setIsFetchingMore] = useState(false); // 추가 로딩
  const [hasSearched, setHasSearched] = useState(false);

  // 커서 기반 무한 스크롤 상태
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // 에러 메시지(선택)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 현재 활성 검색어(디바운스 후 확정된 키워드)
  const [activeKeyword, setActiveKeyword] = useState("");

  // 내부 스크롤 root & sentinel
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const debounceTimerRef = useRef<number | null>(null);


  useReviewStepTracking("3-3_agency_input");

  const nextEnabled = useMemo(() => !!selectedAgency, [selectedAgency]);

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // 페이지 진입/복귀 처리
  useEffect(() => {
    // result 페이지에서 돌아온 경우 입력 필드 초기화
    if (from === "result") {
      setBuildingName("");
      setSearchResults([]);
      setHasSearched(false);
      setCursor(null);
      setHasMore(false);
      setActiveKeyword("");
      setErrorMsg(null);
    }
    // 수정 모드일 경우 기존 상태 복원
    else if (from === "confirm" && review.detailedAddress) {
      setBuildingName(review.detailedAddress);

      // 기존 리뷰 정보로부터 selectedAgency를 굳이 state로 들고 있을 필요가 없어서 제거했지만,
      // 기존 데이터가 입력창에 반영되도록 buildingName만 복원해도 UX는 동일함.
      setHasSearched(true);
      setSearchResults([
        {
          registerNumber: review.buildingCode || "",
          companyName: review.detailedAddress,
          brokerName: "",
          roadAddress: review.address || "",
          jibunAddress: review.addressDetail || "",
          latitude: review.latitude || 0,
          longitude: review.longitude || 0,
        },
      ]);
      setCursor(null);
      setHasMore(false);
      setActiveKeyword(review.detailedAddress);
      setErrorMsg(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from]);

  const isSearchEnabled = useMemo(() => buildingName.trim() !== "", [buildingName]);

  // 새 검색 시작(첫 페이지)
  const startSearch = async (keyword: string) => {
    const trimmed = keyword.trim();
    if (trimmed.length < 2) return;

    // 같은 키워드로 이미 검색한 상태면 굳이 다시 시작하지 않음(원하면 제거 가능)
    if (trimmed === activeKeyword && hasSearched) return;

    setIsSearching(true);
    setHasSearched(true);
    setErrorMsg(null);

    // 검색 시작 시 초기화
    setSearchResults([]);
    setCursor(null);
    setHasMore(false);
    setActiveKeyword(trimmed);

    try {
      const res = await AgencyAPI.searchAgency({
        agencyName: trimmed,
        num: 10,
        cursor: undefined,
      });

      setSearchResults(res.items || []);
      setCursor(res.nextCursor ?? null);
      setHasMore(!!res.hasMore);
    } catch (e) {
      console.error("공인중개사 조회 실패:", e);
      setSearchResults([]);
      setHasSearched(false);
      setCursor(null);
      setHasMore(false);
      setErrorMsg("검색에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSearching(false);
    }
  };

  // 다음 페이지 추가 로딩
  const fetchMore = async () => {
    if (!hasMore) return;
    if (!cursor) return;
    if (isSearching || isFetchingMore) return;
    if (activeKeyword.trim().length < 2) return;

    setIsFetchingMore(true);
    setErrorMsg(null);

    try {
      const res = await AgencyAPI.searchAgency({
        agencyName: activeKeyword,
        num: 10,
        cursor,
      });

      const newItems = res.items || [];

      // registerNumber 기준 dedupe (서버가 중복 반환할 가능성 대비)
      setSearchResults((prev) => {
        const map = new Map(prev.map((x) => [x.registerNumber, x]));
        for (const item of newItems) {
          map.set(item.registerNumber, item);
        }
        return Array.from(map.values());
      });

      setCursor(res.nextCursor ?? null);
      setHasMore(!!res.hasMore);
    } catch (e) {
      console.error("추가 조회 실패:", e);
      setErrorMsg("추가 로딩에 실패했어요. 아래로 다시 스크롤하면 재시도돼요.");
    } finally {
      setIsFetchingMore(false);
    }
  };

  // 입력 디바운스: 2글자 이상이면 800ms 후 새 검색 시작
  useEffect(() => {
    const trimmedName = buildingName.trim();

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (trimmedName.length >= 2) {
      debounceTimerRef.current = window.setTimeout(() => {
        startSearch(trimmedName);
        debounceTimerRef.current = null;
      }, 800);

      return () => {
        if (debounceTimerRef.current) {
          window.clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
      };
    } else {
      setSearchResults([]);
      setHasSearched(false);
      setCursor(null);
      setHasMore(false);
      setActiveKeyword("");
      setErrorMsg(null);
      setSelectedAgency(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingName]);


  // 무한 스크롤: 내부 스크롤 컨테이너 기준으로 sentinel 감지
  useEffect(() => {
    const rootEl = scrollRootRef.current;
    const target = loadMoreRef.current;
    if (!rootEl || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          fetchMore();
        }
      },
      {
        root: rootEl,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasMore, isSearching, isFetchingMore, activeKeyword]);

  // 공인중개사 선택 -> 다음 페이지로 이동
  const handleSelectAgency = (agency: AgencyInfo) => {
    setSelectedAgency(agency);

    const updatedReview = {
      ...review,
      detailedAddress: agency.companyName,
      address: agency.roadAddress,
      addressDetail: agency.jibunAddress,
      buildingCode: agency.registerNumber,
      latitude: agency.latitude,
      longitude: agency.longitude,
    };

    setReview(updatedReview);
  };

  const handleNext = () => {
    if (!selectedAgency) return;

    const agency = selectedAgency;

    if (from === "confirm") {
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
        replace: true,
      });
    } else {
      // 일반 모드: 자동저장 + result 이동
      reviewAutoSave.save({
        reviewState: {
          ...review,
          detailedAddress: agency.companyName,
          address: agency.roadAddress,
          addressDetail: agency.jibunAddress,
          buildingCode: agency.registerNumber,
          latitude: agency.latitude,
          longitude: agency.longitude,
        },
        dormitoryReviewState: null,
        currentStep: REVIEW_STEPS.ADDRESS_RESULT,
        uuid: reviewAutoSave.load()?.uuid,
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
      navigate("/review/type", {
        state: {
          ...location.state,
        },
      });
    }
  };

  const handleToQnA = () => {
    // navigate("/review/confirm");
    console.log("문의이동");
  };

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
          <button className={styles.closeButton} onClick={handleCloseButtonClick}>
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && isSearchEnabled) {
                if (debounceTimerRef.current) {
                  window.clearTimeout(debounceTimerRef.current);
                  debounceTimerRef.current = null;
                }
                startSearch(buildingName);
              }
            }}
          />
        </div>

        {/* 검색 결과 영역 - 내부 스크롤 */}
        <div
          ref={scrollRootRef}
          style={{ flex: 1, overflowY: "auto", paddingBottom: "7rem" }}
        >
          {/* 검색 중 표시(첫 페이지 로딩) */}
          {isSearching && (
            <div
              style={{
                padding: "6.5rem 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              <div className={styles.lottiesImg}>
                <Lottie
                  animationData={loadingAnimation}
                  loop
                  autoplay
                  style={{ width: 70 }}
                />
                <img src={bigSearchIcon} className={styles.bigSearchIcon} alt="" />
              </div>
              <p className={styles.loadingText}>
                검색중이에요
                <br />
                잠시만 기다려주세요!
              </p>
            </div>
          )}

          {/* 결과 리스트 */}
          {!isSearching && hasSearched && searchResults.length > 0 && (
            <div>
              {searchResults.map((agency, index) => {
                const isSelected = selectedAgency?.registerNumber === agency.registerNumber;

                return (
                <div
                  key={`${agency.registerNumber}-${index}`}
                  onClick={() => handleSelectAgency(agency)}
                  style={{
                    padding: "16px",
                    borderBottom:
                      index < searchResults.length - 1 ? "1px solid #f0f0f0" : "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--block-unactive-btn)";
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
                      color: "var(--black)",
                    }}
                  >
                    {agency.companyName}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "var(--color-gray60)",
                      marginBottom: "4px",
                    }}
                  >
                    {agency.roadAddress}
                  </div>
                </div>
                );
              })}

              {/* 추가 로딩 */}
              {isFetchingMore && (
                <div style={{ padding: "24px", textAlign: "center", color: "#999" }}>
                  더 불러오는 중...
                </div>
              )}
              {/* sentinel */}
              <div ref={loadMoreRef} style={{ height: 1 }} />
            </div>
          )}

          {/* 검색 결과 없음 */}
          {hasSearched &&
            !isSearching &&
            searchResults.length === 0 &&
            buildingName.trim().length >= 2 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent:"center",
                  gap:"30px",
                  marginTop: "6.5rem",
                }}
              >
                <div style={{textAlign:'center',}}>
                  <p style={{fontSize:"16px", color: "var(--color-gray80)", fontWeight:"400"}}>검색 결과가 없습니다</p>
                  <p style={{fontSize:"16px", color: "var(--color-gray40)", fontWeight:"400"}}>원하시는 공인중개사를 직접 문의해 보세요</p>
                </div>
                <button style={{border:"none", borderRadius: "13px", padding: "12px 16px", backgroundColor:"var(--primary-color)",fontSize:"16px", color: "var(--white)", fontWeight:"400"}}
                        onClick={handleToQnA}>
                  공인중개사 문의하기
                </button>
              </div>
            )}

          {/* 에러 메시지 */}
          {errorMsg && (
            <div style={{ padding: "16px", textAlign: "center", color: "#d00" }}>
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* 하단 footer */}
      <div className={styles.buttonContainer}>
            <button className={styles.prevButton} onClick={handleBack}>
                이전
            </button>
            <button
                className={`${styles.nextButton} ${nextEnabled ? styles.enabled : ""}`}
                onClick={handleNext}
                disabled={!nextEnabled}
            >
                다음
            </button>
        </div>

      {showCancelModal && (
        <CancelModal onClose={handleCancelModalClose} onConfirm={handleConfirmCancel} />
      )}
    </div>
  );
};

export default AgencyInputPage;
