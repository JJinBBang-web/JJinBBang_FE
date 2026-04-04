/**
 * check-manifest.js
 *
 * manifest.md 문서와 실제 프로젝트 구조의 정합성을 검사합니다.
 *
 * 검증 항목:
 * 1. src/features/*, src/screens/* 폴더의 manifest.md 등록 여부
 * 2. manifest.md에 기재된 경로의 실제 존재 여부 (유령 경로 감지)
 * 3. src/screens/* 하위에 README.md가 존재하는지 확인
 *
 * 제외 대상:
 * - 숨김 폴더 (.으로 시작하는 폴더)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'manifest.md');
const SRC_DIR = path.join(ROOT_DIR, 'src');

function checkManifest() {
  console.log('🔍 매니페스트 정합성 체크 시작...');

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ manifest.md 파일이 존재하지 않습니다.');
    process.exit(1);
  }

  const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf-8');
  const errors = [];
  const warnings = [];

  // manifest.md에서 경로 추출
  const manifestPaths = new Set();
  const pathRegex = /src\/(features|screens)\/([a-zA-Z0-9_-]+)/g;
  let match;
  while ((match = pathRegex.exec(manifestContent)) !== null) {
    manifestPaths.add(`src/${match[1]}/${match[2]}`);
  }

  const domains = ['features', 'screens'];

  domains.forEach(domain => {
    const domainDir = path.join(SRC_DIR, domain);
    if (!fs.existsSync(domainDir)) return;

    fs.readdirSync(domainDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))
      .forEach(d => {
        const relativePath = `src/${domain}/${d.name}`;
        const fullPath = path.join(domainDir, d.name);

        // 1. manifest.md 등록 여부 체크
        if (!manifestPaths.has(relativePath)) {
          errors.push(`❌ [미등록] '${relativePath}' 폴더가 manifest.md에 누락되었습니다.`);
        }

        // 2. screens는 README.md 필수
        if (domain === 'screens' && !fs.existsSync(path.join(fullPath, 'README.md'))) {
          warnings.push(`⚠️  [문서 누락] '${relativePath}/README.md' 파일이 없습니다.`);
        }
      });
  });

  // 4. 지능형 중복 구현 의심 사례 체크 (유사도 및 식별자 기반)
  console.log('🧐 지능형 중복 구현 의심 사례 분석 중 (파일명 유사도 및 Export 식별자)...');
  
  const fileDataMap = new Map(); // { fileName: { identifiers: Set, keywords: Set, path: string } }
  
  // 파일명에서 핵심 키워드 추출 (useReviewList.tsx -> review, list)
  function getKeywords(name) {
    return name
      .replace(/\.(ts|tsx|js|jsx)$/, '')
      .replace(/([a-z])([A-Z])/g, '$1 $2') // PascalCase/camelCase 분리
      .replace(/[-_]/g, ' ')
      .toLowerCase()
      .split(' ')
      .filter(w => !['use', 'screen', 'component', 'hook', 'view', 'provider', 'context', 'type', 'props', 'constant', 'index'].includes(w) && w.length > 1);
  }

  // 파일 내부 export 식별자 추출
  function getExports(content) {
    const exports = new Set();
    const exportRegex = /export\s+(const|function|type|interface|class|enum)\s+([a-zA-Z0-9_]+)/g;
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      if (!['Props', 'Type', 'State'].some(suffix => match[2].endsWith(suffix))) {
        exports.add(match[2]);
      }
    }
    return exports;
  }

  function scanFiles(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    items.forEach(item => {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        if (!item.name.startsWith('.') && item.name !== '__tests__') {
          scanFiles(fullPath);
        }
      } else if (item.isFile() && /\.(ts|tsx|js|jsx)$/.test(item.name) && item.name !== 'index.ts' && item.name !== 'README.md') {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const relativePath = fullPath.replace(ROOT_DIR, '');
        const domain = relativePath.split(path.sep)[3]; // src/screens/[Domain]
        
        fileDataMap.set(relativePath, {
          fileName: item.name,
          domain,
          keywords: new Set(getKeywords(item.name)),
          identifiers: getExports(content)
        });
      }
    });
  }

  const screensDir = path.join(SRC_DIR, 'screens');
  if (fs.existsSync(screensDir)) {
    scanFiles(screensDir);
  }

  const explored = new Set();
  const fileDataList = Array.from(fileDataMap.entries());

  for (let i = 0; i < fileDataList.length; i++) {
    for (let j = i + 1; j < fileDataList.length; j++) {
      const [p1, d1] = fileDataList[i];
      const [p2, d2] = fileDataList[j];
      
      if (d1.domain === d2.domain) continue; // 같은 화면 내 중복은 무시

      let reason = '';
      
      // 1. 파일명 완전 일치
      if (d1.fileName === d2.fileName) {
        reason = `파일명 완전 일치 ('${d1.fileName}')`;
      } 
      // 2. Export 식별자 중복
      else {
        const intersection = [...d1.identifiers].filter(x => d2.identifiers.has(x));
        if (intersection.length > 0) {
          reason = `공통 Export 식별자 발견 (${intersection.join(', ')})`;
        }
        // 3. 키워드 유사도 (핵심 키워드가 1개 이상 겹치고, 짧은 쪽에 50% 이상 포함될 때)
        else {
          const k1 = [...d1.keywords];
          const k2 = [...d2.keywords];
          const intersectK = k1.filter(x => d2.keywords.has(x));
          
          if (intersectK.length > 0 && (intersectK.length / Math.min(k1.length, k2.length) >= 0.5)) {
            reason = `주요 키워드 유사 (${intersectK.join(', ')})`;
          }
        }
      }

      if (reason) {
        warnings.push(`⚠️  [중복/유사 의심] ${reason}\n    - 파일 1: ${p1}\n    - 파일 2: ${p2}\n    👉 'src/features/' 승격을 검토하십시오.`);
      }
    }
  }

  // 3. manifest.md에 적혔지만 실제 없는 경로 감지 (유령 경로)
  manifestPaths.forEach(p => {
    if (!fs.existsSync(path.join(ROOT_DIR, p))) {
      errors.push(`❌ [유령 경로] manifest.md의 '${p}'가 실제 파일 시스템에 존재하지 않습니다.`);
    }
  });

  // 결과 보고
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ 모든 매니페스트와 문서가 일관성 있게 관리되고 있습니다.');
  } else {
    if (errors.length > 0) {
      console.log(`\n🚨 오류 ${errors.length}건 발견 (수정 필수):`);
      errors.forEach(e => console.log(e));
    }
    if (warnings.length > 0) {
      console.log(`\n⚠️  권고 ${warnings.length}건 (문서화 권장):`);
      warnings.forEach(w => console.log(w));
    }
    console.log('\n💡 가이드라인에 따라 manifest.md와 README.md를 최신화하십시오.');
    if (errors.length > 0) process.exit(1);
  }
}

checkManifest();
