import React, { useState, useEffect } from 'react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Mail, Link as LinkIcon } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ItineraryDocument } from '@/components/pdf/ItineraryDocument';
import { Itinerary } from '@/types/itinerary';
import { ImageGrid } from './ImageGrid';

export const ReviewSection: React.FC = () => {
    const { traveller, setTraveller, days, agent, setAgentProfile, triggerStatsUpdate, activeLeadId } = useItineraryStore();
    const [isClient, setIsClient] = useState(false);

    const handleShare = async (method: 'whatsapp' | 'email' | 'link') => {
        try {
            await fetch('/api/actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'log_share',
                    data: {
                        itinerary_id: activeLeadId || 'temp-id', // Link share to the Lead ID
                        shared_via: method,
                        created_by: null
                    }
                })
            });
            triggerStatsUpdate();

            // Actual share logic
            const destination = traveller.destination || 'your trip';
            const text = `Hello! Please find attached the travel itinerary PDF for ${destination}. Let me know if you need any changes!`;

            if (method === 'whatsapp') {
                // Use the lead's phone number if available
                const phone = traveller.phone?.replace(/\D/g, '') || '';
                const url = phone
                    ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
                    : `https://wa.me/?text=${encodeURIComponent(text)}`;

                // Open WhatsApp
                window.open(url, '_blank');

                // HACK: Trigger the PDF download button programmatically so the user has the file to attach
                // We'll add an ID to the download button to target it
                setTimeout(() => {
                    const downloadBtn = document.getElementById('pdf-download-btn');
                    if (downloadBtn) downloadBtn.click();
                    alert('WhatsApp opened! Please attach the downloaded PDF file to the chat.');
                }, 1000);

            } else if (method === 'email') {
                window.location.href = `mailto:?subject=Itinerary: ${destination}&body=${encodeURIComponent(text)}`;
            } else {
                navigator.clipboard.writeText(text);
                alert('Link copied to clipboard!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAgentProfile({ [name]: value });
    };

    const handleLogoChange = (images: string[]) => {
        setAgentProfile({ logoUrl: images[0] });
    };

    const itinerary: Itinerary = {
        id: 'temp',
        traveller,
        days,
        lastModified: Date.now()
    };

    // Safety check for client-side rendering of PDFDownloadLink to avoid hydration mismatch
    if (!isClient) return null;

    return (
        <Card className="w-full mb-8 border-t-4 border-primary">
            <CardHeader>
                <CardTitle className="text-lg font-semibold tracking-wide uppercase text-muted-foreground text-xs">Review & Share</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label className="text-primary font-bold">Trip Title / Destination Name</Label>
                    <Input
                        value={traveller.destination}
                        onChange={(e) => setTraveller({ destination: e.target.value })}
                        placeholder="e.g. 5 Days in Goa / Mumbai to Goa"
                        className="font-semibold text-lg"
                    />
                    <p className="text-[10px] text-muted-foreground">This title will appear at the top of the PDF.</p>
                </div>

                <div className="grid gap-2">
                    <Label>Agent / Company Name</Label>
                    <Input
                        name="companyName"
                        value={agent.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Wonderland Travels"
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Contact Details</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            name="contact"
                            value={agent.contact}
                            onChange={handleChange}
                            placeholder="Email / Web"
                        />
                        <Input
                            name="phone"
                            value={agent.phone || ''} // Handle undefined gracefully
                            onChange={handleChange}
                            placeholder="Phone Number"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Agency Logo (Optional)</Label>
                    <ImageGrid
                        images={agent.logoUrl ? [agent.logoUrl] : []}
                        onChange={handleLogoChange}
                        maxImages={1}
                    />
                </div>

                <div className="pt-4" key={itinerary.lastModified}>
                    <PDFDownloadLink
                        document={<ItineraryDocument itinerary={itinerary} agent={agent} />}
                        fileName={`Itinerary_${traveller.destination.replace(/\s+/g, '')}_${new Date().toISOString().slice(0, 10)}.pdf`}
                    >
                        {({ blob, url, loading, error }) => (
                            <Button id="pdf-download-btn" className="w-full h-12 text-lg font-bold shadow-lg" disabled={loading}>
                                {loading ? 'Preparing PDF...' : 'Download PDF Strategy'}
                            </Button>
                        )}
                    </PDFDownloadLink>
                    <p className="text-center text-[10px] text-muted-foreground mt-2">
                        PDF generated instantly on your device. No data is sent to any server.
                    </p>
                </div>

                <div className="pt-2 border-t mt-4">
                    <Label className="mb-2 block">Share Itinerary</Label>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 gap-2" onClick={() => handleShare('whatsapp')}>
                            <Share2 size={16} /> WhatsApp
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2" onClick={() => handleShare('email')}>
                            <Mail size={16} /> Email
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2" onClick={() => handleShare('link')}>
                            <LinkIcon size={16} /> Copy
                        </Button>
                    </div>
                </div>

                <div className="pt-4 mt-2">
                    <Button
                        variant="secondary"
                        className="w-full h-12 text-lg font-bold"
                        onClick={async () => {
                            // Mark as shared in DB
                            if (activeLeadId) {
                                try {
                                    await fetch('/api/actions', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            action: 'mark_lead_shared',
                                            data: { lead_id: activeLeadId }
                                        })
                                    });
                                    triggerStatsUpdate();
                                } catch (err) {
                                    console.error("Failed to update status", err);
                                }
                            }

                            // Return to Dashboard 
                            useItineraryStore.getState().setView('dashboard');
                        }}
                    >
                        Return to Dashboard
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
