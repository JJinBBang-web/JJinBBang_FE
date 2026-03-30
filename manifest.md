# 찐빵(JJinBBang) 프로젝트 매니페스트 (Manifest)

이 파일은 프로젝트의 중복 코드를 방지하고, AI의 컨텍스트 파악을 돕기 위한 **"전역 기능 추적용 마스터 맵"**입니다.
AI는 새로운 기능을 구현하기 전, 이 문서를 파싱(Parsing)하여 유사한 컴포넌트나 로직이 있는지 반드시 확인해야 합니다.

> [!IMPORTANT]
> **AI 작업 수칙 (AI Protocol)**:
> 1. 신규 기능 구현 전, 이 파일에서 관련된 도메인(Domain)이나 경로(Path)를 우선 검색할 것.
> 2. 지역 폴더(`app/`)에 구현된 기능을 다른 화면에서도 사용해야 한다면, 해당 파일을 `src/features/`로 이동(승격)시키고 이 문서를 갱신할 것.
> 3. 신규 파일 생성 시, 해당 파일의 **정확한 상대 경로**와 역할을 이곳에 추가할 것.

---

## 📍 1. 지역 (Local : `app/`)
특정 화면(Screen) 단위에 종속된 기능입니다. 타 화면에서 필요해질 경우 우선적으로 공용(Feature) 승격 대상이 됩니다.

### [Domain: Home] 홈 화면
- **Path**: `app/(tabs)/(home)/`
- **components**: 
  - (예) `_components/BuildingReviewPreview.tsx`: 건물 리뷰 미리보기 UI
  - (예) `_components/CampusSlide.tsx`: 캠퍼스 사진 슬라이더
- **hooks**:
  - (예) `_hooks/useCampusList.ts`: 캠퍼스 데이터 패칭 및 필터링 
- **store** (Zustand):
  - (예) `_store/useCampusStore.ts`: 홈 전용 상태 (현재 선택된 캠퍼스 등)
  - (예) `_store/useFilterStore.ts`: 건물 검색 필터 상태 (Slice 분리)

### [Domain: Map] 지도 화면
- **Path**: `app/(tabs)/map/`
- **components**: 
  - (예) `_components/MarkerBottomSheet.tsx`: 마커 클릭 시 노출 정보 시트
  - (예) `_components/SearchFilter.tsx`: 지도 검색 조건 필터
- **hooks**:
  - (예) `_hooks/useCurrentLocation.ts`: 기기 GPS 좌표 추적
- **store**:
  - (예) `_store/useMapStore.ts`: 지도 중심점 및 줌 레벨 스토어

---

## 🧩 2. 공용 (Feature : `src/features/`)
두 개 이상의 화면에서 공유되는 도메인 별 핵심 비즈니스 로직과 컴포넌트입니다.

### [Domain: Auth] 인증 및 유저 권한
- **Path**: `src/features/auth/`
- **components**: 
  - (예) `components/SocialLoginButtons.tsx`: 카카오/구글/애플 로그인 버튼부
- **hooks**:
  - (예) `hooks/useAuthSession.ts`: 세션 토큰 갱신 및 만료 처리
- **store**:
  - (예) `store/useAuthStore.ts`: 유저 식별 코드 및 가입 상태 관리

### [Domain: Review] 후기 처리
- **Path**: `src/features/review/`
- **components**:
  - (예) `components/StarRatingInput.tsx`: 인터랙티브 별점 입력 컴포넌트
  - (예) `components/PhotoUploader.tsx`: 다중 이미지 첨부 모듈
- **hooks**:
  - (예) `hooks/useReviewSubmit.ts`: 작성 폼 상태 검증 및 최종 API 제출
- **store**:
  - (비어있음)

