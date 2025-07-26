export interface UnivInterface {
    id : number,
    universityName : string,
    universityLogo : string,
}
export interface CampusInterface {
    id : number,
    campusName : string,
    logoImageUrl : string,
    campusAddress : string,
    latitude : number,
    longitude : number
}
export interface CampusResponse {
    campusList : CampusInterface[]
}