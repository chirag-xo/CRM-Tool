import React from 'react';
import { DayActivity } from '@/types/itinerary';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageGrid } from './ImageGrid';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DayFormProps {
    day: DayActivity;
}

export const DayForm: React.FC<DayFormProps> = ({ day }) => {
    const { updateDay, removeDay } = useItineraryStore();

    const handleChange = (field: keyof DayActivity, value: any) => {
        updateDay(day.id, { [field]: value });
    };

    const handleDeepChange = (parent: 'vehicle' | 'hotel', field: string, value: string) => {
        // @ts-ignore
        updateDay(day.id, { [parent]: { ...day[parent], [field]: value } });
    };

    const handlePlacesChange = (val: string) => {
        const places = val.split('\n');
        handleChange('visitingPlaces', places);
    };

    return (
        <div className="space-y-4 p-1">
            <div className="grid gap-2">
                <Label>Day Title / Theme (Optional)</Label>
                <Input
                    value={day.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. Arrival & Sightseeing"
                />
            </div>

            <div className="grid gap-2">
                <Label>Visiting Places (One per line)</Label>
                <Textarea
                    value={day.visitingPlaces.join('\n')}
                    onChange={(e) => handlePlacesChange(e.target.value)}
                    placeholder="Place 1&#10;Place 2&#10;Place 3"
                />
            </div>

            <div className="grid gap-2">
                <Label>Description (Free Text)</Label>
                <Textarea
                    value={day.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Detailed description of the day's plan..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={day.vehicle?.type}
                        onChange={(e) => handleDeepChange('vehicle', 'type', e.target.value)}
                    >
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Tempo Traveller">Tempo Traveller</option>
                        <option value="Bus">Bus</option>
                        <option value="None">None</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Vehicle Details (Optional)</Label>
                    <Input
                        value={day.vehicle?.model}
                        onChange={(e) => handleDeepChange('vehicle', 'model', e.target.value)}
                        placeholder="e.g. Innova Crysta"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Hotel Name</Label>
                    <Input
                        value={day.hotel?.name}
                        onChange={(e) => handleDeepChange('hotel', 'name', e.target.value)}
                        placeholder="e.g. Hotel Grand"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={day.hotel?.category}
                        onChange={(e) => handleDeepChange('hotel', 'category', e.target.value)}
                    >
                        <option value="">Select...</option>
                        <option value="3 Star">3 Star</option>
                        <option value="4 Star">4 Star</option>
                        <option value="5 Star">5 Star</option>
                        <option value="Resort">Resort</option>
                        <option value="Homestay">Homestay</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Images (Max 4)</Label>
                <ImageGrid images={day.images} onChange={(imgs) => handleChange('images', imgs)} />
            </div>

            <div className="pt-2">
                <Button variant="destructive" size="sm" onClick={() => removeDay(day.id)} className="w-full text-white">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Day
                </Button>
            </div>
        </div>
    );
};
