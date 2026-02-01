// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useRecoilState } from "recoil";
// import { reviewState } from "../../recoil/review/reviewAtoms";
// import { AgencyAPI } from "../../api/agency/AgencyAPI";
// import { AgencyInfo } from "../../types/entity/agency/AgencyInterface";
// import CancelModal from "../../components/review/CancelModal";
// import AgencyPagination from "../../components/review/AgencyPagination";
// import { useCancelModal } from "../../util/useCancelModal";
// import { reviewAutoSave, REVIEW_STEPS } from "../../util/reviewAutoSave";
// import styles from "../../styles/review/FloorInput.module.css";
// import closeIcon from "../../assets/image/iconClose.svg";
// import useReviewStepTracking from "../../hooks/useReviewStepTracking";
// import Lottie from "lottie-react";
// import loadingAnimation from "../../assets/lottie/loading.json";
// import bigSearchIcon from "../../assets/image/bigSearchIcon.svg";

// interface LocationState {
//   address: {
//     roadAddress: string;
//     jibunAddress: string;
//     buildingName: string;
//   };
//   from?: string;
// }

// const AgencyInputPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [review, setReview] = useRecoilState(reviewState);
//   const { address, from } = (location.state as LocationState) || {};

//   const [buildingName, setBuildingName] = useState(
//     review.detailedAddress || address?.buildingName || ""
//   );
//   const [searchResults, setSearchResults] = useState<AgencyInfo[]>([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [hasSearched, setHasSearched] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [selectedAgency, setSelectedAgency] = useState<AgencyInfo | null>(null);

//   const ITEMS_PER_PAGE = 5;

//   useReviewStepTracking('3-3_agency_input');

//   const {
//     showCancelModal,
//     handleCloseButtonClick,
//     handleCancelModalClose,
//     handleConfirmCancel,
//   } = useCancelModal();

//   useEffect(() => {
//     // result 페이지에서 돌아온 경우 입력 필드 초기화
//     if (from === "result") {
//       setBuildingName("");
//       setSearchResults([]);
//       setHasSearched(false);
//       setCurrentPage(1);
//       setTotalPages(0);
//       setSelectedAgency(null);
//     }
//     // 수정 모드일 경우 기존 상태 복원
//     else if (from === "confirm" && review.detailedAddress) {
//       setBuildingName(review.detailedAddress);
//       // 기존 리뷰 정보로부터 selectedAgency 복원
//       const restoredAgency: AgencyInfo = {
//         registerNumber: review.buildingCode || "",
//         companyName: review.detailedAddress,
//         brokerName: "",
//         roadAddress: review.address || "",
//         jibunAddress: review.addressDetail || "",
//         latitude: review.latitude || 0,
//         longitude: review.longitude || 0,
//       };
//       setSelectedAgency(restoredAgency);
//     }
//   }, [from, review]);

//   // Debounce를 위한 타이머 - 최소 2글자 이상일 때만 검색
//   useEffect(() => {
//     const trimmedName = buildingName.trim();

//     if (trimmedName.length >= 2) {
//       const timer = setTimeout(() => {
//         setCurrentPage(1); // 검색 시 첫 페이지로 리셋
//         handleSearch();
//       }, 800); // 800ms 후에 검색 (입력이 끝날 때까지 대기)

//       return () => clearTimeout(timer);
//     } else {
//       setSearchResults([]);
//       setHasSearched(false);
//       setCurrentPage(1);
//       setTotalPages(0);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [buildingName]);

//   // 공인중개사 검색 함수
//   const handleSearch = async () => {
//     const trimmedName = buildingName.trim();

//     if (!trimmedName || trimmedName.length < 2) {
//       return;
//     }

//     setIsSearching(true);
//     setHasSearched(true);

//     try {
//       // 첫 번째 요청
//       const response = await AgencyAPI.searchAgency({
//         agencyName: trimmedName,
//         num: 10,
//       });

//       let allResults = [...(response.items || [])];
//       let cursor = response.nextCursor;
//       let hasMore = response.hasMore;

//       // hasMore가 true인 동안 추가 데이터 가져오기
//       while (hasMore && cursor) {
//         const nextResponse = await AgencyAPI.searchAgency({
//           agencyName: trimmedName,
//           num: 10,
//           cursor: cursor, // 커서를 사용하여 다음 페이지 요청
//         });

//         allResults = [...allResults, ...(nextResponse.items || [])];
//         cursor = nextResponse.nextCursor;
//         hasMore = nextResponse.hasMore;

//         // 무한 루프 방지 (최대 100개)
//         if (allResults.length >= 100) break;
//       }

//       if (allResults.length > 0) {
//         setSearchResults(allResults);
//         // 전체 페이지 수 계산
//         setTotalPages(Math.ceil(allResults.length / ITEMS_PER_PAGE));
//       } else {
//         setSearchResults([]);
//         setTotalPages(0);
//       }
//     } catch (error) {
//       console.error("공인중개사 조회 실패:", error);
//       // 개발 환경에서 API가 없을 수 있으므로 조용히 처리
//       setSearchResults([]);
//       setHasSearched(false);
//       setTotalPages(0);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   // 현재 페이지에 표시할 데이터 계산
//   const getCurrentPageData = () => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE;
//     return searchResults.slice(startIndex, endIndex);
//   };

//   // 페이지 변경 핸들러
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   // 페이지 번호 배열 생성 (첨부된 이미지와 같은 형태)
//   const getPageNumbers = () => {
//     const pages: (number | string)[] = [];
//     const maxVisiblePages = 5; // 한 번에 보여줄 최대 페이지 수

//     if (totalPages <= maxVisiblePages + 2) {
//       // 총 페이지가 적으면 모두 표시
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       // 현재 페이지를 중심으로 표시
//       if (currentPage <= 3) {
//         // 시작 부분
//         for (let i = 1; i <= 5; i++) {
//           pages.push(i);
//         }
//         pages.push("...");
//         pages.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         // 끝 부분
//         pages.push(1);
//         pages.push("...");
//         for (let i = totalPages - 4; i <= totalPages; i++) {
//           pages.push(i);
//         }
//       } else {
//         // 중간 부분
//         pages.push(1);
//         pages.push("...");
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//           pages.push(i);
//         }
//         pages.push("...");
//         pages.push(totalPages);
//       }
//     }
//     return pages;
//   };

//   // 공인중개사 선택 함수 (드롭다운에서 선택 시) - 선택 시 바로 다음 페이지로 이동
//   const handleSelectAgency = (agency: AgencyInfo) => {
//     const updatedReview = {
//       ...review,
//       detailedAddress: agency.companyName, // 상호명
//       address: agency.roadAddress,
//       addressDetail: agency.jibunAddress,
//       buildingCode: agency.registerNumber, // 개설등록번호를 buildingCode로 사용
//       latitude: agency.latitude,
//       longitude: agency.longitude,
//     };

//     // Recoil state 업데이트
//     setReview(updatedReview);

//     if (from === "confirm") {
//       // 수정 모드: 업데이트된 정보와 함께 confirm 페이지로 복귀
//       navigate("/review/confirm", {
//         state: {
//           ...location.state,
//           buildingName: agency.companyName,
//           address: {
//             roadAddress: agency.roadAddress,
//             jibunAddress: agency.jibunAddress,
//             buildingName: agency.companyName,
//             buildingCode: agency.registerNumber,
//           },
//         },
//         replace: true, // 히스토리 스택 교체
//       });
//     } else {
//       // 일반 모드: 자동저장에 다음 단계 기록 후 다음 페이지(result)로 이동
//       reviewAutoSave.save({
//         reviewState: updatedReview,
//         dormitoryReviewState: null,
//         currentStep: REVIEW_STEPS.ADDRESS_RESULT,
//         uuid: reviewAutoSave.load()?.uuid
//       });

//       navigate("/review/result", {
//         state: {
//           ...location.state,
//           buildingName: agency.companyName,
//           address: {
//             roadAddress: agency.roadAddress,
//             jibunAddress: agency.jibunAddress,
//             buildingName: agency.companyName,
//             buildingCode: agency.registerNumber,
//           },
//         },
//       });
//     }
//   };

//   const handleBack = () => {
//     if (from === "confirm") {
//       navigate("/review/confirm", {
//         state: {
//           ...location.state,
//         },
//       });
//     } else {
//       // 공인중개사 리뷰 플로우: 유형 선택 페이지로 이동
//       navigate("/review/type", {
//         state: {
//           ...location.state,
//         },
//       });
//     }
//   };

//   const isSearchEnabled = buildingName.trim() !== "";

//   return (
//     <div
//       className="content"
//       style={{ display: "flex", flexDirection: "column", height: "100vh" }}
//     >
//       <div
//         className={styles.container}
//         style={{
//           flex: 1,
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <header className={styles.header}>
//           <div className={styles.progressBar}>
//             <div className={styles.progressFill}></div>
//           </div>
//           <button
//             className={styles.closeButton}
//             onClick={handleCloseButtonClick}
//           >
//             <img src={closeIcon} alt="close" />
//           </button>
//           <h1>공인중개사의 상호명을 입력해 주세요!</h1>
//         </header>
//         <div className={styles.inputSection}>
//           <label className={styles.label}>상호명</label>
//           <input
//             type="text"
//             className={styles.buildingInput}
//             value={buildingName}
//             onChange={(e) => setBuildingName(e.target.value)}
//             placeholder="예) 찐빵중개사"
//             onKeyPress={(e) => {
//               if (e.key === "Enter" && isSearchEnabled) {
//                 handleSearch();
//               }
//             }}
//           />
//         </div>

//         {/* 검색 결과 영역 - 스크롤 가능 */}
//         <div style={{ flex: 1, overflowY: "auto", paddingBottom: "10rem" }}>
//           {/* 검색 중 표시 */}
//           {isSearching && (
//             <div
//                 style={{
//                   padding: "6.5rem 0",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexDirection:"column",
//                   gap: "32px",
//                 }}
//               >
//                 <div className={styles.lottiesImg}>
//                   <Lottie
//                     animationData={loadingAnimation}
//                     loop
//                     autoplay
//                     style={{ width:70 }}
//                 />
//                 <img src={bigSearchIcon} className={styles.bigSearchIcon}/>
//                 </div>
//                 <p className={styles.loadingText}>검색중이에요<br/>잠시만 기다려주세요!</p>
//               </div>
//           )}

//           {/* 드롭다운 검색 결과 표시 */}
//           {!isSearching && hasSearched && searchResults.length > 0 && (
//             <div>
//               {getCurrentPageData().map((agency, index) => (
//                 <div
//                   key={`${agency.registerNumber}-${index}`}
//                   onClick={() => handleSelectAgency(agency)}
//                   style={{
//                     padding: "16px",
//                     borderBottom:
//                       index < getCurrentPageData().length - 1
//                         ? "1px solid #f0f0f0"
//                         : "none",
//                     cursor: "pointer",
//                     transition: "background-color 0.2s",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = "#f5f5f5";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = "white";
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontWeight: "600",
//                       marginBottom: "6px",
//                       fontSize: "16px",
//                       color: "#333",
//                     }}
//                   >
//                     {agency.companyName}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "16px",
//                       color: "#888",
//                       marginBottom: "4px",
//                     }}
//                   >
//                     {agency.roadAddress}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* 검색 결과 없음 안내 */}
//           {hasSearched &&
//             !isSearching &&
//             searchResults.length === 0 &&
//             buildingName.trim().length >= 2 && (
//               <div
//                 style={{
//                   padding: "16px",
//                   backgroundColor: "white",
//                   border: "1px solid #e0e0e0",
//                   borderRadius: "8px",
//                   textAlign: "center",
//                   color: "#666",
//                   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                   margin: "1rem",
//                 }}
//               >
//                 <div style={{ marginBottom: "8px" }}>검색 결과가 없습니다.</div>
//                 <div style={{ fontSize: "13px", color: "#999" }}>
//                   '다음' 버튼을 눌러 진행하세요.
//                 </div>
//               </div>
//             )}
//         </div>
//       </div>

//       {/* 하단 영역: 페이지네이션 + footer */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           maxWidth: "393px",
//           margin: "0 auto",
//           backgroundColor: "var(--white)",
//           zIndex: 100,
//         }}
//       >
//         {/* 페이지네이션 - footer 위에 위치 */}
//         {hasSearched && searchResults.length > 0 && totalPages > 1 && (
//           <AgencyPagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         )}

//         {/* footer - 페이지네이션 아래에 위치 */}
//         <div
//           style={{
//             padding: "0.5rem 1rem 2.75rem",
//             display: "flex",
//             gap: "0.38rem",
//           }}
//         >
//           <button
//             className={styles.prevButton}
//             onClick={handleBack}
//             style={{ flex: 1 }}
//           >
//             이전
//           </button>
//         </div>
//       </div>
//       {showCancelModal && (
//         <CancelModal
//           onClose={handleCancelModalClose}
//           onConfirm={handleConfirmCancel}
//         />
//       )}
//     </div>
//   );
// };

// export default AgencyInputPage;


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

    if (trimmedName.length >= 2) {
      const timer = setTimeout(() => {
        startSearch(trimmedName);
      }, 800);

      return () => clearTimeout(timer);
    } else {
      // 2글자 미만이면 초기화
      setSearchResults([]);
      setHasSearched(false);
      setCursor(null);
      setHasMore(false);
      setActiveKeyword("");
      setErrorMsg(null);
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
