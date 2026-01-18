import React, { useEffect, useRef, useState } from "react";
import styles from "./ContentWrite.module.css";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import type { RefMDEditor } from "@uiw/react-md-editor";
import { getCommands, getExtraCommands } from "@uiw/react-md-editor/commands-cn";
import "../../styles/global.css";
import Header from "../../components/Header";
import { imageUploadAPI } from "../../api/imageUpload";
import { CATEGORY_DESCRIPTION, KorCategory } from "../../constants/reportCategoryDescription";
import { useReportDetail } from "../../hooks/useReportDetail";
import { CATEGORY_TO_KOR, KOR_TO_CATEGORY } from "../../util/mapping";
import { useCreateReport } from "../../hooks/useCreateReport";
import { useUpdateReport } from "../../hooks/useUpdateReport";


const ContentWritePage: React.FC = () => {
  const navigation = useNavigate();
  const [searchParams] = useSearchParams();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const from = (searchParams.get("from") ?? "write") as "write" | "edit";
  const { reportId } = useParams();
  const id = Number(reportId);
  const isEdit = from === "edit";

  const [value, setValue] = useState<string>("");
  const [title, setTitle] = useState("");
  const categories = Object.keys(CATEGORY_DESCRIPTION) as KorCategory[];
  const [selectedCategory, setSelectedCategory] = useState<KorCategory>("부동산");

  const [isUploading, setIsUploading] = useState(false);

  const didInitRef = useRef(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 에디터 textarea DOM을 직접 잡아서 커서 위치에 삽입하기
  const editorRef = useRef<RefMDEditor | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const normalizedTitle = title.trim();
  const normalizedContent = value
  .replace(/<!--[\s\S]*?-->/g, "")
  .trim();

  const { mutateAsync: createReport, isPending: isCreating } = useCreateReport();
  const { mutateAsync: updateReport, isPending: isUpdating } = useUpdateReport();


  const isConfirmDisabled =
    normalizedTitle.length === 0 ||
    normalizedContent.length === 0 ||
    isUploading ||
    isCreating ||
    isUpdating;

  const { data, isLoading, isError } = useReportDetail(id);


  useEffect(() => {
    if (!isEdit) return;        // edit 모드만
    if (!id) return;            // id 없으면 중단 (null/0/NaN 방지)
    if (isLoading || isError) return;
    if (!data) return;

    if (didInitRef.current) return;
    didInitRef.current = true;

    console.log("기존 데이터로 초기화:", data);

    setTitle(data.title ?? "");
    setValue(data.content ?? "");
     const serverCategory = data.category as keyof typeof CATEGORY_TO_KOR; // "REAL_ESTATE" | ...
    const korCategory = CATEGORY_TO_KOR[serverCategory] ?? "부동산";
    setSelectedCategory(korCategory);
  }, [isEdit, id, data, isLoading, isError]);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.visualViewport?.height || window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // 렌더 후 textarea를 잡아두기
    const root = editorRef.current?.container;
    if (!root) return;

    textareaRef.current = root.querySelector("textarea");
    }, []);

  const handleBack = () => navigation(-1);

  // 현재 커서 위치에 텍스트 삽입하고, 삽입 후 커서 위치까지 복원
  const insertToCursor = (text: string) => {
    const ta = textareaRef.current;

    // fallback: textarea를 못 잡으면 맨 뒤에 append
    if (!ta) {
      setValue((prev) => `${prev}${text}`);
      return;
    }

    const start = ta.selectionStart ?? value.length;
    const end = ta.selectionEnd ?? value.length;

    const next =
      value.slice(0, start) +
      text +
      value.slice(end);

    setValue(next);

    // React state 반영 후 커서 복원
    requestAnimationFrame(() => {
      const target = textareaRef.current;
      if (!target) return;
      const cursor = start + text.length;
      target.focus();
      target.setSelectionRange(cursor, cursor);
    });
  };

  // 업로드 토큰 만들기 (중복 방지 위해 timestamp 포함)
  const makeLoadingToken = (fileName: string) => {
    const safeName = fileName || "image";
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return `<!-- Uploading "${safeName}" (${id}) -->`;
  };

  // 파일 업로드: Uploading 토큰 삽입 → 업로드 → 토큰 치환
  const handleUploadFile = async (file: File) => {
    const token = makeLoadingToken(file.name);

    // 1) 현재 커서 위치에 토큰 삽입
    insertToCursor(token);

    try {
      setIsUploading(true);

      // 2) 업로드 진행 (S3 presigned → fallback 포함)
      const url = await imageUploadAPI.uploadImage(file, "review");
      const encoded = encodeURI(url);

      // 3) 토큰을 이미지 마크다운으로 치환 (해당 자리 유지)
      setValue((prev) => prev.replace(token, `![img](${encoded})`));
    } catch (e: any) {
      console.error(e);

      // 4) 실패 시 토큰 제거
      setValue((prev) => prev.replace(token, ""));

      alert(e?.message ?? "이미지 업로드에 실패했어요.");
    } finally {
      setIsUploading(false);
      textareaRef.current?.focus();
    }
  };

  // 파일 선택 시 업로드
  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 같은 파일 재선택 가능
    if (!file) return;
    await handleUploadFile(file);
  };

  // 붙여넣기 이미지 업로드 (캡처 후 Ctrl+V)
  const onPaste: React.ClipboardEventHandler<HTMLTextAreaElement> = async (e) => {
    const files = Array.from(e.clipboardData.files || []);
    const img = files.find((f) => f.type.startsWith("image/"));
    if (!img) return;

    e.preventDefault();
    await handleUploadFile(img);
  };

  const getFirstImageFromMarkdown = (md: string): string | undefined => {
    // ![alt](url "title") 형태에서 url만 캡처
    // 공백 전까지 url로 보고, 괄호 닫기 전까지의 나머지는 title로 취급
    const re = /!\[[^\]]*\]\(\s*([^\s)]+)(?:\s+["'][^"']*["'])?\s*\)/m;
    const match = md.match(re);
    return match?.[1];
  };

  const onSubmit = async () => {
    if (isConfirmDisabled) return;

    try {
      const coverImage = getFirstImageFromMarkdown(normalizedContent) ?? "";
      if (!isEdit) {
        if (!window.confirm("리포트를 저장하시겠습니까?")) return;
        
        await createReport({
          title: normalizedTitle,
          content: normalizedContent,
          category: KOR_TO_CATEGORY[selectedCategory],
          coverImage,
        });

          alert("리포트가 저장되었습니다.");
          navigation("/admin/content", { replace: true });
          return;
      }

      if (!id || Number.isNaN(id)) {
        alert("수정할 글 id가 없어요.");
        return;
      }

      if (!window.confirm("리포트를 수정하시겠습니까?")) return;

      await updateReport({
        reportId: id,
        data: {
          title: normalizedTitle,
          content: normalizedContent,
          category: KOR_TO_CATEGORY[selectedCategory],
          coverImage,
        },
      });

      alert("리포트가 수정되었습니다.");
      navigation("/admin/content", { replace: true });
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "저장에 실패했어요.");
    }
  };


  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <Header type="title" title={isEdit ? "찐빵 리포트 수정하기" : "찐빵 리포트 작성하기"} onClick={handleBack} />

        <div className={styles.section}>
          <div className={styles.titleSection}>
            <label className={styles.label}>제목을 입력해주세요.</label>
            <input className={styles.titleInput} placeholder="리포트 제목을 입력해주세요." value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className={styles.categorySection}>
            <label className={styles.label}>카테고리를 선택해주세요.</label>
            <div className={styles.chipWrap}>
                {categories.map((cat) => {
                const isActive = cat === selectedCategory;
                return (
                    <button
                        key={cat}
                        type="button"
                        className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                        onClick={() => setSelectedCategory(cat)}
                        aria-pressed={isActive}
                    >
                    {cat}
                    </button>
                );
                })}
            </div>
          </div>

          <div className={styles.contentSection}>
            {
                isUploading 
                ? <span className={styles.uploadingText}>이미지 업로드 중...</span>
                : <button
                    type="button"
                    className={styles.imageButton}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    title={isUploading ? "이미지 업로드 중..." : "이미지 추가"}
                    >
                    + IMG
                    </button>
            }
            <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onPickFile}
          />

          <div data-color-mode="light">
            <MDEditor
              value={value}
              preview="edit"
              commands={getCommands()}
              extraCommands={[...getExtraCommands()]}
              onChange={(val) => setValue(val ?? "")}
              height={windowHeight - 400}
              textareaProps={{
                onPaste,
              }}
            />
          </div>
          </div>
        </div>

        <div className={styles.btnWrap}>
          <button className={styles.confirmBtn} disabled={isConfirmDisabled} onClick={onSubmit}>{isCreating ? "저장 중.." : isEdit ? "수정 완료" : "작성 완료"}</button>
        </div>
      </div>
    </div>
  );
};

export default ContentWritePage;
