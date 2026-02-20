import React, { useState, useEffect } from 'react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Mail, Link as LinkIcon, Loader2 } from 'lucide-react';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { ItineraryDocument } from '@/components/pdf/ItineraryDocument';
import { Itinerary } from '@/types/itinerary';
import { ImageGrid } from './ImageGrid';

export const ReviewSection: React.FC = () => {
    const { traveller, setTraveller, days, agent, setAgentProfile, triggerStatsUpdate, activeLeadId } = useItineraryStore();
    const [isClient, setIsClient] = useState(false);

    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async (method: 'whatsapp' | 'email' | 'link') => {
        try {
            setIsSharing(true);

            // 1. Generate PDF dynamically
            const doc = <ItineraryDocument itinerary={itinerary} agent={agent} />;
            const asPdf = pdf(doc);
            const blob = await asPdf.toBlob();

            // 2. Upload to secure Next.js API route
            const formData = new FormData();
            formData.append('pdf', blob, `Itinerary_${traveller.destination.replace(/\s+/g, '')}.pdf`);

            const uploadRes = await fetch('/api/upload-pdf', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) {
                const errData = await uploadRes.json();
                throw new Error(errData.error || 'Upload failed');
            }

            const { publicUrl } = await uploadRes.json();

            // 4. Record share stats
            await fetch('/api/actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'log_share',
                    data: {
                        itinerary_id: activeLeadId || 'temp-id',
                        shared_via: method,
                        created_by: null
                    }
                })
            });
            triggerStatsUpdate();

            // 5. Build share text with URL
            const destination = traveller.destination || 'your trip';
            const text = `Hello! Please find the travel itinerary for ${destination} here: ${publicUrl} Let me know if you need any changes!`;

            if (method === 'whatsapp') {
                const phone = traveller.phone?.replace(/\D/g, '') || '';
                const url = phone
                    ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
                    : `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            } else if (method === 'email') {
                window.location.href = `mailto:?subject=Itinerary: ${destination}&body=${encodeURIComponent(text)}`;
            } else {
                navigator.clipboard.writeText(text);
                alert('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Share Error:', error);
            alert('Failed to share itinerary. Please try downloading it instead.');
        } finally {
            setIsSharing(false);
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

                <div className="pt-2 border-t mt-2">
                    <Label className="mb-2 block font-semibold text-primary">Payment Details (Optional)</Label>
                    <div className="grid gap-2">
                        <div>
                            <Label className="text-xs">UPI ID</Label>
                            <Input
                                name="upiId"
                                value={agent.upiId || ''}
                                onChange={handleChange}
                                placeholder="e.g. merchant@upi"
                            />
                        </div>
                        <div>
                            <Label className="text-xs">Payment QR Code</Label>
                            <ImageGrid
                                images={agent.paymentQrUrl ? [agent.paymentQrUrl] : []}
                                onChange={(images) => setAgentProfile({ paymentQrUrl: images[0] })}
                                maxImages={1}
                            />
                        </div>
                    </div>
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
                        <Button variant="outline" className="flex-1 gap-2" onClick={() => handleShare('whatsapp')} disabled={isSharing}>
                            {isSharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />} WhatsApp
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2" onClick={() => handleShare('link')} disabled={isSharing}>
                            {isSharing ? <Loader2 size={16} className="animate-spin" /> : <LinkIcon size={16} />} Copy
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
