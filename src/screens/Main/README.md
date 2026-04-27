# 🏠 Main Screen

## 📝 기능 명세
- 앱의 메인 홈 화면
- 현재 프로젝트의 기본 진입점

## 🗺️ 네비게이션
- **경로**: `/` (app/(tabs)/(main)/index.tsx)
- **이동 가능 화면**:
  - 관심 목록 (Tab)
  - 리뷰 (Tab)
  - 콘텐츠 (Tab)
  - MY (Tab)

## 🏗️ 구성 요소
- **Screen**: `src/screens/Main/MainScreen.tsx`
- **Components**
  - `MainTopHeader`
  - `MainBannerSection`
  - `MainSearchBar`
  - `MainCategoryTabs`
  - `MainUniversitySection`
  - `MainUniversityGridItem`
  - `MainRentPriceCard`
- **Hooks**
  - `useMainHomeStore` (Zustand)
- **Constants**
  - `types/mainData.ts` (카테고리/대학 데이터)
