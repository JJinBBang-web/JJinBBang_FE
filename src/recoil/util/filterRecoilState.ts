import { atom } from "recoil";
import positive1 from "../../assets/image/tag_img (1).svg"
import positive2 from "../../assets/image/tag_img (43).svg"
import positive3 from "../../assets/image/tag_img (42).svg"
import positive4 from "../../assets/image/tag_img (41).svg"
import positive5 from "../../assets/image/tag_img (40).svg"
import positive6 from "../../assets/image/tag_img (39).svg"
import positive7 from "../../assets/image/tag_img (38).svg"
import positive8 from "../../assets/image/tag_img (37).svg"
import positive9 from "../../assets/image/tag_img (44).svg"
import positive10 from "../../assets/image/tag_img (36).svg"
import positive11 from "../../assets/image/tag_img (35).svg"
import positive12 from "../../assets/image/tag_img (34).svg"
import positive13 from "../../assets/image/tag_img (32).svg"
import positive14 from "../../assets/image/tag_img (31).svg"
import positive15 from "../../assets/image/tag_img (33).svg"
import positive16 from "../../assets/image/tag_img (30).svg"
import positive17 from "../../assets/image/tag_img (29).svg"
import positive18 from "../../assets/image/tag_img (28).svg"
import positive19 from "../../assets/image/tag_img (27).svg"
import positive20 from "../../assets/image/tag_img (26).svg"
import positive21 from "../../assets/image/tag_img (25).svg"
import positive22 from "../../assets/image/tag_img (24).svg"



// 찐 필터 후기 정렬
export const JjinFilterState = atom({
    key: "JjinFilterState",
    default : [
        {
            category : "위치/주변환경",
            id : "location",
            filter : [
                { label : "교통이 편리해요", icon : positive1,},
                { label : "주변 환경이 깨끗해요", icon : positive2,},
                { label : "동네가 조용해요", icon : positive3,},
                { label : "공원이 가까워요", icon : positive4,},
                { label : "생활권이 편리해요", icon : positive5,},
                { label : "학교와 가까워요", icon : positive6,},
                { label : "동네가 안전해요", icon : positive7,},
                { label : "이웃들이 친절해요", icon : positive8,},
            ]
        },
        {
            category : "집 내부 상태",
            id : "house",
            filter : [
                { label : "채광이 좋아요", icon : positive9,},
                { label : "통풍이 잘 돼요", icon : positive10,},
                { label : "방음이 잘 돼요", icon : positive11,},
                { label : "신축이라 세련됐어요", icon : positive12,},
                { label : "냉난방이 잘 돼요", icon : positive13,},
                { label : "배수와 수압이 좋아요", icon : positive14,},
                { label : "곰팡이가 없어요", icon : positive15,},
            ]
        },
        {
            category : "편의시설과 관리",
            id : "management",
            filter : [
                { label : "주차가 편리해요", icon : positive16,},
                { label : "엘리베이터가 있어요", icon : positive17,},
                { label : "관리비가 합리적이에요", icon : positive18,},
                { label : "쓰레기 처리가 편해요", icon : positive19,},
                { label : "인터넷이 잘 돼요", icon : positive20,},
                { label : "관리가 정기적이에요", icon : positive21,},
                { label : "이사가 편했어요", icon : positive22,},
            ]
        },
    ]
})