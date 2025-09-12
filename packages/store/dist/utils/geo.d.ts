export declare function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
export declare function kmToMiles(km: number): number;
export declare function milesToKm(miles: number): number;
export declare function isWithinOntario(lat: number, lng: number): boolean;
export declare function generateRandomCoordinatesInCity(cityLat: number, cityLng: number, radiusKm?: number): {
    lat: number;
    lng: number;
};
