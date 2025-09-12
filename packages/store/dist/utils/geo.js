// Geographic utility functions for Ontario, Canada
// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}
// Convert kilometers to miles
export function kmToMiles(km) {
    return Math.round(km * 0.621371 * 10) / 10;
}
// Convert miles to kilometers
export function milesToKm(miles) {
    return Math.round(miles * 1.60934 * 10) / 10;
}
// Check if coordinates are within Ontario bounds
export function isWithinOntario(lat, lng) {
    // Ontario approximate bounds
    const minLat = 41.7; // Windsor area
    const maxLat = 56.9; // Hudson Bay
    const minLng = -95.2; // Manitoba border
    const maxLng = -74.4; // Ottawa area
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}
// Generate random coordinates within a city's bounds
export function generateRandomCoordinatesInCity(cityLat, cityLng, radiusKm = 10) {
    // Convert radius to degrees (approximate)
    const latRadius = radiusKm / 111; // 1 degree ≈ 111 km
    const lngRadius = radiusKm / (111 * Math.cos(cityLat * Math.PI / 180));
    const lat = cityLat + (Math.random() - 0.5) * 2 * latRadius;
    const lng = cityLng + (Math.random() - 0.5) * 2 * lngRadius;
    return { lat, lng };
}
