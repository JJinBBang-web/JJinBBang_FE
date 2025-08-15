import { DormitoryReviewState } from "../recoil/review/dormitoryReviewAtoms";
import { ReviewState } from "../recoil/review/reviewAtoms";
import { BuildingReviewResponse } from "../types/entity/building/BuildingReviewInterface";


export function convertToReviewState(data: BuildingReviewResponse): ReviewState {
  const isDorm = !!data.domitoryReviewInfo;
  const isAgency = !!data.agencyReviewInfo;

  return {
    housingType:  isDorm
    ? data.domitoryReviewInfo?.type ?? ''
    : isAgency
      ? data.agencyReviewInfo?.type ?? ''
      : data.generalReviewInfo?.type ?? '',
    address: data.building.address,
    addressDetail: '', // 필요시 파싱
    detailedAddress: data.building.name,
    floorType: isDorm
      ? data.domitoryReviewInfo?.floor ?? ''
      : data.generalReviewInfo?.floor ?? '',
    contractType: data.generalReviewInfo?.contractType ?? '',
    deposit: data.generalReviewInfo?.deposit ?? 0,
    monthlyRent: data.generalReviewInfo?.price ?? 0,
    managementFee: data.generalReviewInfo?.maintenanceCost ?? 0,
    rating:
      data.generalReviewInfo?.rating ??
      data.domitoryReviewInfo?.rating ??
      data.agencyReviewInfo?.rating ??
      0,
    pros: data.keywords?.positive ?? [],
    cons: data.keywords?.negative ?? [],
    content: data.reviewInfo?.content ?? '',
    images: data.reviewImages?.imageUrl ?? [],
    description : data.reviewInfo.content,
    dormitoryConditions: isDorm
      ? {
          residenceArea: data.conditions?.currentRegion ?? '',
          semesterGrade: data.conditions?.currentGrade ?? 0.0,
          dormitoryFee: data.domitoryReviewInfo?.dormFee ?? 0,
          hasDistanceCriteria: !!data.conditions?.currentRegion,
          hasGradeCriteria: !!data.conditions?.currentGrade,
        }
      : undefined,
    dormitoryFee: data.domitoryReviewInfo?.dormFee ?? 0,
    facilityConditions: isDorm
    ? {
        private: (data.facilities?.private ?? []).reduce(
          (acc, cur) => ({ ...acc, [cur]: true }),
          {} as Record<string, boolean>
        ),
        public: (data.facilities?.public ?? []).reduce(
          (acc, cur) => ({ ...acc, [cur]: true }),
          {} as Record<string, boolean>
        ),
        lounge: { 있음: data.facilities?.lounge ?? false },
      }
    : undefined,
  };
}