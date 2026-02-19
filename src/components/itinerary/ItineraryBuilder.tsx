"use client";

import React, { useEffect, useState } from 'react';
import { TravellerForm } from './TravellerForm';
import { DayList } from './DayList';
import { ReviewSection } from './ReviewSection';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
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
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Taxio-style App Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 pb-4 pt-4 px-6 md:px-8 mb-6">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-primary-foreground bg-primary px-2 rounded-md inline-block">CRM</h1>
                        <span className="ml-2 font-bold text-lg">Agent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">
                            AG
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 pb-20">
                {renderView()}
            </main>
        </div>
    );
}
