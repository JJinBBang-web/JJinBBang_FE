/**
 * check-route-mapping.js
 *
 * app/ 라우트 파일과 src/screens/ 간의 매핑 정합성을 검증합니다.
 *
 * 검증 항목:
 * 1. 각 app/ 라우트 파일(비-레이아웃)이 @/screens/ 에서 Screen 컴포넌트를 import하고 있는지
 * 2. import된 Screen 파일이 실제로 존재하는지
 * 3. src/screens/ 에 존재하지만 어떤 라우트에서도 참조하지 않는 고아(orphan) Screen이 있는지
 *
 * 제외 대상:
 * - _layout.tsx (레이아웃 파일)
 * - +not-found.tsx (에러 페이지)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT_DIR, 'app');
const SCREENS_DIR = path.join(ROOT_DIR, 'src', 'screens');

const errors = [];
const warnings = [];

/** app/ 하위의 모든 라우트 파일(.tsx)을 재귀적으로 수집합니다. (레이아웃/에러 페이지 제외) */
function collectRouteFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...collectRouteFiles(fullPath));
      return;
    }

    // 레이아웃, 에러 페이지, 비-tsx 파일 제외
    if (!entry.name.endsWith('.tsx')) return;
    if (entry.name.startsWith('_layout')) return;
    if (entry.name.startsWith('+')) return;

    results.push(fullPath);
  });

  return results;
}

/** 파일 내용에서 @/screens/ import 경로를 추출합니다. */
function extractScreenImport(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // import ... from '@/screens/...' 또는 "..." 패턴 매칭
  const importRegex = /import\s+.*from\s+['"]@\/screens\/([^'"]+)['"]/g;
  const matches = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    matches.push(match[1]); // 예: "Main/MainScreen"
  }
  return matches;
}

/** src/screens/ 하위의 모든 Screen 도메인 폴더를 수집합니다. */
function collectScreenDomains() {
  if (!fs.existsSync(SCREENS_DIR)) return [];

  return fs.readdirSync(SCREENS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name);
}

function checkRouteMapping() {
  console.log('🔍 app/ ↔ src/screens/ 매핑 정합성 체크 시작...');

  const routeFiles = collectRouteFiles(APP_DIR);
  const screenDomains = collectScreenDomains();
  const referencedDomains = new Set();

  // 1. 각 라우트 파일이 Screen을 올바르게 import하는지 검사
  routeFiles.forEach(routeFile => {
    const relPath = path.relative(ROOT_DIR, routeFile);
    const screenImports = extractScreenImport(routeFile);

    if (screenImports.length === 0) {
      errors.push(`❌ [Screen 미참조] '${relPath}'가 @/screens/ 에서 아무것도 import하지 않습니다. 라우트 파일은 Screen 컴포넌트를 import해야 합니다.`);
      return;
    }

    screenImports.forEach(importPath => {
      // importPath 예: "Main/MainScreen" 또는 "HeartList/HeartListScreen"
      const domain = importPath.split('/')[0];
      referencedDomains.add(domain);

      // import된 파일이 실제로 존재하는지 확인
      const possibleExtensions = ['.tsx', '.ts', '.js', '.jsx', ''];
      const basePath = path.join(ROOT_DIR, 'src', 'screens', importPath);
      const exists = possibleExtensions.some(ext => fs.existsSync(basePath + ext));

      if (!exists) {
        errors.push(`❌ [유령 참조] '${relPath}'가 import한 '@/screens/${importPath}'가 실제로 존재하지 않습니다.`);
      }
    });
  });

  // 2. src/screens/ 에 존재하지만 어떤 라우트에서도 참조되지 않는 Screen 감지
  screenDomains.forEach(domain => {
    if (!referencedDomains.has(domain)) {
      warnings.push(`⚠️  [고아 Screen] 'src/screens/${domain}/'이 어떤 app/ 라우트에서도 참조되지 않습니다.`);
    }
  });

  // 결과 보고
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ 모든 라우트-스크린 매핑이 정합합니다.');
  } else {
    if (errors.length > 0) {
      console.log(`\n🚨 오류 ${errors.length}건 발견 (수정 필수):`);
      errors.forEach(e => console.log(e));
    }
    if (warnings.length > 0) {
      console.log(`\n⚠️  권고 ${warnings.length}건:`);
      warnings.forEach(w => console.log(w));
    }
    console.log('\n💡 가이드라인: app/ 라우트 파일은 반드시 대응하는 src/screens/[Name]/[Name]Screen.tsx를 import해야 합니다.');
    if (errors.length > 0) process.exit(1);
  }
}

checkRouteMapping();
