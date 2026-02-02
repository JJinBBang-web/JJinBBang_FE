export type CampusSearchItem = {
  fullName: string; // "대학교명 캠퍼스명"
  campusAddress: string;
  campusId: number;
  campusName: string;
  universityId: number;
  universityName: string;
};


export type CampusSearchResponse = {
    items: CampusSearchItem[];
    limit: number;
    offset: number;
};

export type DormitoryItem = {
  campusName: string;
  dormitoryId: number;
  dormitoryName: string;
  dormitoryAddress: string;
};

export type DormitoryListResponse = {
    dormitories: DormitoryItem[];
}