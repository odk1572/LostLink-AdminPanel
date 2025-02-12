"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa"

const ClaimDetails = () => {
  const { claimId } = useParams()
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClaimDetails()
  }, []) // Removed unnecessary dependency 'id'

  const fetchClaimDetails = async () => {
    try {
      const response = await axios.get(`https://lostlink-adminpanel.onrender.com/api/v1/claims/admin/claims/${claimId}`)
      setClaim(response.data.data)
    } catch (error) {
      toast.error("Failed to fetch claim details")
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (window.confirm("Are you sure you want to withdraw this claim?")) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/claims/user/claims/withdraw/${claimId}`)
        toast.success("Claim withdrawn successfully")
        // Redirect to claims list or update state
      } catch (error) {
        toast.error("Failed to withdraw claim")
      }
    }
  }

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  if (!claim) {
    return <div className="text-center">Claim not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <Link to="/claims" className="flex items-center text-blue-400 hover:text-blue-300 mb-4">
        <FaArrowLeft className="mr-2" /> Back to Claims
      </Link>
      <h2 className="text-2xl font-bold mb-4">Claim Details</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Item Information</h3>
          <p>Title: {claim.item.title}</p>
          <p>Description: {claim.item.description}</p>
          <p>Category: {claim.item.category}</p>
          <p>Status: {claim.item.status}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Claim Information</h3>
          <p>Claim Status: {claim.claimStatus}</p>
          <p>Additional Details: {claim.additionalDetails}</p>
          <p>Submitted On: {new Date(claim.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Proof of Ownership</h3>
          <img src={claim.proof || "/placeholder.svg"} alt="Proof of Ownership" className="max-w-full h-auto rounded" />
        </div>
        {claim.claimStatus === "pending" && (
          <div className="flex space-x-4">
            <button onClick={handleWithdraw} className="btn btn-secondary flex items-center hover:bg-red-600">
              <FaTrash className="mr-2" /> Withdraw Claim
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClaimDetails

