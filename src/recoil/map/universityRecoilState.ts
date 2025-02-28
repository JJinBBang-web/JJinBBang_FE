import { atom, selector } from "recoil"
import gnuCampus1 from "../../assets/image/campusImg1.svg"
import etcCampus from "../../assets/image/campusImg2.svg"

// 대학교 데이터
const universityData = [
    {
        id: 1,
        universityName : "경상국립대학교",
        campus : "가좌캠퍼스",
        initial : "ㄱ",
        logoImageUrl : gnuCampus1
    },
    {
        id: 2,
        universityName : "경상국립대학교",
        campus : "칠암캠퍼스",
        initial : "ㄱ",
        logoImageUrl : gnuCampus1
    },
    {
        id: 3,
        universityName : "경상국립대학교",
        campus : "통영캠퍼스",
        initial : "ㄱ",
        logoImageUrl : gnuCampus1
    },
    {
        id: 4,
        universityName : "서울대학교",
        campus : "준호네캠퍼스",
        initial : "ㅅ",
        logoImageUrl : etcCampus
    },
    {
        id: 5,
        universityName : "성신여자대학교",
        campus : "다희네캠퍼스",
        initial : "ㅅ",
        logoImageUrl : etcCampus
    },
    {
        id: 6,
        universityName : "서울과학기술대학교",
        campus : "유찬네캠퍼스",
        initial : "ㅅ",
        logoImageUrl : etcCampus
    },
    {
        id: 7,
        universityName : "고려대학교",
        campus : "서울캠퍼스",
        initial : "ㄱ",
        logoImageUrl : etcCampus
    },
    {
        id: 8,
        universityName : "고려대학교",
        campus : "세종캠퍼스",
        initial : "ㄱ",
        logoImageUrl : etcCampus
    },
    {
        id: 9,
        universityName : "단국대학교",
        campus : "천안캠퍼스",
        initial : "ㄷ",
        logoImageUrl : etcCampus
    },
    {
        id: 10,
        universityName : "단국대학교",
        campus : "서울캠퍼스",
        initial : "ㄷ",
        logoImageUrl : etcCampus
    },
]

// 초성선택
export const selectedInitialState = atom<string>({
    key : "selectedInitialState",
    default : "ㄱ",
})

// 대학교 리스트
export const universitiesState = atom({
    key: "universitiesState",
    default : universityData,
})

// 선택한 대학교 상태
export const selectedUniversityState = atom<number | null>({
    key: "selectedUniversityState",
    default: null,
})

// 대학교 필터링
export const universitiesFilterState = selector({
    key : "universitiesFilterState",
    get : ({get}) => {
        const initial = get(selectedInitialState);
        console.log(initial);
        const universities = get(universitiesState);

        if(!initial) return [];

        return universities.filter((uni) => uni.initial === initial);
    }
})