# VI. 문서화 및 유지보수 (Process & Maintenance)

**"AI와 사람이 모두 이해하기 쉬운 코드가 좋은 코드입니다."**

## 1. 주석 및 문서화 (JSDoc)

모든 파일과 함수 상단에는 JSDoc을 작성하는 것을 원칙으로 합니다.

- **컴포넌트**: 역할, Props 설명, 예시 상황을 JSDoc `/** ... */`에 기술합니다.
- **Hook & API**: 파라미터 타입과 리턴값, 그리고 발생할 수 있는 주요 에러 케이스를 주석으로 남깁니다.

```tsx
/**
 * @description 유저의 프로필 정보를 조회하는 커스텀 훅입니다.
 * @param {string} userId - 조회할 유저의 고유 ID
 * @returns {UserType} 유저 정보와 로딩 상태 등을 반환
 */
```

## 2. 화면별 상세 문서

- 위치: `app/[Path]/README.md` 또는 `src/screens/[Name]/README.md`
- 내용:
    - **기능 명세**: 해당 화면의 진입 조건과 비즈니스 로직 엣지 케이스.
    - **네비게이션**: 이 화면에서 이동할 수 있는 다음 화면들과 넘겨주는 Params.

## 3. 지식 지속적 개선 (Knowledge Evolution)

- **Anti-pattern 발견 시**: 즉시 `SKILL.md` 반영을 제안하여 프로젝트 전체의 기술 부채가 쌓이지 않도록 합니다.
- **일관성 체크**: AI가 코드를 작성할 때 항상 `.agents/skills/`의 가이드라인과 충돌하지 않는지 자가 검증 단계를 수행합니다.
