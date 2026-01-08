import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EventReview.module.css";
import searchIcon from "../assets/image/iconSearch.svg";
import searchDeleteIcon from "../assets/image/searchDelete.svg";
import giftIcon from "../assets/image/giftIcon.svg";
import Header from "../components/Header";
import "../styles/global.css";
import QuestionInfo from "../components/event/QuestionInfo";
import PriceInput, { PriceValue } from "../components/event/PriceInput";
import { useRecoilState, useRecoilValue } from "recoil";
import { JjinFilterState } from "../recoil/util/filterRecoilState";
import ProsAndConsInput from "../components/event/ProsAndConsInput";
import type { CategoryTab } from "../components/event/SelectCategory";
import {
  eventReviewFormState,
  eventReviewFormValidState,
} from "../recoil/event/eventReviewFormState";
import PhotoUpload from "../components/event/PhotoUpload";
import ReviewTextInput from "../components/event/ReviewTextInput";
import EventParticipationInfo from "../components/event/EventParticipationInfo";

const EventReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const jjinFilters = useRecoilValue(JjinFilterState);

  const [form, setForm] = useRecoilState(eventReviewFormState);
  const isValid = useRecoilValue(eventReviewFormValidState);

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
          <div className={styles.section}>
            <QuestionInfo
              title="어디에 살고 계신가요?"
              description="재학 중인 학교와 자취방 주소를 입력해주세요."
              isRequired={true}
            />
            <div className={styles.addressSearchInput}>
              <img src={searchIcon} alt="검색 아이콘" className={styles.icon} />
              <input
                type="text"
                placeholder="주소 검색"
                className={styles.inputField}
                value={form.address.keyword}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    address: { ...p.address, keyword: e.target.value },
                  }))
                }
              />
              {form.address.keyword && (
                <img
                  src={searchDeleteIcon}
                  alt="삭제 아이콘"
                  className={styles.icon}
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      address: { keyword: "" },
                    }))
                  }
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
          <hr className={styles.divider} />
          <div className={styles.section}>
            <QuestionInfo title="찐 후기 작성" isRequired={true} />
            <ReviewTextInput
              value={form.reviewText}
              onChange={(next) => setForm((p) => ({ ...p, reviewText: next }))}
              minLength={20}
              maxLength={1000}
            />
          </div>
          <hr className={styles.divider} />
          <div className={styles.section}>
            <QuestionInfo title="이벤트 참여 정보" isRequired={true} />
            <EventParticipationInfo
              phone={form.phone}
              onPhoneChange={(next) => setForm((p) => ({ ...p, phone: next }))}
              agreeMarketing={form.agreeMarketing}
              onAgreeMarketingChange={(next) =>
                setForm((p) => ({ ...p, agreeMarketing: next }))
              }
              agreePrivacy={form.agreePrivacy}
              onAgreePrivacyChange={(next) =>
                setForm((p) => ({ ...p, agreePrivacy: next }))
              }
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
          className={`${styles.confirmButton} ${isValid ? styles.active : ""}`}
          disabled={!isValid}
        >
          리뷰 등록하기
        </button>
      </footer>
    </div>
  );
};

export default EventReviewPage;
