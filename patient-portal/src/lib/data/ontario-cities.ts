// Ontario, Canada cities with realistic coordinates and postal codes
export interface OntarioCity {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  postalCodePrefix: string;
  population: number;
}

export const ontarioCities: OntarioCity[] = [
  {
    name: "Toronto",
    province: "ON",
    latitude: 43.6532,
    longitude: -79.3832,
    postalCodePrefix: "M",
    population: 2930000,
  },
  {
    name: "Ottawa",
    province: "ON",
    latitude: 45.4215,
    longitude: -75.6972,
    postalCodePrefix: "K",
    population: 1017449,
  },
  {
    name: "Hamilton",
    province: "ON",
    latitude: 43.2557,
    longitude: -79.8711,
    postalCodePrefix: "L",
    population: 569353,
  },
  {
    name: "London",
    province: "ON",
    latitude: 42.9849,
    longitude: -81.2453,
    postalCodePrefix: "N",
    population: 422324,
  },
  {
    name: "Kitchener",
    province: "ON",
    latitude: 43.4501,
    longitude: -80.4829,
    postalCodePrefix: "N2",
    population: 256885,
  },
  {
    name: "Windsor",
    province: "ON",
    latitude: 42.3149,
    longitude: -83.0364,
    postalCodePrefix: "N8",
    population: 229660,
  },
  {
    name: "Sudbury",
    province: "ON",
    latitude: 46.5221,
    longitude: -81.3187,
    postalCodePrefix: "P3",
    population: 166004,
  },
  {
    name: "Thunder Bay",
    province: "ON",
    latitude: 48.3809,
    longitude: -89.2477,
    postalCodePrefix: "P7",
    population: 121621,
  },
  {
    name: "Oshawa",
    province: "ON",
    latitude: 43.8971,
    longitude: -78.8658,
    postalCodePrefix: "L1",
    population: 415847,
  },
  {
    name: "Barrie",
    province: "ON",
    latitude: 44.3894,
    longitude: -79.6903,
    postalCodePrefix: "L4",
    population: 147829,
  },
  {
    name: "Kingston",
    province: "ON",
    latitude: 44.2312,
    longitude: -76.4860,
    postalCodePrefix: "K7",
    population: 132485,
  },
  {
    name: "Guelph",
    province: "ON",
    latitude: 43.5448,
    longitude: -80.2482,
    postalCodePrefix: "N1",
    population: 135474,
  },
];

// Generate realistic postal codes for a city
export function generatePostalCode(city: OntarioCity): string {
  const { postalCodePrefix } = city;
  const letter1 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const number1 = Math.floor(Math.random() * 10);
  const letter2 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const number2 = Math.floor(Math.random() * 10);
  const letter3 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const number3 = Math.floor(Math.random() * 10);
  
  return `${postalCodePrefix}${letter1}${number1} ${letter2}${number2}${letter3}${number3}`;
}

// Generate realistic addresses within a city
export function generateAddress(city: OntarioCity): string {
  const streetNumbers = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const streetNames = [
    "Main St", "King St", "Queen St", "University Ave", "Bay St",
    "Yonge St", "College St", "Dundas St", "Bloor St", "Front St",
    "Wellington St", "Albert St", "Rideau St", "Bank St", "Elgin St"
  ];
  
  const streetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
  const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
  
  return `${streetNumber} ${streetName}, ${city.name}, ${city.province} ${generatePostalCode(city)}`;
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}
