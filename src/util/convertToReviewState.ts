import { DormitoryReviewState } from '../recoil/review/dormitoryReviewAtoms';
import { ReviewState } from '../recoil/review/reviewAtoms';
import { BuildingReviewResponse } from '../types/entity/building/BuildingReviewInterface';
import { Review } from '../recoil/detail/ReviewInfoRecoliState';

export function convertResponseToReview(
  response: BuildingReviewResponse
): Review {
  const {
    generalReviewInfo,
    domitoryReviewInfo,
    agencyReviewInfo,
    reviewInfo,
    reviewImages,
    building,
    keywords,
    authorId,
    conditions,
    facilities,
  } = response;

  const convertedReview: Review = {
    reviewInfo,
    reviewImages,
    keywords,
    authorId,
    facilities,
    domitoryReviewInfo,
    agencyReviewInfo,
    generalReviewInfo: generalReviewInfo
      ? {
          ...generalReviewInfo,
          price: generalReviewInfo.price,
        }
      : undefined,
    building: {
      ...building,
      buildingCode: building.buildingCode ?? '',
    },
    conditions: conditions
      ? {
          currentRegion: conditions.currentRegion,
          currentGrade: conditions.currentGrade || 0,
        }
      : undefined,
  };

  return convertedReview;
}

export function convertToReviewState(
  data: BuildingReviewResponse
): ReviewState {
  const isDorm = !!data.domitoryReviewInfo;
  const isAgency = !!data.agencyReviewInfo;

  return {
    housingType: isDorm
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
    description: data.reviewInfo.content,
    buildingCode: data.building.buildingCode ?? '',
    latitude: data.building.latitude ?? 0,
    longitude: data.building.longitude ?? 0,
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
