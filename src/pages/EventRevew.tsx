import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import styles from "./EventReview.module.css";
import searchIcon from '../assets/image/iconSearch.svg';
import searchDeleteIcon from "../assets/image/searchDelete.svg";
import Header from "../components/Header";
import '../styles/global.css';
import QuestionInfo from "../components/event/QuestionInfo";
import PriceInput, { PriceValue } from "../components/event/PriceInput";
import { useRecoilState, useRecoilValue } from "recoil";
import { JjinFilterState } from "../recoil/util/filterRecoilState";
import ProsAndConsInput from "../components/event/ProsAndConsInput";
import type { CategoryTab } from "../components/event/SelectCategory";
import { eventReviewFormState, eventReviewFormValidState } from "../recoil/event/eventReviewFormState";



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

    const handleBack = () => {
      navigate(-1);
    };

    return (
    <div className={styles.content}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
            <Header type="close" onClick={handleBack}/>
            <div className={styles.progressBar}>
                <div className={styles.progressFill}></div>
            </div>
        </div>
        <div className={styles.optionContainer}>
          <div className={styles.section}>
            <QuestionInfo title="어디에 살고 계신가요?" description="재학 중인 학교와 자취방 주소를 입력해주세요." isRequired={true} />
            <div className={styles.addressSearchInput}>
              <img src={searchIcon} alt="검색 아이콘" className={styles.icon} />
              <input type="text" placeholder="주소 검색" className={styles.inputField} />
              <img src={searchDeleteIcon} alt="삭제 아이콘" className={styles.icon} />
            </div>
          </div>
          <hr className={styles.divider} /> 
          <div className={styles.section}>
            <QuestionInfo title="찐빵이는 가격이 궁금해요!" isRequired={true} />
            <PriceInput value={form.price} onChange={(next) => setForm((prev) => ({ ...prev, price: next }))} />
          </div>
          <hr className={styles.divider} /> 
          <div className={styles.section}>
            <QuestionInfo title="우리 집의 장점" description="살면서 좋았던 점을 선택해주세요 (최소 3개)" isRequired={true} />
            <ProsAndConsInput
              tabs={tabs}
              optionsByTab={prosOptionsByTab}
              selected={form.pros}
              onChangeSelected={(next) => setForm((p) => ({ ...p, pros: next }))}
              minSelect={3}
              maxSelect={5}
            />
          </div>
          <hr className={styles.divider} /> 
          <div className={styles.section}>
            <QuestionInfo title="우리 집의 단점" description="아쉬웠던 점도 솔직하게! (최소 3개)" isRequired={true} />
            <ProsAndConsInput
              tabs={tabs}
              optionsByTab={consOptionsByTab}
              selected={form.cons}
              onChangeSelected={(next) => setForm((p) => ({ ...p, cons: next }))}
              minSelect={3}
              maxSelect={5}
            />
          </div>
          <hr className={styles.divider} /> 
          <div className={styles.section}>
            <QuestionInfo title="방 사진 인증" description="실제 거주했던 방 사진을 올려주세요 (최대 3장)" isRequired={false} />
          </div>
          <hr className={styles.divider} /> 
          <div className={styles.section}>
            <QuestionInfo title="찐 후기 작성" isRequired={true} />
          </div>
          <hr className={styles.divider} /> 
          <div className={styles.section}>
            <QuestionInfo title="이벤트 참여 정보" description="휴대폰 번호를 남겨주세요" isRequired={true} />
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.textContainer}>
            <p className={styles.reviewText}>첫 리뷰 작성 시 100% 기프티콘 증정!</p>
            {/* 선물 이미지 넣기 */}
        </div>
        <button
          className={styles.confirmButton}
          disabled={!isValid}
        >
          리뷰 등록하기
        </button>
      </footer>
    </div>
  );
};

export default EventReviewPage;

