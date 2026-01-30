import React from 'react';
import { ActivitySummary } from './ActivitySummary';
import { LeadsList } from './LeadsList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';

export const Dashboard: React.FC = () => {
    const { setView } = useItineraryStore();

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Agent Dashboard</h2>
                <Button onClick={() => setView('lead-creation')} size="sm" className="gap-1">
                    <Plus size={16} /> New Lead
                </Button>
            </div>

            {/* Stats Section */}
            <ActivitySummary />

            {/* Leads Section */}
            <LeadsList />
        </div>
    );
};
