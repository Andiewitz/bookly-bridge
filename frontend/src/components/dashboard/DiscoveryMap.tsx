'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Music2, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';

declare const google: any;

interface DiscoveryMapProps {
    gigs: any[];
    onApply: (post: any) => void;
}

export const DiscoveryMap = ({ gigs, onApply }: DiscoveryMapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [infoWindow, setInfoWindow] = useState<any>(null);

    useEffect(() => {
        if (!mapRef.current || typeof google === 'undefined') return;

        // Center on NYC as default
        const nyc = { lat: 40.7128, lng: -74.0060 };

        const initializedMap = new google.maps.Map(mapRef.current, {
            center: nyc,
            zoom: 12,
            styles: darkMapStyle,
            disableDefaultUI: true,
            zoomControl: true,
        });

        // Initialize reusable InfoWindow
        const iWindow = new google.maps.InfoWindow();
        setInfoWindow(iWindow);
        setMap(initializedMap);

        return () => {
            // Clean up markers if component unmounts
            markers.forEach(m => m.setMap(null));
        };
    }, []);

    useEffect(() => {
        if (!map || !gigs || typeof google === 'undefined') return;

        // Clear existing markers
        markers.forEach(m => m.setMap(null));

        const newMarkers = gigs.map(gig => {
            if (!gig.location_lat || !gig.location_lng) return null;

            const position = {
                lat: parseFloat(gig.location_lat),
                lng: parseFloat(gig.location_lng)
            };

            const marker = new google.maps.Marker({
                position,
                map,
                title: gig.title,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#FF8C00',
                    fillOpacity: 0.9,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                    scale: 10,
                },
            });

            marker.addListener('click', () => {
                const content = `
                    <div style="padding: 12px; color: black; font-family: sans-serif; min-width: 200px;">
                        <h4 style="margin: 0 0 4px 0; font-weight: 800; text-transform: uppercase;">${gig.title}</h4>
                        <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${gig.venue_name || 'The Venue'}</p>
                        <div style="font-size: 11px; display: flex; flex-direction: column; gap: 4px;">
                            <span>📅 ${gig.date}</span>
                            <span>⏰ ${gig.time}</span>
                            <span>💰 ${gig.pay}</span>
                        </div>
                    </div>
                `;
                infoWindow.setContent(content);
                infoWindow.open(map, marker);
            });

            return marker;
        }).filter(Boolean);

        setMarkers(newMarkers);

        // Adjust bounds if there are markers
        if (newMarkers.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            newMarkers.forEach(m => bounds.extend(m.getPosition()));
            map.fitBounds(bounds);
        }

    }, [map, gigs, infoWindow]);

    return (
        <div className="relative w-full h-[500px] rounded-3xl overflow-hidden border border-[#2A2A2A] shadow-2xl group">
            <div ref={mapRef} className="w-full h-full bg-[#121212]" />
            <div className="absolute top-6 left-6 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 pointer-events-none transition-all group-hover:bg-[#ff8c00] group-hover:text-black">
                <MapPin className="size-4 animate-pulse" />
                <span className="text-[10px] uppercase font-black tracking-widest">Live Gig Radar</span>
            </div>
        </div>
    );
};

// Premium Dark Mode Style for Google Maps
const darkMapStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#121212" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
    { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#1a1a1a" }] },
    { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#2a2a2a" }] },
    { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#1a1a1a" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3a3a3a" }] },
    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
    { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
    { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0a0a0a" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
    { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
];
