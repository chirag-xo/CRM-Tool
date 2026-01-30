import { Itinerary } from "@/types/itinerary";

export const TEMPLATES: Partial<Itinerary>[] = [
    {
        id: 'kerala-munnar',
        traveller: {
            name: '',
            destination: 'Kerala (Munnar & Alleppey)',
            startDate: '',
            endDate: '',
            purpose: 'Leisure',
            paxCount: 2
        },
        days: [
            {
                id: 't1-d1',
                dayNumber: 1,
                title: 'Arrival in Cochin & Transfer to Munnar',
                description: 'Pick up from Cochin Airport/Railway station and proceed to Munnar. On the way visit Cheeyappara Waterfalls. Check into hotel and relax.',
                visitingPlaces: ['Cheeyappara Waterfalls', 'Valara Waterfalls'],
                images: [],
                vehicle: { type: 'Sedan', model: 'Dzire / Etios' },
                hotel: { name: '', category: '3 Star' }
            },
            {
                id: 't1-d2',
                dayNumber: 2,
                title: 'Munnar Sightseeing',
                description: 'After breakfast, proceed for full day sightseeing of Munnar. Visit Eravikulam National Park, Tea Museum, Mattupetty Dam, Eco Point.',
                visitingPlaces: ['Eravikulam National Park', 'Tea Museum', 'Mattupetty Dam', 'Eco Point'],
                images: [],
                vehicle: { type: 'Sedan', model: 'Dzire / Etios' },
                hotel: { name: '', category: '3 Star' }
            },
            {
                id: 't1-d3',
                dayNumber: 3,
                title: 'Munnar to Alleppey Houseboat',
                description: 'Drive to Alleppey. Check in to the Houseboat by 12 noon. Cruise through the backwaters. Lunch, Tea/Coffee & Snacks, Dinner and Overnight stay in Houseboat.',
                visitingPlaces: ['Alleppey Backwaters', 'Houseboat Cruise'],
                images: [],
                vehicle: { type: 'Sedan', model: 'Dzire / Etios' },
                hotel: { name: 'Private Houseboat', category: 'Standard' }
            }
        ] as any[]
    },
    {
        id: 'goa-fun',
        traveller: {
            name: '',
            destination: 'Goa',
            startDate: '',
            endDate: '',
            purpose: 'Fun',
            paxCount: 4
        },
        days: [
            {
                id: 't2-d1',
                dayNumber: 1,
                title: 'Arrival & North Goa Relaxation',
                description: 'Arrive at Goa Airport. Transfer to hotel in North Goa. Evening free to stroll at Calangute Beach.',
                visitingPlaces: ['Calangute Beach', 'Baga Lane'],
                images: [],
                vehicle: { type: 'Taxi', model: 'Ertiga' },
                hotel: { name: '', category: '4 Star' }
            },
            {
                id: 't2-d2',
                dayNumber: 2,
                title: 'North Goa Trendsetters',
                description: 'Visit Fort Aguada, Candolim Beach, and Anjuna Beach. Evening enjoy water sports (optional).',
                visitingPlaces: ['Fort Aguada', 'Candolim Beach', 'Anjuna Flea Market'],
                images: [],
                vehicle: { type: 'Taxi', model: 'Ertiga' },
                hotel: { name: '', category: '4 Star' }
            }
        ] as any[]
    },
    {
        id: 'char-dham',
        traveller: {
            name: '',
            destination: 'Char Dham Yatra',
            startDate: '',
            endDate: '',
            purpose: 'Pilgrimage',
            paxCount: 4
        },
        days: [
            {
                id: 'cd-d1',
                dayNumber: 1,
                title: 'Haridwar to Barkot',
                description: 'Drive from Haridwar to Barkot via Mussoorie. Visit Kempty Falls on the way. Check in to hotel.',
                visitingPlaces: ['Kempty Falls', 'Mussoorie View'],
                images: [],
                vehicle: { type: 'Tempo Traveller', model: 'Force Urbania' },
                hotel: { name: '', category: 'Standard' }
            },
            {
                id: 'cd-d2',
                dayNumber: 2,
                title: 'Barkot - Yamunotri - Barkot',
                description: 'Drive to Jankichatti and trek to Yamunotri. Darshan and Pooja. Return to Barkot.',
                visitingPlaces: ['Yamunotri Temple', 'Surya Kund'],
                images: [],
                vehicle: { type: 'Tempo Traveller', model: 'Force Urbania' },
                hotel: { name: '', category: 'Standard' }
            },
            {
                id: 'cd-d3',
                dayNumber: 3,
                title: 'Barkot to Uttarkashi',
                description: 'Drive to Uttarkashi. Visit Kashi Vishwanath Temple. Overnight stay.',
                visitingPlaces: ['Kashi Vishwanath Temple', 'Prakateshwar Cave'],
                images: [],
                vehicle: { type: 'Tempo Traveller', model: 'Force Urbania' },
                hotel: { name: '', category: 'Standard' }
            }
        ] as any[]
    },
    {
        id: 'rajasthan-royal',
        traveller: {
            name: '',
            destination: 'Royal Rajasthan',
            startDate: '',
            endDate: '',
            purpose: 'Leisure',
            paxCount: 2
        },
        days: [
            {
                id: 'rj-d1',
                dayNumber: 1,
                title: 'Arrival in Jaipur',
                description: 'Arrival at Jaipur. Transfer to hotel. Evening visit Chokhi Dhani for traditional dinner.',
                visitingPlaces: ['Chokhi Dhani', 'Birla Mandir'],
                images: [],
                vehicle: { type: 'Sedan', model: 'Etios' },
                hotel: { name: '', category: '4 Star' }
            },
            {
                id: 'rj-d2',
                dayNumber: 2,
                title: 'Jaipur Sightseeing',
                description: 'Visit Amber Fort, City Palace, Jantar Mantar and Hawa Mahal.',
                visitingPlaces: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar'],
                images: [],
                vehicle: { type: 'Sedan', model: 'Etios' },
                hotel: { name: '', category: '4 Star' }
            },
            {
                id: 'rj-d3',
                dayNumber: 3,
                title: 'Jaipur to Udaipur',
                description: 'Drive to Udaipur. Enroute visit Ajmer Dargah and Pushkar Lake.',
                visitingPlaces: ['Ajmer Sharif', 'Pushkar Brahma Temple'],
                images: [],
                vehicle: { type: 'Sedan', model: 'Etios' },
                hotel: { name: '', category: '4 Star' }
            }
        ] as any[]
    },
    {
        id: 'sikkim-delight',
        traveller: {
            name: '',
            destination: 'Sikkim Delight',
            startDate: '',
            endDate: '',
            purpose: 'Leisure',
            paxCount: 2
        },
        days: [
            {
                id: 'sk-d1',
                dayNumber: 1,
                title: 'Arrival in Gangtok',
                description: 'Pick up from Bagdogra Airport and transfer to Gangtok. Evening free for MG Marg.',
                visitingPlaces: ['MG Marg'],
                images: [],
                vehicle: { type: 'SUV', model: 'Innova' },
                hotel: { name: '', category: '3 Star' }
            },
            {
                id: 'sk-d2',
                dayNumber: 2,
                title: 'Tsomgo Lake & Baba Mandir',
                description: 'Excursion to Tsomgo Lake and Baba Mandir.',
                visitingPlaces: ['Tsomgo Lake', 'Baba Mandir'],
                images: [],
                vehicle: { type: 'SUV', model: 'Innova' },
                hotel: { name: '', category: '3 Star' }
            }
        ] as any[]
    },
    {
        id: 'rameshwaram-madurai',
        traveller: {
            name: '',
            destination: 'Rameshwaram & Madurai',
            startDate: '',
            endDate: '',
            purpose: 'Pilgrimage',
            paxCount: 4
        },
        days: [
            {
                id: 'rm-d1',
                dayNumber: 1,
                title: 'Madurai Arrival & Sightseeing',
                description: 'Arrival at Madurai. Visit Meenakshi Temple and Thirumalai Nayak Palace.',
                visitingPlaces: ['Meenakshi Temple', 'Thirumalai Nayak Palace'],
                images: [],
                vehicle: { type: 'SUV', model: 'Innova' },
                hotel: { name: '', category: 'Standard' }
            },
            {
                id: 'rm-d2',
                dayNumber: 2,
                title: 'Madurai to Rameshwaram',
                description: 'Drive to Rameshwaram. Visit Pamban Bridge and Ramanathaswamy Temple.',
                visitingPlaces: ['Pamban Bridge', 'Ramanathaswamy Temple', 'Dhanushkodi'],
                images: [],
                vehicle: { type: 'SUV', model: 'Innova' },
                hotel: { name: '', category: 'Standard' }
            }
        ] as any[]
    },
    {
        id: 'ujjain-omkareshwar',
        traveller: {
            name: '',
            destination: 'Ujjain & Omkareshwar',
            startDate: '',
            endDate: '',
            purpose: 'Pilgrimage',
            paxCount: 4
        },
        days: [
            {
                id: 'uj-d1',
                dayNumber: 1,
                title: 'Ujjain Mahakal Darshan',
                description: 'Arrival in Ujjain. Visit Mahakaleshwar Temple and Ram Ghat.',
                visitingPlaces: ['Mahakaleshwar Temple', 'Kal Bhairav', 'Ram Ghat'],
                images: [],
                vehicle: { type: 'Sedan', model: 'Dzire' },
                hotel: { name: '', category: '3 Star' }
            },
            {
                id: 'uj-d2',
                dayNumber: 2,
                title: 'Ujjain to Omkareshwar',
                description: 'Drive to Omkareshwar. Jyotirlinga Darshan.',
                visitingPlaces: ['Omkareshwar Temple', 'Mamleshwar Temple'],
                images: [],
                vehicle: { type: 'Sedan', model: 'Dzire' },
                hotel: { name: '', category: '3 Star' }
            }
        ] as any[]
    },
    {
        id: 'rishikesh-mussoorie',
        traveller: {
            name: '',
            destination: 'Rishikesh & Mussoorie',
            startDate: '',
            endDate: '',
            purpose: 'Leisure',
            paxCount: 4
        },
        days: [
            {
                id: 'rsh-d1',
                dayNumber: 1,
                title: 'Rishikesh Arrival',
                description: 'Arrival in Rishikesh. Check in to camping. River Rafting and Evening Ganga Aarti.',
                visitingPlaces: ['Ram Jhula', 'Laxman Jhula', 'Triveni Ghat Aarti'],
                images: [],
                vehicle: { type: 'Tempo Traveller', model: 'Force' },
                hotel: { name: 'Riverside Camp', category: 'Camping' }
            },
            {
                id: 'rsh-d2',
                dayNumber: 2,
                title: 'Transfer to Mussoorie',
                description: 'Drive to Mussoorie via Dehradun. Visit Mall Road.',
                visitingPlaces: ['Sahastradhara', 'Mall Road', 'Gun Hill'],
                images: [],
                vehicle: { type: 'Tempo Traveller', model: 'Force' },
                hotel: { name: '', category: '3 Star' }
            }
        ] as any[]
    }
];
