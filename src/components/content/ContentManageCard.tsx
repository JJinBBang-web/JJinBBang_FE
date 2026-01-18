import React, { useState } from "react";
import styles from "./ContentManageCard.module.css";
import { useNavigate, useParams } from "react-router-dom";
import heartIcon from '../../assets/image/heartIcon.svg';
import viewIcon from '../../assets/image/content/View.svg';
import '../../styles/global.css'
import checkIcon from '../../assets/image/checkIconActive.svg';
import emptyCharacterIcon from "../../assets/image/emptyCharacterIcon.svg";
import { useDeleteReport } from "../../hooks/useDeleteReport";

interface Props {
  category: string;
  title: string;
  date: string;
  likes: number;
  views: number;
  id?: number;
}

const ContentManageCard: React.FC<Props> = ({
  category,
  title,
  date,
  likes,
  views,
  id,
}) => {
  const navigation = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteMConfirmodal] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const { mutate: deleteReport, isPending } = useDeleteReport();

  const handleToEdit = () => {
    navigation(`/admin/content/edit/${id}?from=edit`,); 
  }

  const handleToDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = () => {
    setIsDelete(true);
    setShowDeleteMConfirmodal(false);
  }

  const handleDeleteConfirm = async () => {
      if (!id) return;

      deleteReport(id, {
        onSuccess: () => {
          setShowDeleteMConfirmodal(true);
          setShowDeleteModal(false);
        },
        onError: (error) => {
          console.error("[관리자] 리포트 삭제 실패:", error);
          alert("삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
        },
      });
    };

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.category}>{category}</div>
        <p className={styles.title}>{title}</p>

        <div className={styles.dateAndInfo}>
            <p className={styles.date}>{date}</p>

            <div className={styles.meta}>
                <span className={styles.iconWrap}>
                    <img className={styles.icon} src={heartIcon} />{likes}
                </span>
                <span className={styles.iconWrap}>
                    <img  className={styles.icon} src={viewIcon}/> {views}
                </span>
            </div>
        </div>
      </div>
      <div className={styles.manageButtons}>
        <button className={styles.editButton} onClick={handleToEdit}>수정</button>
        <button className={styles.deleteButton} onClick={handleToDelete}>삭제</button>
      </div>
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHandle}></div>
            <div className={styles.cancelModal}>
              <h2 className={styles.modalTitle}>리포트를 삭제할까요?</h2>
              <p className={styles.modalSubtitle}>
                삭제된 내용은 복구할 수 없어요!
                <br /> 신중하게 고민해 주세요!
              </p>
              <img
                src={emptyCharacterIcon}
                alt="비어있는 찐빵 캐릭터"
                className={styles.emptyCharacterIcon}
              />
              <div className={styles.modalButtons}>
                <button className={styles.cancelButton} onClick={() => setShowDeleteModal(false)}>
                  이전
                </button>
                <button
                  className={styles.cm_confirmButton}
                  onClick={() => {
                    handleDeleteConfirm();
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirmModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isDelete}
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHandle}></div>
            <div className={styles.confirmModal}>
              <img
                src={checkIcon}
                alt="완료"
                className={styles.checkIconImage}
              />
              <h2 className={styles.completeModalTitle}>삭제 완료</h2>
              <p className={styles.modalSubtitle}>
                나의 찐빵에서 삭제 여부를<br />
                확인해 주세요!
              </p>
              <button
                className={styles.confirmButton}
                onClick={handleDeleteSubmit}
                disabled={!isDelete}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManageCard;
