"use client"

import { useState, useContext } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import LostLinkSVG from "./LostLinkSvg"
import { UserContext } from "../../UserContextProvider"

const UpdateAvatar = () => {
  const { user, setUser } = useContext(UserContext)
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error("Please select an image file")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("avatar", file)

    try {
      const response = await axios.patch("http://localhost:8000/api/v1/auth/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      if (response.data.success) {
        setUser({ ...user, avatar: response.data.data.avatar })
        toast.success("Avatar updated successfully")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update avatar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <LostLinkSVG className="mx-auto h-12 w-auto" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Update Your Avatar</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-300">
                Choose a new avatar
              </label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  {user?.avatar ? (
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt="Current avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !file}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update Avatar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateAvatar

