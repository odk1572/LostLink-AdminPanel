"use client"
import LostLinkSVG from "../components/LostLinkSvg"
import ClaimForm from "../components/ClaimForm"


const ClaimFormPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <ClaimForm />
      </main>
    </div>
  )
}

export default ClaimFormPage

