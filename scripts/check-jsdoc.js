/**
 * check-jsdoc.js
 * 
 * 프로젝트의 핵심 로직 파일에 JSDoc(/** ... * /)이 포함되어 있는지 검사합니다.
 *
 * 검증 항목:
 * 1. src/features, src/shared, src/api 하위의 로직 파일 JSDoc 작성 여부
 *
 * 제외 대상: 
 * - app/ (라우팅 전용)
 * - src/screens/ 메인 구현체 ([Name]Screen.tsx)
 * - 테스트 파일 (.test.ts, .test.tsx)
 * - 타입 정의 파일 (.d.ts)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

const TARGET_DIRS = [
  path.join(SRC_DIR, 'features'),
  path.join(SRC_DIR, 'shared'),
  path.join(SRC_DIR, 'api'),
];

let errorCount = 0;

/**
 * 파일을 재귀적으로 탐색하며 JSDoc 여부를 확인합니다.
 */
function checkDir(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(ROOT_DIR, fullPath);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        checkDir(fullPath);
      }
      return;
    }

    // 파일 확장자 체크 (.ts, .tsx 만 검사)
    if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.tsx')) return;
    
    // 제외 조건 체크
    if (entry.name.endsWith('.d.ts')) return;
    if (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.tsx')) return;
    
    // Screen 메인 구현체 제외 (src/screens/.../[Name]Screen.tsx)
    // 이 스크립트의 TARGET_DIRS에는 screens가 포함되어 있지 않지만, 확장성을 위해 체크 로직 유지
    if (entry.name.endsWith('Screen.tsx')) return;

    const content = fs.readFileSync(fullPath, 'utf8').trim();

    // JSDoc 시작 패턴 (/**) 확인
    if (!content.startsWith('/**')) {
      console.error(`❌ [JSDoc 누락] ${relPath}`);
      errorCount++;
    }
  });
}

console.log('🔍 JSDoc 문서화 상태 체크 시작...');

TARGET_DIRS.forEach(dir => {
  console.log(`- 탐색 중: ${path.relative(ROOT_DIR, dir)}/`);
  checkDir(dir);
});

if (errorCount === 0) {
  console.log('\n✅ 모든 필수 파일에 JSDoc이 작성되어 있습니다.');
  process.exit(0);
} else {
  console.log(`\n🚨 총 ${errorCount}개의 파일에서 JSDoc이 누락되었습니다.`);
  console.log('💡 가이드라인: Features, Shared, API 하위의 모든 로직 파일은 JSDoc(/** ... */) 작성이 필수입니다.');
  process.exit(1);
}
