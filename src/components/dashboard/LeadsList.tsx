import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useItineraryStore } from '@/store/useItineraryStore';
import { MapPin, Calendar, Phone, Loader2, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Lead {
    id: string;
    name: string;
    phone: string;
    destination: string;
    created_at: string;
    start_date: string;
    end_date: string;
    travellers: number;
    status: string; // 'pending', 'shared'
}

export const LeadsList: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const { setView, setActiveLead, setTraveller, setDays, statsTrigger, triggerStatsUpdate } = useItineraryStore();

    useEffect(() => {
        fetchLeads();
    }, [statsTrigger]); // Refresh when stats update (new lead created)

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/leads');
            const data = await res.json();
            if (data.leads) {
                setLeads(data.leads);
            }
        } catch (error) {
            console.error('Failed to fetch leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuildItinerary = async (lead: Lead) => {
        setActiveLead(lead.id);

        const startDate = lead.start_date || new Date().toISOString().split('T')[0];
        const endDate = lead.end_date || new Date().toISOString().split('T')[0];

        // Pre-fill traveller details from the lead
        setTraveller({
            name: lead.name || '',
            phone: lead.phone || '',
            destination: lead.destination || '',
            startDate: startDate,
            endDate: endDate,
            paxCount: lead.travellers || 2
        });

        // Call the AI Generation API if destination exists
        if (lead.destination && lead.status !== 'shared') {
            setGeneratingId(lead.id);
            try {
                // Calculate days roughly
                const start = new Date(startDate);
                const end = new Date(endDate);
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                const res = await fetch('/api/itinerary/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        leadId: lead.id,
                        destination: lead.destination,
                        days: days > 0 ? days : 3,
                        travellers: lead.travellers || 2
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.itinerary?.days) {
                        setDays(data.itinerary.days);
                    }
                }
            } catch (error) {
                console.error("Failed to generate itinerary API:", error);
            } finally {
                setGeneratingId(null);
            }
        }

        // Navigate to Builder
        setView('builder');
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
    }

    if (leads.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground mb-4">No leads found yet.</p>
                <Button onClick={() => setView('lead-creation')}>Create Your First Lead</Button>
            </div>
        );
    }

    const handleStatusChange = async (lead: Lead, newStatus: string) => {
        if (lead.status === newStatus) return; // No change

        try {
            // Optimistic update
            setLeads(leads.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));

            await fetch('/api/actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_lead_status',
                    data: { lead_id: lead.id, status: newStatus }
                })
            });

            // Refresh stats
            triggerStatsUpdate();
        } catch (error) {
            console.error('Failed to update status', error);
            fetchLeads(); // Revert on error
        }
    };

    const handleDelete = async (leadId: string, leadName: string) => {
        if (!confirm(`Are you sure you want to delete ${leadName}? This action cannot be undone.`)) {
            return;
        }

        try {
            // Optimistic update
            setLeads(leads.filter(l => l.id !== leadId));

            await fetch('/api/actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete_lead',
                    data: { lead_id: leadId }
                })
            });

            // Refresh stats
            triggerStatsUpdate();
        } catch (error) {
            console.error('Failed to delete lead', error);
            fetchLeads(); // Revert on error
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Leads</h3>
            <div className="grid gap-3">
                {leads.sort((a, b) => {
                    // Sort pending first, then by date
                    if (a.status === 'shared' && b.status !== 'shared') return 1;
                    if (a.status !== 'shared' && b.status === 'shared') return -1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }).map((lead) => {
                    // status might be null for old records, so strict check 'shared'
                    const isShared = lead.status === 'shared';
                    return (
                        <Card
                            key={lead.id}
                            className={`transition-all border-none ${isShared ? 'bg-muted/30' : 'bg-card'}`}
                        >
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className={`font-bold text-lg ${isShared ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                {lead.name || 'Unknown Traveller'}
                                            </h4>
                                            {isShared && (
                                                <Badge variant="secondary" className="px-2 py-0.5 text-[10px] uppercase">
                                                    Completed
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                                            <Phone size={12} />
                                            <span>{lead.phone}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </div>

                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Select
                                                value={lead.status === 'shared' ? 'shared' : 'pending'}
                                                onValueChange={(value) => handleStatusChange(lead, value)}
                                            >
                                                <SelectTrigger className={`h-8 text-xs w-32 border-none ${isShared ? 'bg-green-100/50 text-green-700' : 'bg-orange-100/50 text-orange-700'}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                                                            <span>Pending</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="shared">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                                            <span>Completed</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        <span>{lead.destination || 'No Destination'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{lead.travellers} Pax</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1"
                                        size="sm"
                                        variant={isShared ? "outline" : "default"}
                                        onClick={() => handleBuildItinerary(lead)}
                                        disabled={generatingId === lead.id}
                                    >
                                        {generatingId === lead.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        {isShared ? 'Edit Itinerary' : 'Build Itinerary'}
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(lead.id, lead.name || 'this lead');
                                        }}
                                        title="Delete Lead"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
