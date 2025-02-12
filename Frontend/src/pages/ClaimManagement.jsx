"use client"

import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { UserContext } from "../../UserContextProvider"
import { FaCheck, FaTimes, FaTrash, FaEye } from "react-icons/fa"
import { Link } from "react-router-dom"

const ClaimManagement = () => {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(UserContext)

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/claims/admin/claims")
        setClaims(response.data.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching claims:", error)
        toast.error("Failed to fetch claims")
        setLoading(false)
      }
    }

    fetchClaims()
  }, [user])

  const handleUpdateClaimStatus = async (claimId, status) => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/claims/admin/claims/status/${claimId}`, { status })
      setClaims(claims.map((claim) => (claim._id === claimId ? { ...claim, claimStatus: status } : claim)))
      toast.success(`Claim ${status} successfully`)
    } catch (error) {
      console.error("Error updating claim status:", error)
      toast.error("Failed to update claim status")
    }
  }

  const handleDeleteClaim = async (claimId) => {
    if (window.confirm("Are you sure you want to delete this claim?")) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/claims/admin/claims/${claimId}`)
        setClaims(claims.filter((claim) => claim._id !== claimId))
        toast.success("Claim deleted successfully")
      } catch (error) {
        console.error("Error deleting claim:", error)
        toast.error("Failed to delete claim")
      }
    }
  }

  if (loading) {
    return <div className="text-center text-white text-2xl mt-10">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Claim Management</h1>
      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Claimed By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {claims.map((claim) => (
                <tr key={claim._id} className="text-sm md:text-base">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {claim.item ? (
                      <>
                        <div className="text-white">{claim.item.title}</div>
                        <div className="text-gray-400 hidden md:block">{claim.item.description?.substring(0, 50)}...</div>
                      </>
                    ) : (
                      <div className="text-red-400">Item not available</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-white">{claim.claimedBy.name}</div>
                    <div className="text-gray-400 hidden md:block">{claim.claimedBy.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        claim.claimStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : claim.claimStatus === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {claim.claimStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-wrap gap-2">
                    {claim.claimStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateClaimStatus(claim._id, "approved")}
                          className="text-green-400 hover:text-green-300"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleUpdateClaimStatus(claim._id, "rejected")}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDeleteClaim(claim._id)} className="text-red-400 hover:text-red-300">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ClaimManagement
