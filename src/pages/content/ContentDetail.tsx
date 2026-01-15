import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import styles from "./ContentDetail.module.css"
import Header from "../../components/Header";
import iconClose from "../../assets/image/iconClose.svg"
import ContentFooter from "../../components/content/ContentFooter";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useReportDetail } from "../../hooks/useReportDetail";
import Spinner from '../../components/util/Spinner';
import verifiedCharacter from '../../assets/image/verifiedSheetCharacter.svg';
import { CATEGORY_TO_KOR } from "../../util/mapping";
import {
  useAddReportLike,
  useRemoveReportLike,
} from "../../hooks/useReportLike";
import { formatDate } from "../../util/formatDate";
import '../../styles/global.css'
import Modal from "../../components/review/Modal";
import HeartIconOff from '../../assets/image/content/reportHeartOff.svg';
import HeartIconOn from '../../assets/image/content/reportHeartOn.svg';
import { useRecoilState } from "recoil";
import { isLoginState } from "../../recoil/auth/isLoginState";
import { tokenStore } from "../../api/api";

const ContentDetail: React.FC = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(true);
    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
    const [hideNav, setHideNav] = useState(false);
    const [isLogin] = useRecoilState(isLoginState);
    const [verificationStatus, setVerificationStatus] = useState(false);
    
    const navigate = useNavigate();

    const { reportId } = useParams();
    const id = Number(reportId)

    const { data, isLoading, isError } = useReportDetail(id);
    const title = data?.title ?? '';
    const [liked, setLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);

    const addLikeMutation = useAddReportLike(id);
    const removeLikeMutation = useRemoveReportLike(id);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.visualViewport?.height || window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        
        // 초기 로드 시 한 번 실행
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 미인증 여부 확인
    useEffect(() => {
        const verification = sessionStorage.getItem("verificationStatus");
        setVerificationStatus(verification === 'unverified');
    }, []);

    const openAuthModal = () => {
        setIsModalOpen(true);
        setIsSheetVisible(false);
        setHideNav(true);

        setModalContent(
            <div className={styles.wrap}>
            <div className={styles.sheet_header}>
                <div className={styles.header_divider}></div>
            </div>

            <div className={styles.sheet_title_wrap}>
                <div className={styles.sheet_info_wrap}>
                <p className={styles.sheet_title}></p>
                </div>
                <img src={iconClose} width="24px" onClick={handleCloseModal} />
            </div>

            <div className={styles.sheetWrap}>
                <img src={verifiedCharacter} />
                <p className={styles.sheetText}>
                학교 인증 후<br />
                찐빵에서 제공하는 정보들을<br />
                마음에 담을 수 있어요!
                </p>
            </div>

            <div className={styles.btnWrap}>
                <button className={styles.confirmBtn} onClick={handleToAuth}>
                {!isLogin ? "로그인하러 가기" : "학교 인증하기"}
                </button>
            </div>
            </div>
        );
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsSheetVisible(true);
        setModalContent(null);
        setHideNav(false);
    };

    useEffect(() => {
        if (data) {
        setLiked(data.isLiked);
        setLikeCount(data.likeCount);
        }
    }, [data]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleToggleLike = () => {
        if (liked) {
            // 좋아요 취소
            removeLikeMutation.mutate(undefined, {
            onSuccess: () => {
                setLiked(false);
                setLikeCount((prev) => prev - 1);
            },
            });
        } else {
            // 좋아요 추가
            addLikeMutation.mutate(undefined, {
            onSuccess: () => {
                setLiked(true);
                setLikeCount((prev) => prev + 1);
            },
            });
        }
    };

    const handleToAuth = () => {
        handleCloseModal();
        if (!isLogin) navigate("/mypage");
        else navigate("/auth/student/verify");
    };


    const handleToggleLikeGuarded = () => {
        // ✅ 로그인 안했거나, 미인증이면 모달
        if (!isLogin || verificationStatus) {
            openAuthModal();
            return;
        }

        // ✅ 통과하면 좋아요
        handleToggleLike();
    };

    const copyToClipboard = async (text: string) => {
        // 최신 브라우저
        if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
        }

        // 구형 fallback
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    };

    const handleShare = async () => {
        const url = window.location.href;

        const shareData = {
            title: title,
            text: title,
            url,
        };

        try {
        // Web Share API 미지원이면 링크 복사로 fallback
        if (!navigator.share) {
            await copyToClipboard(url);
            alert("링크를 복사했어요!");
            return;
        }

        // (선택) canShare 체크
        if (navigator.canShare && !navigator.canShare(shareData)) {
            await copyToClipboard(url);
            alert("링크를 복사했어요!");
            return;
        }

        // 공유 실행
        await navigator.share(shareData);

            // TODO: 공유 성공 시 shareCount 올리는 API가 있으면 여기서 호출
            // ex) ContentAPI.increaseShareCount(id)

        } catch (e) {
            // ✅ 사용자가 공유창 닫음: fallback 복사하지 말기
            if (e === "AbortError") return;

            // ✅ 진짜 공유 실패일 때만 복사 시도
            try {
                await copyToClipboard(url);
                
            } catch (copyErr) {
                // 복사도 막히면 최후 fallback
            }
        }
    };

    if (isLoading) 
        return <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        }}>
                        <Spinner />
                    </div>;

    if (isError || !data)
        return <div>데이터 조회 실패</div>;

    const category = CATEGORY_TO_KOR[data.category];

    return (         
        <div className={styles.content} style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            <div className={styles.container}>
                <Header onClick={handleBack}/>
                {isModalOpen && (
                    <Modal onClose={handleCloseModal}>
                        {modalContent}
                    </Modal>
                )}
                <div className={styles.section}>
                    <div className={styles.catAndShare}>
                        <div className={styles.category}>{category}</div>
                        <button className={styles.shareBtn} onClick={handleShare}>공유하기</button>
                    </div>
                    <div className={styles.titleWrap}>
                        <p className={styles.title}>{data.title}</p>
                        <p className={styles.date}>{formatDate(data.createdAt)}</p>
                    </div>
                   <div className={styles.contentWrap}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeSanitize]}
                            components={{
                            img: ({ ...props }) => (
                                <img
                                {...props}
                                style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    borderRadius: 12,
                                    margin: "16px 0",
                                }}
                                />
                            ),
                            p: ({ children }) => (
                                <p style={{ lineHeight: 1.7,}}>{children}</p>
                            ),
                            ul: ({ children }) => (
                                <ul style={{ paddingLeft: 20 }}>{children}</ul>
                            ),
                            ol: ({ children }) => (
                                <ol style={{ paddingLeft: 20 }}>{children}</ol>
                            ),
                            li: ({ children }) => (
                                <li style={{ marginBottom: 6 }}>{children}</li>
                            ),
                            }}
                            >
                            {data.content}
                        </ReactMarkdown>
                    </div>
                    <button className={`${styles.likedButton} ${liked ? styles.likedButtonActive : ''}`} onClick={handleToggleLikeGuarded}>
                        <img src={liked ? HeartIconOn : HeartIconOff} className={styles.heartIcon} />
                        좋아요
                    </button>
                </div>
                <ContentFooter likes={likeCount} shares={data.shareCount} onClick={handleBack} onToggleLike={handleToggleLikeGuarded} isLiked={liked} onShare={handleShare}/>
            </div>
        </div>
    );
}

export default ContentDetail;