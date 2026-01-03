import React from "react";
import styles from "./AgencyPagination.module.css";

interface AgencyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AgencyPagination: React.FC<AgencyPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

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

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={styles.paginationContainer}>
      {/* 이전 버튼 */}
      <button
        className={styles.navButton}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        ◀ 이전
      </button>

      {/* 페이지 번호 */}
      {getPageNumbers().map((pageNum, index) => {
        if (pageNum === "...") {
          return (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              · · ·
            </span>
          );
        }

        return (
          <button
            key={pageNum}
            className={`${styles.pageButton} ${
              currentPage === pageNum ? styles.active : ""
            }`}
            onClick={() => onPageChange(pageNum as number)}
          >
            {pageNum}
          </button>
        );
      })}

      {/* 다음 버튼 */}
      <button
        className={styles.navButton}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        다음 ▶
      </button>
    </div>
  );
};

export default AgencyPagination;
