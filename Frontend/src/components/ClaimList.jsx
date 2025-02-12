"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { FaEye, FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"

const ClaimList = () => {
  const [claims, setClaims] = useState([])

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const response = await axios.get("https://lostlink-adminpanel.onrender.com/api/v1/claims/admin/claims")
      setClaims(response.data.data)
    } catch (error) {
      toast.error("Failed to fetch claims")
    }
  }

  const handleWithdraw = async (claimId) => {
    try {
      await axios.delete(`https://lostlink-adminpanel.onrender.com/api/v1/claims/user/claims/withdraw/${claimId}`)
      toast.success("Claim withdrawn successfully")
      fetchClaims()
    } catch (error) {
      toast.error("Failed to withdraw claim")
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">View All Claims</h2>
      {claims.length === 0 ? (
        <p>You haven't made any claims yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {claims.map((claim) => (
            <div key={claim._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">
                {claim.item ? claim.item.title : "Unknown Item"}
              </h3>
              <p className="text-sm text-gray-400 mb-2">Status: {claim.claimStatus}</p>
              <div className="flex justify-between items-center mt-4">
                {claim.item ? (
                  <Link to={`/claims/${claim._id}`} className="text-blue-400 hover:text-blue-300">
                    <FaEye className="inline mr-1" /> View Details
                  </Link>
                ) : (
                  <span className="text-gray-500">No Details Available</span>
                )}
                {claim.claimStatus === "pending" && (
                  <button onClick={() => handleWithdraw(claim._id)} className="text-red-400 hover:text-red-300">
                    <FaTrash className="inline mr-1" /> Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClaimList


