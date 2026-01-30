export interface AgentProfile {
    name: string;
    companyName: string;
    contact: string;
    phone?: string;
    logoUrl?: string; // Base64 or Object URL
}

export interface Vehicle {
    type: string;
    model: string;
    image?: string;
}

export interface Hotel {
    name: string;
    category: string;
    image?: string;
}

export interface DayActivity {
    id: string;
    dayNumber: number;
    title: string; // e.g., "Arrival & Local Sightseeing"
    description: string;
    visitingPlaces: string[];
    vehicle?: Vehicle;
    hotel?: Hotel;
    images: string[]; // URLs for grid
}

export interface TravellerDetails {
    name: string;
    from_location?: string;
    destination: string;
    startDate: string; // ISO Date string
    endDate: string; // ISO Date string
    purpose?: string;
    paxCount?: number;
    phone?: string;
}

export interface Itinerary {
    id: string;
    traveller: TravellerDetails;
    days: DayActivity[];
    lastModified: number;
}
