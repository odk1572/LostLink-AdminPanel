"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { AiOutlineClose } from "react-icons/ai"

const ItemMap = ({ latitude, longitude }) => {
  const mapRef = useRef(null)
  const fullMapRef = useRef(null)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Function to initialize the map
  const initializeMap = (containerRef) => {
    if (containerRef.current) {
      const map = L.map(containerRef.current).setView([latitude, longitude], 13)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      L.marker([latitude, longitude]).addTo(map)

      return map
    }
  }

  useEffect(() => {
    if (!isFullScreen) {
      const map = initializeMap(mapRef)
      return () => {
        if (map) map.remove()
      }
    }
  }, [latitude, longitude, isFullScreen])

  useEffect(() => {
    let fullMap
    if (isFullScreen) {
      fullMap = initializeMap(fullMapRef)
    }
    return () => {
      if (fullMap) fullMap.remove()
    }
  }, [isFullScreen, latitude, longitude])

  return (
    <>
      {/* Small Map View - Hidden when Full-Screen is Active */}
      {!isFullScreen && (
        <div
          ref={mapRef}
          className="h-64 rounded-lg cursor-pointer hover:opacity-80 transition"
          onClick={() => setIsFullScreen(true)}
        />
      )}

      {/* Full-Screen Map Modal */}
      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsFullScreen(false)}
        >
          <div className="relative w-full max-w-5xl h-[80vh] p-4">
          <button
              className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full text-lg font-bold hover:bg-gray-200"
              onClick={() => setIsFullScreen(false)}
            >
              <AiOutlineClose className="w-6 h-6" />
            </button>
            
            <div ref={fullMapRef} className="w-full h-full rounded-lg overflow-hidden" />
          </div>
        </div>
      )}
    </>
  )
}

export default ItemMap
