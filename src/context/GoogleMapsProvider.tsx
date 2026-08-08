import React, { createContext, useContext, useEffect, useState } from 'react';

const GoogleMapsContext = createContext<boolean>(false);

export const useGoogleMapsContext = () => useContext(GoogleMapsContext);

export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (window.google?.maps) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement('script');
        // Libraries: drawing (shapes), geometry (distance calc), places (address autocomplete)
        script.src = `https://maps.googleapis.com/maps/api/js?v=3.64&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=drawing,geometry,places`;
        script.async = true;

        script.onload = () => setIsLoaded(true);
        document.head.appendChild(script);
    }, []);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <GoogleMapsContext.Provider value={isLoaded}>
            {children}
        </GoogleMapsContext.Provider>
    );
};