"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { UserContext } from "../context/UserContext"

const Logout = () => {
  const { setUser, setUserAuth } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/logout")
      if (response.data.success) {
        setUser(null)
        setUserAuth(false)
        toast.success("Logged out successfully")
        navigate("/login")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to logout")
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Logout
    </button>
  )
}

export default Logout

