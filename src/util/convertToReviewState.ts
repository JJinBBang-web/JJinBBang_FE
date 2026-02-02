import { ReviewState } from '../recoil/review/reviewAtoms';
import { BuildingReviewResponse } from '../types/entity/building/BuildingReviewInterface';
import { Review } from '../recoil/detail/ReviewInfoRecoliState';

export function convertResponseToReview(
  response: BuildingReviewResponse
): Review {
  const {
    generalReviewInfo,
    dormitoryReviewInfo,
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
    dormitoryReviewInfo,
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
  const isDorm = !!data.dormitoryReviewInfo;
  const isAgency = !!data.agencyReviewInfo;

  return {
    housingType: isDorm
      ? data.dormitoryReviewInfo?.type ?? ''
      : isAgency
      ? data.agencyReviewInfo?.type ?? ''
      : data.generalReviewInfo?.type ?? '',
    address: data.building.address,
    addressDetail: '', // 필요시 파싱
    detailedAddress: data.building.name,
    floorType: isDorm
      ? data.dormitoryReviewInfo?.floor ?? ''
      : data.generalReviewInfo?.floor ?? '',
    contractType: data.generalReviewInfo?.contractType ?? '',
    deposit: data.generalReviewInfo?.deposit ?? 0,
    monthlyRent: data.generalReviewInfo?.price ?? 0,
    managementFee: data.generalReviewInfo?.maintenanceCost ?? 0,
    rating:
      data.generalReviewInfo?.rating ??
      data.dormitoryReviewInfo?.rating ??
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
    universityName: isDorm ? data.dormitoryReviewInfo?.universityName : "",
    space: data.generalReviewInfo?.space,
    dormitoryId: data.dormitoryReviewInfo?.id,
    dormitoryName: data.dormitoryReviewInfo?.name,
    dormitoryConditions: isDorm
      ? {
          residenceArea: data.conditions?.currentRegion ?? '',
          semesterGrade: data.conditions?.currentGrade ?? 0.0,
          dormitoryFee: data.dormitoryReviewInfo?.dormFee ?? 0,
          hasDistanceCriteria: !!data.conditions?.currentRegion,
          hasGradeCriteria: !!data.conditions?.currentGrade,
          roomCapacity: data.dormitoryReviewInfo?.capacity
        }
      : undefined,
    dormitoryFee: data.dormitoryReviewInfo?.dormFee ?? 0,
    facilityConditions: isDorm
      ? {
          private: (data.facilities?.privateFacilities ?? []).reduce(
            (acc, cur) => ({ ...acc, [cur]: true }),
            {} as Record<string, boolean>
          ),
          public: (data.facilities?.publicFacilities ?? []).reduce(
            (acc, cur) => ({ ...acc, [cur]: true }),
            {} as Record<string, boolean>
          ),
          lounge: { 있음: data.facilities?.lounge ?? false },
        }
      : undefined,
  };
}
