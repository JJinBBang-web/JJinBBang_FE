# 찐빵(JJinBBang) 프로젝트 매니페스트 (Feature Manifest)

**목적**: 중복 개발 원천 차단 및 지역 기능의 공용(`Feature`/`Shared`) 승격 관리
새로운 파일을 생성하거나 로직을 짜기 전, 반드시 여기서 동일/유사 역할이 존재하는지 시맨틱하게 검색하십시오.

---

## 🏗️ 범용 UI 컴포넌트 (Shared UI)
> 도메인(비즈니스 로직)에 종속되지 않은 순수 재사용 UI 요소들입니다. (`src/shared/components`, `src/assets/icons`)

| 구분 | 이름 | 파일 경로 | 역할 및 설명 (어떤 문제를 해결하는가) |
| :--- | :--- | :--- | :--- |
| **Asset** | Tab Icons | `src/assets/icons/tabs/` | 탭 네비게이션용 SVG 아이콘들 |

---

## 🧩 도메인 공용 기능 (Features)
> 두 개 이상의 화면에서 공유되는 비즈니스 로직 및 도메인 UI입니다. (`src/features/`)

| 도메인 | 종류(Component/Hook/Store) | 이름 | 파일 경로 | 역할 및 설명 |
| :--- | :--- | :--- | :--- | :--- |
| **Navigation** | Component | TabBarIcon | `src/features/tabs/components/TabBarIcon.tsx` | 탭 레이아웃에서 사용되는 개별 탭 아이콘 및 라벨 세트 |

---

## 📍 지역 자산 기반 (Screen Local Assets) - [승격 대기열]
> 현재 `src/screens` (단일 화면) 내부에 종속되어 있으나, 응집도가 높아 향후 다른 화면에서 재사용(Feature/Shared 승격)될 여지가 높은 핵심 지역 로직들입니다. 타 화면에서 접근 시 즉각 승격시켜야 합니다.

| 소속 화면 | 종류 | 이름 | 파일 경로 | 역할 및 설계 의도 |
| :--- | :--- | :--- | :--- | :--- |
| **Main** | Screen | MainScreen | `src/screens/Main/MainScreen.tsx` | 홈 탭 진입 화면 ([상세](./src/screens/Main/README.md)) |
| **HeartList** | Screen | HeartListScreen | `src/screens/HeartList/HeartListScreen.tsx` | 관심 목록 탭 진입 화면 ([상세](./src/screens/HeartList/README.md)) |
| **Review** | Screen | ReviewScreen | `src/screens/Review/ReviewScreen.tsx` | 리뷰 탭 진입 화면 ([상세](./src/screens/Review/README.md)) |
| **Content** | Screen | ContentScreen | `src/screens/Content/ContentScreen.tsx` | 콘텐츠 탭 진입 화면 ([상세](./src/screens/Content/README.md)) |
| **MyPage** | Screen | MyPageScreen | `src/screens/MyPage/MyPageScreen.tsx` | MY 탭 진입 화면 ([상세](./src/screens/MyPage/README.md)) |

---

## 🧠 전역 상수 및 상태 (Global State & Tokens)
> 디자인 시스템 및 앱 전체 범위를 커버하는 데이터입니다. (`src/constants`, `src/shared/store`)

| 구분 | 이름 | 파일 경로 | 역할 및 설명 |
| :--- | :--- | :--- | :--- |
| **Constant** | Colors | `src/constants/colors.ts` | 테마 색상 팔레트 및 브랜드 토큰 |
| **Constant** | Fonts | `src/constants/fonts.ts` | 폰트 시스템 및 사이즈 정의 |
| **Constant** | Config | `src/constants/index.ts` | 전역 상수 통합 Export |

---

## 📝 관리 준수 사항
1. **검색 우선 주의**: 컴포넌트/훅/스토어를 만들기 전 반드시 이 문서를 확인합니다.
2. **역함수 방어 (No Reverse Import)**: `Screens` 내부의 모듈을 다른 화면이 필요로 하게 되면 직접 `import` 해선 안 됩니다. 즉시 해당 모듈을 `Features` 단으로 파일 위치를 이동(승격)시키고 이 문서에 등록해야 합니다.
