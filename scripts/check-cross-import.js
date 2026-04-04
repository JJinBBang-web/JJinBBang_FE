/**
 * check-cross-import.js
 *
 * src/features/ 내 서로 다른 도메인 간의 직접 import(횡단 참조)를 감지합니다.
 *
 * 검증 항목:
 * 1. src/features/[domainA] 하위 파일이 @/features/[domainB]를 직접 참조하는지 여부
 *
 * 제외 대상:
 * - 동일 도메인 내의 참조
 * - node_modules 및 숨김 폴더
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const FEATURES_DIR = path.join(ROOT_DIR, 'src', 'features');

const errors = [];

/** 디렉토리를 재귀적으로 순회하며 모든 .ts/.tsx 파일을 수집합니다. */
function collectFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        results.push(...collectFiles(fullPath));
      }
      return;
    }

    if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      results.push(fullPath);
    }
  });

  return results;
}

/** 파일에서 @/features/* import 경로를 추출합니다. */
function extractFeatureImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /(?:import|from)\s+['"]@\/features\/([^/'"]+)/g;
  const imports = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]); // 도메인 이름만 추출 (예: "auth", "map")
  }
  return [...new Set(imports)]; // 중복 제거
}

function checkCrossImport() {
  console.log('🔍 Features 횡단 참조(Cross-Domain Import) 체크 시작...');

  if (!fs.existsSync(FEATURES_DIR)) {
    console.log('⏭️  src/features/ 폴더가 없습니다. 스킵.');
    return;
  }

  const featureDomains = fs.readdirSync(FEATURES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name);

  featureDomains.forEach(domain => {
    const domainDir = path.join(FEATURES_DIR, domain);
    const files = collectFiles(domainDir);

    files.forEach(filePath => {
      const importedDomains = extractFeatureImports(filePath);
      const relPath = path.relative(ROOT_DIR, filePath);

      importedDomains.forEach(importedDomain => {
        if (importedDomain !== domain) {
          errors.push(
            `❌ [횡단 참조] '${relPath}'가 '@/features/${importedDomain}'을 import합니다. ` +
            `'features/${domain}' → 'features/${importedDomain}' 직접 참조는 금지됩니다. ` +
            `Screens에서 Composition하거나 Zustand 전역 상태를 사용하세요.`
          );
        }
      });
    });
  });

  if (errors.length === 0) {
    console.log('✅ Features 간 횡단 참조가 발견되지 않았습니다.');
  } else {
    console.log(`\n🚨 횡단 참조 위반 ${errors.length}건 발견 (수정 필수):`);
    errors.forEach(e => console.log(e));
    console.log('\n💡 가이드라인: Features 간 직접 import 대신 상위 Screens에서 Props/콜백으로 합성하세요.');
    process.exit(1);
  }
}

checkCrossImport();
