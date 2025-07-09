// 예시 (example)
export interface MapInterface {
  id?: string;            // 생성 전에는 없을 수 있으므로 optional
  title: string;          // 테스트 제목
  data: any;              // 자유로운 데이터 구조 (필요하면 타입 정의)
}