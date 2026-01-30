import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AgentProfile, DayActivity, Itinerary, TravellerDetails } from '@/types/itinerary';
import { v4 as uuidv4 } from 'uuid';

interface ItineraryState {
    traveller: TravellerDetails;
    days: DayActivity[];
    agent: AgentProfile;
    customTemplates: Itinerary[];
    statsTrigger: number;
    // New CRM State
    view: 'lead-creation' | 'dashboard' | 'builder' | 'export';
    activeLeadId: string | null;

    // Actions
    triggerStatsUpdate: () => void;
    setTraveller: (details: Partial<TravellerDetails>) => void;
    setDays: (days: DayActivity[]) => void;
    addDay: () => void;
    removeDay: (id: string) => void;
    updateDay: (id: string, updates: Partial<DayActivity>) => void;
    reorderDays: (oldIndex: number, newIndex: number) => void;
    setAgentProfile: (profile: Partial<AgentProfile>) => void;
    reset: () => void;
    loadTemplate: (template: Partial<Itinerary>) => void;
    saveAsTemplate: (name: string) => void;
    deleteTemplate: (id: string) => void;

    // New Actions
    setView: (view: 'lead-creation' | 'dashboard' | 'builder' | 'export') => void;
    setActiveLead: (id: string | null) => void;
}

const initialTraveller: TravellerDetails = {
    name: '',
    from_location: '',
    destination: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    purpose: 'Leisure',
    paxCount: 2,
    phone: '',
};

const initialAgent: AgentProfile = {
    name: '',
    contact: '',
    companyName: '',
    phone: '',
};

// ... original initial objects ...

export const useItineraryStore = create<ItineraryState>()(
    persist(
        (set) => ({
            traveller: initialTraveller,
            days: [],
            agent: initialAgent,
            customTemplates: [],
            statsTrigger: 0,

            // New State Defaults
            view: 'lead-creation',
            activeLeadId: null,

            triggerStatsUpdate: () => set((state) => ({ statsTrigger: state.statsTrigger + 1 })),

            // ... original actions ...
            setTraveller: (details) =>
                set((state) => ({
                    traveller: { ...state.traveller, ...details },
                })),

            setDays: (days) => set({ days }),

            addDay: () =>
                set((state) => {
                    const newDayNumber = state.days.length + 1;
                    const newDay: DayActivity = {
                        id: uuidv4(),
                        dayNumber: newDayNumber,
                        title: `Day ${newDayNumber}`,
                        description: '',
                        visitingPlaces: [],
                        images: [],
                        vehicle: { type: 'Sedan', model: '' },
                        hotel: { name: '', category: '' },
                    };
                    return { days: [...state.days, newDay] };
                }),

            removeDay: (id) =>
                set((state) => ({
                    days: state.days.filter((day) => day.id !== id),
                })),

            updateDay: (id, updates) =>
                set((state) => ({
                    days: state.days.map((day) =>
                        day.id === id ? { ...day, ...updates } : day
                    ),
                })),

            reorderDays: (oldIndex, newIndex) => set((state) => {
                const newDays = [...state.days];
                const [removed] = newDays.splice(oldIndex, 1);
                newDays.splice(newIndex, 0, removed);
                return {
                    days: newDays.map((d, i) => ({ ...d, dayNumber: i + 1, title: `Day ${i + 1}` }))
                };
            }),

            setAgentProfile: (profile) =>
                set((state) => ({
                    agent: { ...state.agent, ...profile },
                })),

            reset: () =>
                set({
                    traveller: initialTraveller,
                    days: [],
                    view: 'lead-creation', // Reset to start
                    activeLeadId: null
                }),

            loadTemplate: (template) => {
                if (template.traveller) {
                    set((state) => ({ traveller: { ...state.traveller, ...template.traveller } }));
                }
                if (template.days) {
                    const newDays = template.days.map(d => ({ ...d, id: uuidv4() }));
                    set({ days: newDays });
                }
            },

            saveAsTemplate: (name) => {
                set((state) => {
                    const newTemplate: Itinerary = {
                        id: `custom-${uuidv4()}`,
                        traveller: { ...state.traveller, destination: name },
                        days: state.days,
                        lastModified: Date.now()
                    };
                    return { customTemplates: [...(state.customTemplates || []), newTemplate] };
                });
            },

            deleteTemplate: (id) => {
                set((state) => ({
                    customTemplates: (state.customTemplates || []).filter(t => t.id !== id)
                }));
            },

            // New Actions Implementation
            setView: (view) => set({ view }),
            setActiveLead: (activeLeadId) => set({ activeLeadId }),
        }),
        {
            name: 'itinerary-storage',
        }
    )
);
