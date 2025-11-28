import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { MapContainer, TileLayer, Polygon } from "react-leaflet"
import { useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import CustomButton from "../../_components/CustomButton"

const polygonCoords = [
  [1.344, 103.830],
  [1.360, 103.850],
  [1.372, 103.840],
  [1.382, 103.815],
  [1.360, 103.790],
  [1.345, 103.800],
]

export default function SCoverageMap() {
  useEffect(() => {
    // Fix Leaflet icon issue for Next.js
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
        <CardTitle className="flex justify-between gap-2 ">
         <div className="flex justify-center items-center gap-1">
             <MapPin size={20} />
            <span>  Service Coverage Map </span>
         </div>
         <CustomButton
                bgColor="#FFE16B60"
                borderColor="#FFE16B"
                indicatorColor="#27C840"
                text="Active Areas"
                onClick={() => console.log("Clicked!")}
              />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
          <MapContainer
            center={[1.355, 103.82]}
            zoom={12}
            scrollWheelZoom={true}
            className="h-full w-full -z-50"
          >
            {/* Real Map Layer */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />

            {/* Pink Polygon - matches your screenshot */}
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

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-white shadow rounded px-3 py-1 flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            Active Areas
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Interactive map showing service coverage areas across regions
        </p>
      </CardContent>
    </Card>
  )
}