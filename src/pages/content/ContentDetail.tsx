import React, { useEffect, useState } from "react";
import styles from "./ContentDetail.module.css"
import Header from "../../components/Header";
import sample from "../../assets/image/content/sample.png"
import ContentFooter from "../../components/content/ContentFooter";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useReportDetail } from "../../hooks/useReportDetail";
import Spinner from '../../components/util/Spinner';
import { CATEGORY_TO_KOR } from "../../util/mapping";
import {
  useAddReportLike,
  useRemoveReportLike,
} from "../../hooks/useReportLike";
import { formatDate } from "../../util/formatDate";
import hartIconOff from "../../assets/image/content/WhiteHeart.svg";
import hartIconOn from "../../assets/image/content/WhiteHeartOn.svg";
import '../../styles/global.css'

const ContentDetail: React.FC = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
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
            // 사용자가 공유 창을 닫는 경우(AbortError)도 여기로 올 수 있음
            // 너무 공격적으로 에러 띄우기보단 복사 fallback 권장
            await copyToClipboard(url);
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
                <div className={styles.section}>
                    <div className={styles.catAndShare}>
                        <div className={styles.category}>{category}</div>
                        <button className={styles.shareBtn} onClick={handleShare}>공유하기</button>
                    </div>
                    <div className={styles.titleWrap}>
                        <p className={styles.title}>{data.title}</p>
                        <p className={styles.date}>{formatDate(data.createdAt)}</p>
                    </div>
                   <div
                        className={styles.contentWrap}
                        dangerouslySetInnerHTML={{ __html: data.content }}
                    ></div>
                    <div className={styles.heartBox} onClick={handleToggleLike}>
                        <img src={liked ? hartIconOn : hartIconOff} />
                        <p>도움이 되었어요</p>
                    </div>
                </div>
                <ContentFooter likes={likeCount} shares={data.shareCount} onClick={handleBack} onToggleLike={handleToggleLike} isLiked={liked}/>
            </div>
        </div>
    );
}

export default ContentDetail;