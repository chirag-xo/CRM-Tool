import React from 'react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const TravellerForm: React.FC = () => {
    const { traveller, setTraveller, triggerStatsUpdate, setView } = useItineraryStore();

    const handleSave = async () => {
        try {
            await fetch('/api/actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_lead',
                    data: {
                        traveller_name: traveller.name,
                        from_location: traveller.from_location,
                        destination: traveller.destination,
                        phone: traveller.phone,
                        startDate: traveller.startDate,
                        endDate: traveller.endDate,
                        purpose: traveller.purpose,
                        paxCount: traveller.paxCount,
                        created_by: null // Or valid UUID if auth exists
                    }
                })
            });
            triggerStatsUpdate();
            // Redirect to Dashboard after successful lead creation
            setView('dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTraveller({ [name]: value });
    };

    return (
        <Card className="w-full mb-6 relative overflow-hidden">
            {/* Decorative stripe */}
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

            <CardHeader>
                <CardTitle className="text-lg font-semibold tracking-wide uppercase text-muted-foreground text-xs">Create New Lead</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div>
                    <Label htmlFor="name">Traveller Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={traveller.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe & Family"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={traveller.phone || ''}
                        onChange={handleChange}
                        placeholder="e.g. +91 9999999999"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="from_location">From</Label>
                    <Input
                        id="from_location"
                        name="from_location" // Changed from 'from' to match store
                        value={traveller.from_location || ''}
                        onChange={handleChange}
                        placeholder="e.g. Mumbai"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                        id="destination"
                        name="destination"
                        value={traveller.destination}
                        onChange={handleChange}
                        placeholder="e.g. Kerala, India"
                        className="mt-1"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                            id="startDate"
                            name="startDate"
                            type="date"
                            value={traveller.startDate}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={traveller.endDate}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="purpose">Purpose (Optional)</Label>
                        <Input
                            id="purpose"
                            name="purpose"
                            value={traveller.purpose}
                            onChange={handleChange}
                            placeholder="e.g. Honeymoon"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="paxCount">Pax Count (Optional)</Label>
                        <Input
                            id="paxCount"
                            name="paxCount"
                            type="number"
                            value={traveller.paxCount}
                            onChange={(e) => setTraveller({ paxCount: parseInt(e.target.value) || 0 })}
                            placeholder="2"
                            className="mt-1"
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} size="lg" className="w-full sm:w-auto font-bold shadow-md">
                        Save & Continue
                    </Button>
                </div>
            </CardContent>
        </Card >
    );
};
