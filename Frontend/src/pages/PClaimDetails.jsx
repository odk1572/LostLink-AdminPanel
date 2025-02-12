"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { UserContext } from "../../UserContextProvider"
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaFileAlt, FaCheck, FaTimes } from "react-icons/fa"

const PClaimDetails = () => {
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)
  const { claimId } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user?.role !== "admin") {
      toast.error("Access denied. Admins only.")
      navigate("/")
      return
    }

    const fetchClaimDetails = async () => {
      try {
        const response = await axios.get(`https://lostlink-adminpanel.onrender.com/api/v1/claims/admin/claims/${claimId}`)
        setClaim(response.data.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching claim details:", error)
        toast.error("Failed to fetch claim details")
        setLoading(false)
      }
    }

    fetchClaimDetails()
  }, [claimId, user, navigate])

  const handleUpdateClaimStatus = async (status) => {
    try {
      await axios.patch(`https://lostlink-adminpanel.onrender.com/api/v1/claims/admin/claims/status/${claimId}`, { status })
      setClaim({ ...claim, claimStatus: status })
      toast.success(`Claim ${status} successfully`)
    } catch (error) {
      console.error("Error updating claim status:", error)
      toast.error("Failed to update claim status")
    }
  }

  const handleDeleteClaim = async () => {
    if (window.confirm("Are you sure you want to delete this claim?")) {
      try {
        await axios.delete(`https://lostlink-adminpanel.onrender.com/api/v1/claims/admin/claims/${claimId}`)
        toast.success("Claim deleted successfully")
        navigate("/admin/claims")
      } catch (error) {
        console.error("Error deleting claim:", error)
        toast.error("Failed to delete claim")
      }
    }
  }

  if (loading) {
    return <div className="text-center text-white text-2xl mt-10">Loading...</div>
  }

  if (!claim) {
    return <div className="text-center text-white text-2xl mt-10">Claim not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Claim Details</h1>
      <div className="bg-gray-900 rounded-lg overflow-hidden p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Item Information</h2>
            <p className="text-gray-300">
              <span className="font-semibold">Title:</span> {claim.item.title}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Description:</span> {claim.item.description}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Category:</span> {claim.item.category}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Status:</span> {claim.item.status}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Claimant Information</h2>
            <p className="text-gray-300">
              <FaUser className="inline-block mr-2" /> {claim.claimedBy.name}
            </p>
            <p className="text-gray-300">
              <FaEnvelope className="inline-block mr-2" /> {claim.claimedBy.email}
            </p>
            <p className="text-gray-300">
              <FaPhone className="inline-block mr-2" /> {claim.claimedBy.phone}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Claim Information</h2>
          <p className="text-gray-300">
            <span className="font-semibold">Status:</span> {claim.claimStatus}
          </p>
          <p className="text-gray-300">
            <FaCalendar className="inline-block mr-2" /> Submitted on: {new Date(claim.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-300">
            <FaFileAlt className="inline-block mr-2" /> Additional Details: {claim.additionalDetails}
          </p>
          <div className="mt-4">
            <p className="text-gray-300 font-semibold">Proof Document:</p>
            <img
              src={claim.proof || "/placeholder.svg"}
              alt="Proof Document"
              className="max-w-full h-auto mt-2 rounded-lg"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center">
          {claim.claimStatus === "pending" && (
            <div>
              <button
                onClick={() => handleUpdateClaimStatus("approved")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                <FaCheck className="inline-block mr-1" /> Approve
              </button>
              <button
                onClick={() => handleUpdateClaimStatus("rejected")}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                <FaTimes className="inline-block mr-1" /> Reject
              </button>
            </div>
          )}
          <button
            onClick={handleDeleteClaim}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Delete Claim
          </button>
        </div>
      </div>
    </div>
  )
}

export default PClaimDetails

