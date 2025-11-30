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

const ContentDetail: React.FC = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const navigate = useNavigate();

    const { reportId } = useParams();
    const id = Number(reportId)

    const { data, isLoading, isError } = useReportDetail(id);
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
                    <div className={styles.category}>{category}</div>
                    <div className={styles.titleWrap}>
                        <p className={styles.title}>{data.title}</p>
                        <p className={styles.date}>{data.createdAt}</p>
                    </div>
                   <div
                        className={styles.contentWrap}
                        dangerouslySetInnerHTML={{ __html: data.content }}
                    ></div>
                </div>
                <ContentFooter likes={likeCount} shares={data.shareCount} onClick={handleBack} onToggleLike={handleToggleLike} isLiked={liked}/>
            </div>
        </div>
    );
}

export default ContentDetail;