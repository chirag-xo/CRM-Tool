import React from 'react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DayForm } from './DayForm';

export const DayList: React.FC = () => {
    const { days, addDay } = useItineraryStore();

    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold tracking-wide uppercase text-muted-foreground text-xs">Step 2: Itinerary Builder</h2>
                <Button onClick={addDay} size="sm" className="gap-2">
                    <Plus size={16} /> Add Day
                </Button>
            </div>

            {days.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/20">
                    <p className="mb-2">No days added yet.</p>
                    <Button variant="outline" onClick={addDay}>Start Day 1</Button>
                </div>
            ) : (
                <Accordion type="single" collapsible className="w-full space-y-2">
                    {days.map((day) => (
                        <AccordionItem key={day.id} value={day.id} className="border rounded-md px-2 bg-card">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex flex-col text-left">
                                    <span className="font-semibold text-sm">Day {day.dayNumber}: {day.title}</span>
                                    <span className="text-[10px] text-muted-foreground font-normal truncate max-w-[200px]">
                                        {day.visitingPlaces.length > 0 ? day.visitingPlaces.join(', ') : 'No places added'}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <DayForm day={day} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
};
