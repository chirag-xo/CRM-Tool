"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useItineraryStore } from '@/store/useItineraryStore';
import { BarChart3, Users, Share2 } from 'lucide-react';

interface Stats {
    leadsGenerated: number;
    itinerariesShared: number;
}

export const ActivitySummary: React.FC = () => {
    const { statsTrigger } = useItineraryStore();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/activity-stats', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [statsTrigger]);

    if (!stats && loading) {
        return <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">Loading activity...</div>;
    }

    if (!stats) return null;

    return (
        <section className="mt-8 border-t pt-8">
            <h2 className="text-lg font-semibold mb-4 px-1 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Your Activity Summary
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Users className="w-3 h-3" /> Leads Generated
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.leadsGenerated}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Travellers added</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Share2 className="w-3 h-3" /> Itineraries Shared
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.itinerariesShared}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Via WhatsApp/Email</p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};
