"use client"

import { useEffect, useState, useContext } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./index.css"
import { UserContext } from "../UserContextProvider"
import axios from "axios"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Dashboard from "./pages/Dashboard"
import ClaimDetailsPage from "./pages/ClaimDetailsPage"
import ClaimFormPage from "./pages/ClaimFormPage"
import Home from "./pages/Home"
import UpdateAccount from "./components/UpdateAccount"
import UpdateAvatar from "./components/UpdateAvatar"
import ClaimForm from "./components/ClaimForm"
import ClaimList from "./components/ClaimList"
import UserProfile from "./components/UserProfile"
import Navbar from "./pages/Navbar"
import Settings from "./pages/Settings"
import UserProfilePage from "./pages/UserProfilePage"

import Login from "./components/Login"
import ItemMap from "./components/ItemMap"
import ItemList from "./components/ItemList"
import ItemDetails from "./components/ItemDetails"
import ItemCard from "./components/ItemCard"
import EditItemForm from "./components/EditItemForm"
import CreateItem from "./components/CreateItem"
import ClaimDetails from "./components/ClaimDetails"
import Footer from "./pages/Footer"
import UserManagement from "./pages/UserManagement"
import ClaimManagement from "./pages/ClaimManagement"
import PClaimDetails from "./pages/PClaimDetails"

const App = () => {
  const { userAuth, setUserAuth, setUser } = useContext(UserContext)
  const [loading, setLoading] = useState(true)

  axios.defaults.withCredentials = true

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`https://lostlink-adminpanel.onrender.com/api/v1/auth/current-user`, {
        withCredentials: true,
      })
      if (response?.data?.success) {
        setUser(response.data.user)
        setUserAuth(true)
      } else {
        setUser(null)
        setUserAuth(false)
      }
    } catch (error) {
      console.error(error.message)
      setUser(null)
      setUserAuth(false)
    }
  }

  useEffect(() => {
    console.log(userAuth)
    setLoading(true)
    getUserInfo().finally(() => setLoading(false))
  }, [userAuth]) // Added userAuth to dependencies

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Loading...</div>
  }

  return (
    
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/items" 
        element={userAuth ? <ItemList/> : <Navigate to="/login" />} 
        />
        <Route path="/upload" 
        element={userAuth ? <CreateItem/> : <Navigate to="/login" />} 
        />
        <Route path="/settings" 
        element={userAuth ? <Settings/> : <Navigate to="/login" />} 
        />
         <Route path="/profile" 
        element={userAuth ? <UserProfilePage/> : <Navigate to="/login" />} 
        />
        <Route path="/user/:userId" 
        element={userAuth ? <UserProfile/> : <Navigate to="/login" />} 
        />
          <Route path="/all-users" 
        element={userAuth ? <UserManagement/> : <Navigate to="/login" />} 
        />
        <Route path="/all-claims" 
        element={userAuth ? <ClaimManagement/> : <Navigate to="/login" />} 
        />
        
       
         <Route path="/items/:id/claim" 
        element={userAuth ? <ClaimFormPage/> : <Navigate to="/login" />} 
        />
         <Route path="/items/:id/edit" 
        element={userAuth ? <EditItemForm/> : <Navigate to="/login" />} 
        />
        <Route path="/claims/:claimId" 
        element={userAuth ? <ClaimDetailsPage/> : <Navigate to="/login" />} 
        />
        <Route path="/dashboard" 
        element={userAuth ? <Dashboard/> : <Navigate to="/login" />} 
        />
        <Route path="/claims" 
        element={userAuth ? <ClaimList /> : <Navigate to="/login" />} 
        />
        </Routes>
        <Footer/>
      </div>
    </Router>
  )
}

export default App

