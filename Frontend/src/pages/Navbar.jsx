"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../../UserContextProvider"
import LostLinkSVG from "../components/LostLinkSvg"
import { FaHome, FaUserPlus, FaSignInAlt, FaCog, FaUsers, FaSignOutAlt, FaUpload , FaTachometerAlt, FaClipboardList, FaTasks, FaFileAlt, FaShieldVirus} from "react-icons/fa"
import axios from "axios"

const Navbar = () => {
  const { user, userAuth, setUser, setUserAuth } = useContext(UserContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post("https://lostlink-adminpanel.onrender.com/api/v1/auth/logout")
      setUser(null)
      setUserAuth(false)
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <nav className=" bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <LostLinkSVG className="h-8 w-8" />
            </Link>
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-md tracking-wide ">
  Admin Panel
</span>
 {/* Admin Panel Text */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" icon={<FaHome />} text="Home" />
                {!userAuth && (
                  <>
                    <NavLink to="/login" icon={<FaSignInAlt />} text="Login" />
                  </>
                )}
                {userAuth && (
                  <>
                    <NavLink to="/dashboard" icon={<FaTachometerAlt />} text="Dashboard" />
                    <NavLink to="/settings" icon={<FaCog />} text="Settings" />
                    <NavLink to="/upload" icon={<FaUpload />} text="Upload Item" />
                    <NavLink to="/all-users" icon={<FaUsers />} text="Manage All Users" />
                    <NavLink to="/all-claims" icon={<FaTasks />} text="Manage All Claims" />
                  
                    <button
                      onClick={handleLogout}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/" icon={<FaHome />} text="Home" />
            {!userAuth && (
              <>
                <MobileNavLink to="/login" icon={<FaSignInAlt />} text="Login" />
              </>
            )}
            {userAuth && (
              <>
                <MobileNavLink to="/settings" icon={<FaCog />} text="Settings" />
                <MobileNavLink to="/dashboard" icon={<FaTachometerAlt />} text="Dashboard" />
                <MobileNavLink to="/upload" icon={<FaUpload />} text="Upload Item" />
                <MobileNavLink to="/all-users" icon={<FaUsers />} text="Manage All Users" /> 
                <MobileNavLink to="/all-claims" icon={<FaTasks />} text="Manage All Claims" />
                  
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

const NavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
  >
    {icon}
    <span className="ml-2">{text}</span>
  </Link>
)

const MobileNavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center"
  >
    {icon}
    <span className="ml-2">{text}</span>
  </Link>
)

export default Navbar

