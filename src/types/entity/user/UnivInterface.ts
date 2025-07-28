export interface UnivCampusInterface {
    campusAddress : string,
    campusName : string,
    id : number,
    logoImageUrl : string,
    latitude : number,
    longitude : number
}
export interface CampusResponse {
    id: number,
    universityName: string,
    universityLogo: string,
    campuses : UnivCampusInterface[]
}