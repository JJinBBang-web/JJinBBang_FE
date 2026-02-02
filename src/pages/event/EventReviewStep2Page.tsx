import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../EventReview.module.css";
import giftIcon from "../../assets/image/giftIcon.svg";
import Header from "../../components/Header";
import "../../styles/global.css";
import QuestionInfo from "../../components/event/QuestionInfo";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  eventReviewFormState,
  eventReviewStep2ValidState,
} from "../../recoil/event/eventReviewFormState";
import ReviewTextInput from "../../components/event/ReviewTextInput";
import EventParticipationInfo from "../../components/event/EventParticipationInfo";
import { eventReviewAPI, EventReviewRequest } from "../../api/event/EventReviewAPI";
import { imageUploadAPI } from "../../api/imageUpload";

const EventReviewStep2Page: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useRecoilState(eventReviewFormState);
  const isStep2Valid = useRecoilValue(eventReviewStep2ValidState);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!isStep2Valid || form.ui.isSubmitting) return;

    setForm((prev) => ({
      ...prev,
      ui: { isSubmitting: true, submitError: undefined },
    }));

    try {
      // 1. 이미지 업로드 (blob URL -> CDN URL)
      let imageUrls: string[] = [];
      if (form.photos.length > 0) {
        imageUrls = await imageUploadAPI.uploadBlobUrls(form.photos, "review");
      }

      // 2. API 요청 데이터 구성
      const request: EventReviewRequest = {
        review: {
          university: form.university,
          contractType: form.price.rentType === "MONTHLY" ? "월세" : "전세",
          deposit: parseInt(form.price.deposit, 10) || 0,
          monthlyRent: parseInt(form.price.monthlyRent, 10) || 0,
          administrationCost: parseInt(form.price.maintenanceFee, 10) || 0,
          positiveKeywords: form.pros,
          negativeKeywords: form.cons,
          images: imageUrls,
          content: form.reviewText,
          address: form.address.roadAddress || form.address.keyword,
        },
        phoneNumber: form.phone,
        hasAgreedToMarketing: form.agreeMarketing,
        hasAgreedToPrivacy: form.agreePrivacy,
      };

      // 3. API 호출
      await eventReviewAPI.submitReview(request);

      // 4. 성공 시 처리
      alert("리뷰가 성공적으로 등록되었습니다!");
      navigate("/");
    } catch (error: any) {
      console.error("리뷰 등록 실패:", error);
      setForm((prev) => ({
        ...prev,
        ui: {
          isSubmitting: false,
          submitError: error?.message || "리뷰 등록에 실패했습니다.",
        },
      }));
      alert("리뷰 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <Header type="back" onClick={handleBack} />
          <div className={styles.progressBar}>
            <div className={styles.progressFillFull}></div>
          </div>
        </div>
        <div className={styles.optionContainer}>
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
          className={`${styles.confirmButton} ${isStep2Valid ? styles.active : ""}`}
          disabled={!isStep2Valid || form.ui.isSubmitting}
          onClick={handleSubmit}
        >
          {form.ui.isSubmitting ? "등록 중..." : "리뷰 등록하기"}
        </button>
      </footer>
    </div>
  );
};

export default EventReviewStep2Page;
