# VI. 문서화 및 유지보수 (Process & Maintenance)

**"AI와 사람이 모두 이해하기 쉬운 코드가 좋은 코드입니다."**

## 1. 주석 및 문서화 (JSDoc)

- **원칙**: 모든 함수, 훅, 유틸리티, 공용 컴포넌트에는 JSDoc을 작성함.
- **필수 대상**:
    - **Features/Shared**: 모든 공용 컴포넌트, 훅, 유틸리티.
    - **Logic**: API 명세(`*API.ts`), 데이터 처리 로직, 전역 상태(Store) 정의 등.
- **작성 제외 대상 (Exemptions)**:
    - **app/**: 단순 라우팅 엔트리 파사드 파일 (예: `app/(tabs)/(myPage)/myPage.tsx`).
    - **[Name]Screen.tsx**: 각 스크린의 메인 구현체 (예: `src/screens/Main/MainScreen.tsx`). 이들은 동일 폴더의 `README.md`로 설명을 대체함.
- **작성 내용**: 역할(Description), Props 설명(@param), 리턴값(@returns), 예시(@example) 등을 포함함.
- **Features 통합 JSDoc**: Features 단의 메인 엔트리 파일 상단에 해당 도메인의 전체 설계 의도와 비즈니스 로직을 상세히 기술함.

### 1-1. JSDoc 템플릿 (Template)

```javascript
/**
 * [함수/컴포넌트 이름] - [짧은 역할 요약]
 *
 * @description [상세 동작 방식 및 비즈니스 로직 설명]
 * @param {Type} name - [매개변수 설명]
 * @returns {Type} [반환값 설명]
 * @example
 * // [사용 예시 코드]
 * const result = useExample('input');
 */
```

## 2. 화면별 상세 문서 (README)

- 위치: `src/screens/[Name]/README.md`
- 내용:
    - **기능 명세**: 해당 화면의 진입 조건과 비즈니스 로직 엣지 케이스.
    - **네비게이션**: 이 화면에서 이동할 수 있는 다음 화면들과 넘겨주는 Params.

### 2-1. README 템플릿 (Template)

```markdown
# 📱 [화면 이름] Screen

## 📝 개요
- **진입 경로**: `app/path/to/page.tsx`
- **역할**: [이 화면이 담당하는 핵심 목적 기록]

## 🚀 주요 기능
- [ ] 기능 1 (예: 유저 정보 조회 및 표시)
- [ ] 기능 2 (예: 필터링 및 정렬 로직)

## 🗺️ 네비게이션
- **Next**:
  - `Detail`: 상세 페이지 이동 (ID 전달 필수)
- **Params**:
  - `id`: 유저 고유 식별값 (string)

## 📡 데이터 및 상태
- **Components**: `Shared/Button`, `Features/Auth/AuthForm`
- **Hooks**: `useAuth`, `usePlatform` (공용 훅 활용 데이터)
- **API**: `UserAPI.getUserInfo`
- **Store**: `useUserStore` (유저 프로필 캐싱)
```

## 3. 테스트 전략 (Testing Strategy)

**"모바일 환경에 특화된 검증 가능한 코드를 작성합니다."**

- **프레임워크**: `Jest`와 `@testing-library/react-native`(RNTL)를 사용합니다. (E2E는 제외, 단위 및 컴포넌트 로직 검증에 집중)
- **파일 위치(Co-location)**: 테스트 파일은 테스트할 대상과 최대한 가까운 위치에 둡니다. `__tests__` 폴더를 만들어 응집시킵니다.
    - 예: `src/features/auth/components/__tests__/AuthForm.test.tsx`
    - 예: `src/screens/Main/hooks/__tests__/useSomeLogic.test.ts`
- **검증 기준**: 훅(Hook)의 핵심 비즈니스 로직 연산과, 컴포넌트의 사용자 인터랙션(onPress 등)에 따른 예외 상황을 중심으로 테스트 케이스를 구성합니다.

## 4. 지식 지속적 개선 (Knowledge Evolution)

- **Anti-pattern 발견 시**: 즉시 `SKILL.md` 반영을 제안하여 프로젝트 전체의 기술 부채가 쌓이지 않도록 합니다.
- **일관성 체크**: AI가 코드를 작성할 때 항상 `.agents/skills/`의 가이드라인과 충돌하지 않는지 자가 검증 단계를 수행합니다.
