"use client";

import React, { useEffect, useState } from 'react';
import { TravellerForm } from './TravellerForm';
import { DayList } from './DayList';
import { ReviewSection } from './ReviewSection';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Button } from '@/components/ui/button';
import { useItineraryStore } from '@/store/useItineraryStore';

export default function ItineraryBuilder() {
    const [isClient, setIsClient] = useState(false);
    const { view, setView, activeLeadId, traveller } = useItineraryStore();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return <div className="p-4 flex justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div></div>;

    const renderView = () => {
        switch (view) {
            case 'lead-creation':
                return (
                    <div className="space-y-4">
                        <Button variant="ghost" className="pl-0 gap-1" onClick={() => setView('dashboard')}>
                            ← Back to Dashboard
                        </Button>
                        <TravellerForm />
                    </div>
                );
            case 'dashboard':
                return <Dashboard />;
            case 'builder':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" className="pl-0 gap-1" onClick={() => setView('dashboard')}>
                                ← Back
                            </Button>
                            <span className="text-sm font-medium text-muted-foreground">
                                Building for: {traveller.name}
                            </span>
                        </div>
                        {/* Note: Templates usage is temporarily hidden in this minimal flow, can be re-added if needed */}
                        <DayList />
                        <div className="flex justify-end pt-4">
                            <Button onClick={() => setView('export')} className="w-full sm:w-auto">
                                Next: Review & Export →
                            </Button>
                        </div>
                    </div>
                );
            case 'export':
                return (
                    <div className="space-y-4">
                        <Button variant="ghost" className="pl-0 gap-1" onClick={() => setView('builder')}>
                            ← Back to Builder
                        </Button>
                        <ReviewSection />
                    </div>
                );
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 pb-20">
            <header className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-foreground">Agent CRM</h1>
                <p className="text-xs text-muted-foreground">Manage leads, itineraries & growth</p>
            </header>

            {renderView()}
        </div>
    );
}
