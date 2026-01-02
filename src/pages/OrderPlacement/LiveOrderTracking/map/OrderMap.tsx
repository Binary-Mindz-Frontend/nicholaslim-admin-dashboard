/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { useMemo } from 'react';

const containerStyle = { width: '100%', height: '400px', borderRadius: '12px' };

const OrderMap = ({ destinations }: { destinations: any[] }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        // googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        googleMapsApiKey: "AIzaSyDUEEC9Rx0I26QEc88zOTKjxOGVqTgw9VQ"
    });

    // Calculate the center based on the first destination
    const center = useMemo(() => ({
        lat: destinations[0]?.latitude || 0,
        lng: destinations[0]?.longitude || 0
    }), [destinations]);

    // Create path for the line connecting points
    const path = destinations.map(d => ({ lat: d.latitude, lng: d.longitude }));

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
            {destinations.map((dest, index) => (
                <Marker 
                    key={dest.id} 
                    position={{ lat: dest.latitude, lng: dest.longitude }}
                    label={(index + 1).toString()}
                    title={dest.type === "SENDER" ? "Pickup" : "Drop-off"}
                    // Optional: Custom icons for Sender vs Recipient
                    icon={dest.type === "SENDER" 
                        ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" 
                        : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
                />
            ))}
            <Polyline path={path} options={{ strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 2 }} />
        </GoogleMap>
    );
};

export default OrderMap;