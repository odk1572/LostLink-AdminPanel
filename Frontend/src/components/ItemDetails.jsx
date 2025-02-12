"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { UserContext } from "../../UserContextProvider"
import ItemMap from "./ItemMap"

const ItemDetails = () => {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isImageOpen, setIsImageOpen] = useState(false) // Image modal state
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/item/${id}`)
        setItem(response.data.data)
        setLoading(false)
      } catch (error) {
        toast.error("Failed to fetch item details")
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  const handleClaim = () => {
    navigate(`/items/${id}/claim`)
  }

  const handleEdit = () => {
    navigate(`/items/${id}/edit`)
  }

  if (loading) {
    return <div className="text-center text-white">Loading...</div>
  }

  if (!item) {
    return <div className="text-center text-white">Item not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Clickable Image */}
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-64 object-cover cursor-pointer hover:opacity-80 transition"
          onClick={() => setIsImageOpen(true)}
        />

        <div className="p-6">
          <h2 className="text-3xl font-bold text-white mb-4">{item.title}</h2>
          <p className="text-gray-300 mb-4">{item.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Category</h3>
              <p className="text-gray-400">{item.category}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.status === "lost" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
              >
                {item.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Item Location Map (Hidden when image modal is open) */}
          {!isImageOpen && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
              <ItemMap latitude={item.location.latitude} longitude={item.location.longitude} />
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={handleClaim}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Claim Item
            </button>
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Edit Item
            </button>
          </div>
        </div>
      </div>

      {/* Full-Size Image Modal (Hides the map when open) */}
      {isImageOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsImageOpen(false)}
        >
          <div className="relative max-w-3xl w-full p-4">
            <button
              className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full text-lg font-bold hover:bg-gray-200"
              onClick={() => setIsImageOpen(false)}
            >
              ✕
            </button>
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemDetails
