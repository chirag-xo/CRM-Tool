
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { AgentProfile, Itinerary } from '@/types/itinerary';

// Professional Colors
// Professional Colors - Updated// Professional Colors
const PRIMARY_COLOR = '#0F172A'; // Slate 900
const ACCENT_COLOR = '#2563EB';  // Blue 600
const HEADER_BG = '#F0F9FF';     // Very light blue/cyan
const TEXT_MAIN = '#334155';     // Slate 700
const TEXT_LIGHT = '#64748B';    // Slate 500

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 0,
        fontFamily: 'Helvetica',
    },
    headerBox: {
        backgroundColor: HEADER_BG,
        padding: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Align to top
        borderBottom: `2px solid ${ACCENT_COLOR} `,
    },
    headerLeft: {
        flex: 1,
        marginRight: 20,
    },
    tripLabel: {
        fontSize: 10,
        color: ACCENT_COLOR,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 6,
    },
    tripTitle: {
        fontSize: 36,
        fontWeight: 'black', // Thicker font
        color: PRIMARY_COLOR,
        marginBottom: 12,
        lineHeight: 1.1,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 8,
    },
    metaItem: {
        fontSize: 10,
        color: TEXT_MAIN,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        border: `1px solid ${ACCENT_COLOR} 20`, // Subtle border
    },
    metaLabel: {
        color: TEXT_LIGHT,
        fontSize: 9,
        marginBottom: 2,
    },
    metaValue: {
        color: PRIMARY_COLOR,
        fontWeight: 'bold',
        fontSize: 10,
    },
    logo: {
        width: 100,
        height: 100,
        objectFit: 'contain',
        borderRadius: 8,
        backgroundColor: 'white',
        padding: 8,
        // Shadow effect simulation with border
        border: `1px solid ${TEXT_LIGHT} 20`,
    },
    agentStrip: {
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 40,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    agentText: {
        fontSize: 10,
        color: '#F8FAFC',
        fontWeight: 'medium',
    },
    body: {
        paddingVertical: 30,
        paddingHorizontal: 40,
    },
    dayRow: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    daySidebar: {
        width: 50,
        alignItems: 'center',
        marginRight: 20,
    },
    dayNumber: {
        fontSize: 42,
        fontWeight: 'heavy',
        color: '#E2E8F0',
        lineHeight: 1,
    },
    timelineLine: {
        width: 2,
        backgroundColor: '#E2E8F0',
        flex: 1,
        marginTop: 4,
        borderRadius: 1,
    },
    dayContent: {
        flex: 1,
        paddingBottom: 10,
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginBottom: 6,
    },
    dayHighlightsBox: {
        backgroundColor: '#F8FAFC',
        padding: 8,
        borderRadius: 4,
        marginBottom: 10,
        borderLeft: `3px solid ${ACCENT_COLOR} `,
    },
    dayHighlights: {
        fontSize: 10,
        color: TEXT_MAIN,
        lineHeight: 1.4,
    },
    dayDesc: {
        fontSize: 10,
        color: TEXT_LIGHT,
        lineHeight: 1.6,
        textAlign: 'justify',
        marginBottom: 10,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    pill: {
        fontSize: 9,
        color: TEXT_MAIN,
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    imageGrid: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 8,
    },
    dayImage: {
        width: 120,
        height: 80,
        objectFit: 'cover',
        borderRadius: 6,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderTop: '1px solid #E2E8F0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    footerText: {
        color: TEXT_LIGHT,
        fontSize: 8,
    }
});

interface ItineraryDocumentProps {
    itinerary: Itinerary;
    agent: AgentProfile;
}

export const ItineraryDocument: React.FC<ItineraryDocumentProps> = ({ itinerary, agent }) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerBox}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.tripLabel}>TRAVEL ITINERARY</Text>
                        <Text style={styles.tripTitle}>{itinerary.traveller.destination || 'Uncharted Destination'}</Text>

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Dates</Text>
                                <Text style={styles.metaValue}>{formatDate(itinerary.traveller.startDate)} - {formatDate(itinerary.traveller.endDate)}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Travellers</Text>
                                <Text style={styles.metaValue}>{itinerary.traveller.paxCount} Pax</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Prepared For</Text>
                                <Text style={styles.metaValue}>{itinerary.traveller.name}</Text>
                            </View>
                        </View>
                    </View>
                    {agent.logoUrl && (
                        <Image src={agent.logoUrl} style={styles.logo} />
                    )}
                </View>

                {/* Agent Strip */}
                <View style={styles.agentStrip}>
                    <Text style={styles.agentText}>Curated by: {agent.companyName || agent.name || 'Travel Expert'}</Text>
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        {agent.phone && <Text style={styles.agentText}>Ph: {agent.phone}</Text>}
                        <Text style={styles.agentText}>Email: {agent.contact}</Text>
                    </View>
                </View>

                {/* Body */}
                <View style={styles.body}>
                    {itinerary.days.map((day) => (
                        <View key={day.id} style={styles.dayRow} wrap={false}>
                            {/* Sidebar with big number */}
                            <View style={styles.daySidebar}>
                                <Text style={styles.dayNumber}>{String(day.dayNumber).padStart(2, '0')}</Text>
                                <View style={styles.timelineLine} />
                            </View>

                            {/* Main Content */}
                            <View style={styles.dayContent}>
                                <Text style={styles.dayTitle}>{day.title}</Text>

                                {day.visitingPlaces.length > 0 && (
                                    <View style={styles.dayHighlightsBox}>
                                        <Text style={styles.dayHighlights}>
                                            Highlights: {day.visitingPlaces.join(', ')}
                                        </Text>
                                    </View>
                                )}

                                <Text style={styles.dayDesc}>{day.description || 'Enjoy your day!'}</Text>

                                {(day.hotel?.name || day.vehicle?.type) && (
                                    <View style={styles.detailsRow}>
                                        {day.hotel?.name && (
                                            <Text style={styles.pill}>Stay: {day.hotel.name}</Text>
                                        )}
                                        {day.vehicle?.type && day.vehicle.type !== 'None' && (
                                            <Text style={styles.pill}>Cab: {day.vehicle.type}</Text>
                                        )}
                                    </View>
                                )}

                                {day.images && day.images.length > 0 && (
                                    <View style={styles.imageGrid}>
                                        {day.images.slice(0, 3).map((img, idx) => (
                                            <Image key={idx} src={img} style={styles.dayImage} />
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Payment Section */}
                {(agent.upiId || agent.paymentQrUrl) && (
                    <View style={{ marginHorizontal: 40, marginBottom: 20, padding: 15, backgroundColor: '#F0FDF4', borderRadius: 8, border: '1px solid #16A34A' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#166534', marginBottom: 8, textTransform: 'uppercase' }}>Payment Details</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {agent.paymentQrUrl && (
                                <Image src={agent.paymentQrUrl} style={{ width: 80, height: 80, marginRight: 20 }} />
                            )}
                            <View>
                                {agent.upiId && (
                                    <Text style={{ fontSize: 12, color: '#15803D', marginBottom: 4 }}>UPI ID: {agent.upiId}</Text>
                                )}
                                <Text style={{ fontSize: 10, color: '#166534' }}>Scan to pay via any UPI app</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Need assistance? Contact us at {agent.phone} or {agent.contact}</Text>
                    <Text style={styles.footerText}>Ref: {itinerary.id.slice(0, 8).toUpperCase()}</Text>
                </View>
            </Page>
        </Document>
    );
};

