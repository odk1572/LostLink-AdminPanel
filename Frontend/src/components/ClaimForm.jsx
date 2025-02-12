"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { FaUpload } from "react-icons/fa"

const ClaimForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [additionalDetails, setAdditionalDetails] = useState("")
  const [proofDocument, setProofDocument] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProofDocument(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!proofDocument) {
      toast.error("Please upload a proof document")
      return
    }

    const formData = new FormData()
    formData.append("additionalDetails", additionalDetails)
    formData.append("proofDocument", proofDocument)

    try {
      const response = await axios.post(`http://localhost:8000/api/v1/claims/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (response.status === 201) {
        toast.success("Claim submitted successfully!")
        navigate("/dashboard")
      } else {
        toast.error("Unexpected response from the server")
      }
    } catch (error) {
      console.error("Claim submission error:", error.response?.data) // Debugging log
      toast.error(error.response?.data?.message || "Only Lost Items Can be Claimed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Submit a Claim</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="additionalDetails" className="block mb-1">
            Additional Details
          </label>
          <textarea
            id="additionalDetails"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded"
            rows="4"
          ></textarea>
        </div>
        <div>
          <label htmlFor="proofDocument" className="block mb-1">
            Proof of Ownership
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              id="proofDocument"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="proofDocument"
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2"
            >
              <FaUpload />
              <span>Upload File</span>
            </label>
            {proofDocument && <span className="text-sm">{proofDocument.name}</span>}
          </div>
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
          Submit Claim
        </button>
      </form>
    </div>
  )
}

export default ClaimForm
