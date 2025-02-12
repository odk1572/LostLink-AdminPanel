"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { UserContext } from "../../UserContextProvider"
import { FaEnvelope, FaPhone, FaCalendar, FaCrown } from "react-icons/fa"

const UserProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useContext(UserContext)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/auth/c/${userId}`)
        setProfile(response.data.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast.error("Failed to fetch user profile")
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserProfile()
    } else {
      toast.error("Invalid user profile request")
      navigate("/")
    }
  }, [userId, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h2 className="text-2xl font-bold">User not found</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-black opacity-30"></div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={profile.avatar || "https://via.placeholder.com/150"}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              {profile.role === "admin" && (
                <div className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-1">
                  <FaCrown className="text-gray-900" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pt-20 pb-8 px-6 text-center">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-xl text-gray-400">{profile.role}</p>
        </div>
        <div className="border-t border-gray-700">
          <dl className="divide-y divide-gray-700">
            <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-400 flex items-center">
                <FaEnvelope className="mr-2" /> Email
              </dt>
              <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{profile.email}</dd>
            </div>
            <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-400 flex items-center">
                <FaPhone className="mr-2" /> Phone
              </dt>
              <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{profile.phone}</dd>
            </div>
            <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-400 flex items-center">
                <FaCalendar className="mr-2" /> Joined
              </dt>
              <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                {new Date(profile.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
        {currentUser && (currentUser._id === profile._id || currentUser.role === "admin") && (
          <div className="px-6 py-4 border-t border-gray-700">
            <button
              onClick={() => navigate(`/edit-profile/${profile._id}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile

