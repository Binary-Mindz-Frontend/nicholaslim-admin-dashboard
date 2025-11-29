"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { MapContainer, TileLayer, Polygon } from "react-leaflet"
import { useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import CustomButton from "../../_components/CustomButton"
import type { LatLngTuple } from "leaflet"

const polygonCoords: LatLngTuple[] = [
  [1.344, 103.830],
  [1.360, 103.850],
  [1.372, 103.840],
  [1.382, 103.815],
  [1.360, 103.790],
  [1.345, 103.800],
]

export default function SCoverageMap() {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between gap-2">
          <div className="flex justify-center items-center gap-1">
            <MapPin size={20} />
            <span>Service Coverage Map</span>
          </div>

          <CustomButton
            bgColor="#FFE16B60"
            borderColor="#FFE16B"
            indicatorColor="#27C840"
            text="Active Areas"
            click={() => console.log("Clicked!")}
          />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
          <MapContainer
            center={[1.355, 103.82]}
            zoom={12}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />

            {/* Polygon */}
            <Polygon
              positions={polygonCoords}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#fca5a5",
                fillOpacity: 0.45,
                weight: 2,
              }}
            />
          </MapContainer>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Interactive map showing service coverage areas across regions
        </p>
      </CardContent>
    </Card>
  )
}
