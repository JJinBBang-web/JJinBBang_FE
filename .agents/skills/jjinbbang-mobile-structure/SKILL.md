---
name: jjinbbang-mobile-structure
description: 찐빵(JJinBBang) 리액트 네이티브 모바일 프로젝트 헌법 및 폴더 구조 가이드라인 (Modular).
priorities:
  - 1: 화면 우선 법칙 (Screen First, Features Later)
  - 2: 중첩 네비게이션 관리 (Expo Router First)
  - 3: 재사용될 때만 Features로 승격 (Promote on Reuse)
---

# 📱 찐빵(JJinBBang) 모바일 프로젝트 헌법 (The Constitution)

이 문서는 프로젝트의 **핵심 기준(Source of Truth)** 입니다. 모든 코드 생성, 변경은 이 가이드라인과 하위 모듈화된 규칙들을 엄격히 따릅니다.

## 🗺️ 가이드라인 요약 및 링크

이 가이드라인은 관리 효율성을 위해 **6개의 모듈**로 분리되어 있습니다. 특정 기능을 구현하기 전에 해당 섹션을 먼저 읽으세요.

### [I. AI 행동 강령 (AI Protocol)](./01-ai-protocol.md)

- 새로운 파일을 생성하거나, AI가 자의적으로 코드를 작성하거나, 작업 전 탐색 및 설계 단계가 누락되었을 때 참조함.

### [II. 기술 스택 (Foundation)](./02-foundation.md)

- 라이브러리 선정, 환경 설정, 또는 프로젝트의 기술적 근간을 확인해야 할 때 참조함.

### [III. 아키텍처 및 구조 (Architecture)](./03-architecture.md)

- 새로운 화면(Screen)이나 기능(Feature)을 폴더 구조에 배치하거나, Web/Native 공통 로직을 분리할 때 참조함.

### [IV. 데이터 전략 (Data Strategy)](./04-data-strategy.md)

- 서버 데이터(API)를 캐싱하거나 전역 상태(Zustand), 로컬 저장소(AsyncStorage)를 설계할 때 참조함.

### [V. 코딩 컨벤션 (Coding Standards)](./05-coding-standards.md)

- 변수/파일명 명명, 컴포넌트 작성, 또는 NativeWind를 사용하여 UI 스타일을 잡을 때 참조함.

### [VI. 문서화 및 유지보수 (Maintenance)](./06-maintenance.md)

- JSDoc 작성, 화면별 명세 업데이트, 또는 코드 리뷰 전 품질 체크가 필요할 때 참조함.

---

**"이 문서는 단순한 문서가 아니라 프로젝트의 행동 지침입니다. AI는 모든 작업 시 이 규칙을 최우선으로 준수해야 합니다."**
