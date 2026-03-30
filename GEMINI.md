# 찐빵(JJinBBang) 프로젝트 헌법 (The Constitution)

이 파일은 제미나이 CLI가 세션 시작 시 가장 먼저 읽는 핵심 지침입니다. 모든 작업은 아래 규칙과 참조된 문서를 기반으로 수행됩니다.

## 🎯 핵심 지령 (Core Mandates)
1. **규칙 로드**: 작업 시작 전 반드시 `.gemini/context/` 폴더 내의 모든 `SKILL.md` 가이드라인을 분석하고 준수할 것.
   - `project-structure-guidelines/SKILL.md` (폴더 구조 및 파일명 규칙)
   - `vercel-composition-patterns/SKILL.md` (컴포넌트 합성 패턴)
   - `vercel-react-best-practices/SKILL.md` (React 최적화 기법)

2. **코딩 스타일**:
   - 파일명 및 폴더명: 무조건 **`kebab-case`** 사용.
   - 절대 경로: `@/` 또는 설정된 **Base URL** 기반의 절대 경로만 사용할 것. (Relative Import 금지)
   - 스타일링: **Tailwind CSS Only**. (Styled-components 사용 금지)

3. **작업 프로세스**:
   - 새로운 기능 구현 시 반드시 `/pdca plan`으로 계획부터 수립할 것.
   - 변경 사항은 반드시 JSDoc으로 문서화할 것.

## 📂 참조 가이드라인 (Skill Path)
- `.gemini/context/project-structure-guidelines/SKILL.md`
- `.gemini/context/vercel-composition-patterns/SKILL.md`
- `.gemini/context/vercel-react-best-practices/SKILL.md`
