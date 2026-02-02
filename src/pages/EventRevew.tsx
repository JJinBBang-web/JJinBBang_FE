import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EventReview.module.css";
import searchIcon from "../assets/image/iconSearch.svg";
import searchDeleteIcon from "../assets/image/searchDelete.svg";
import giftIcon from "../assets/image/giftIcon.svg";
import Header from "../components/Header";
import "../styles/global.css";
import QuestionInfo from "../components/event/QuestionInfo";
import PriceInput from "../components/event/PriceInput";
import { useRecoilState, useRecoilValue } from "recoil";
import { JjinFilterState } from "../recoil/util/filterRecoilState";
import ProsAndConsInput from "../components/event/ProsAndConsInput";
import type { CategoryTab } from "../components/event/SelectCategory";
import {
  eventReviewFormState,
  eventReviewStep1ValidState,
} from "../recoil/event/eventReviewFormState";
import PhotoUpload from "../components/event/PhotoUpload";

const EventReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const jjinFilters = useRecoilValue(JjinFilterState);

  const [form, setForm] = useRecoilState(eventReviewFormState);
  const isStep1Valid = useRecoilValue(eventReviewStep1ValidState);

  // 주소 검색 페이지로 이동
  const handleAddressSearch = () => {
    navigate("/event/address-search");
  };

  const tabs: CategoryTab[] = jjinFilters.map((c) => ({
    key: c.id,
    label: c.category,
  }));

  const prosOptionsByTab: Record<string, string[]> = jjinFilters.reduce(
    (acc, c) => {
      acc[c.id] = c.positiveFilters.map((f) => f.label);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const consOptionsByTab: Record<string, string[]> = jjinFilters.reduce(
    (acc, c) => {
      acc[c.id] = c.negativeFilters.map((f) => f.label);
      return acc;
    },
    {} as Record<string, string[]>
  );

  // 장점 선택 시 같은 번호의 단점 라벨들을 비활성화
  const prosDisabledLabels = form.cons.map((consLabel) => {
    // cons에서 선택된 label로부터 key를 찾음
    for (const category of jjinFilters) {
      const negFilter = category.negativeFilters.find((f) => f.label === consLabel);
      if (negFilter) {
        // 같은 번호의 positiveFilter를 찾음 (예: NE_BD_LO_01 -> PO_BD_LO_01)
        const number = negFilter.key.slice(-2); // 마지막 2자리
        const posFilter = category.positiveFilters.find((f) => f.key.endsWith(number));
        if (posFilter) return posFilter.label;
      }
    }
    return "";
  }).filter(Boolean);

  // 단점 선택 시 같은 번호의 장점 라벨들을 비활성화
  const consDisabledLabels = form.pros.map((prosLabel) => {
    // pros에서 선택된 label로부터 key를 찾음
    for (const category of jjinFilters) {
      const posFilter = category.positiveFilters.find((f) => f.label === prosLabel);
      if (posFilter) {
        // 같은 번호의 negativeFilter를 찾음 (예: PO_BD_LO_01 -> NE_BD_LO_01)
        const number = posFilter.key.slice(-2); // 마지막 2자리
        const negFilter = category.negativeFilters.find((f) => f.key.endsWith(number));
        if (negFilter) return negFilter.label;
      }
    }
    return "";
  }).filter(Boolean);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    if (!isStep1Valid) return;
    navigate("/event/review/write/step2");
  };

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <Header type="close" onClick={handleBack} />
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>
        <div className={styles.optionContainer}>
          {/* 대학교 선택 필드 */}
          <div className={styles.section}>
            <QuestionInfo
              title="어느 대학교에 재학중이신가요?"
              description="재학 중인 대학교를 입력해주세요"
              isRequired={true}
            />
            <div className={styles.addressSearchInput}>
              <input
                type="text"
                placeholder="대학교 입력"
                className={styles.inputField}
                value={form.university}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, university: e.target.value }))}
              />
              {form.university && (
                <img
                  src={searchDeleteIcon}
                  alt="삭제 아이콘"
                  className={styles.icon}
                  onClick={() => setForm((p) => ({ ...p, university: "" }))}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          </div>
          <hr className={styles.divider} />
          {/* 주소 검색 필드 */}
          <div className={styles.section}>
            <QuestionInfo
              title="어디에 살고 계신가요?"
              description="자취방 주소를 입력해주세요"
              isRequired={true}
            />
            <div
              className={styles.addressSearchInput}
              onClick={handleAddressSearch}
              style={{ cursor: "pointer" }}
            >
              <img src={searchIcon} alt="검색 아이콘" className={styles.icon} />
              {form.address.keyword ? (
                <span className={styles.addressText}>{form.address.keyword}</span>
              ) : (
                <span className={styles.addressPlaceholder}>주소 입력</span>
              )}
              {form.address.keyword && (
                <img
                  src={searchDeleteIcon}
                  alt="삭제 아이콘"
                  className={styles.icon}
                  onClick={(e) => {
                    e.stopPropagation();
                    setForm((p) => ({
                      ...p,
                      address: { keyword: "" },
                    }));
                  }}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          </div>
          <hr className={styles.divider} />
          <div className={styles.section}>
            <QuestionInfo title="찐빵이는 가격이 궁금해요!" isRequired={true} />
            <PriceInput
              value={form.price}
              onChange={(next) => setForm((prev) => ({ ...prev, price: next }))}
            />
          </div>
          <hr className={styles.divider} />
          <div className={styles.section}>
            <QuestionInfo
              title="우리 집의 장점"
              description="살면서 좋았던 점을 선택해주세요 (최소 3개)"
              isRequired={true}
            />
            <ProsAndConsInput
              tabs={tabs}
              optionsByTab={prosOptionsByTab}
              selected={form.pros}
              onChangeSelected={(next) =>
                setForm((p) => ({ ...p, pros: next }))
              }
              minSelect={3}
              maxSelect={5}
              disabledOptions={prosDisabledLabels}
              oppositeType="단점"
            />
          </div>
          <hr className={styles.divider} />
          <div className={styles.section}>
            <QuestionInfo
              title="우리 집의 단점"
              description="아쉬웠던 점도 솔직하게! (최소 3개)"
              isRequired={true}
            />
            <ProsAndConsInput
              tabs={tabs}
              optionsByTab={consOptionsByTab}
              selected={form.cons}
              onChangeSelected={(next) =>
                setForm((p) => ({ ...p, cons: next }))
              }
              minSelect={3}
              maxSelect={5}
              disabledOptions={consDisabledLabels}
              oppositeType="장점"
            />
          </div>
          <hr className={styles.divider} />
          <div className={styles.section}>
            <QuestionInfo title="방 사진 인증" isRequired={false} />
            <PhotoUpload
              photos={form.photos}
              onChange={(next) => setForm((p) => ({ ...p, photos: next }))}
              maxPhotos={3}
            />
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.textContainer}>
          <p className={styles.reviewText}>
            첫 리뷰 작성 시 100% 기프티콘 증정!
          </p>{" "}
          <img src={giftIcon} alt="기프티콘" className={styles.giftIcon} />
        </div>
        <button
          className={`${styles.confirmButton} ${isStep1Valid ? styles.active : ""}`}
          disabled={!isStep1Valid}
          onClick={handleNext}
        >
          리뷰 등록하기
        </button>
      </footer>

    </div>
  );
};

export default EventReviewPage;
