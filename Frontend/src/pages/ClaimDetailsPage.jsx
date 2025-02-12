"use client"
import LostLinkSVG from "../components/LostLinkSvg"
import ClaimDetails from "../components/ClaimDetails"
const ClaimDetailsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <ClaimDetails />
      </main>
    </div>
  )
}

export default ClaimDetailsPage

