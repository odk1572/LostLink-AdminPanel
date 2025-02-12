"use client"

import { FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaPhone } from "react-icons/fa"
import LostLinkSVG from "../components/LostLinkSvg"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Logo and Name */}
          <div className="flex items-center space-x-3">
            <LostLinkSVG className="h-10 w-10" />
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-md tracking-wide ">
  Admin Panel
</span>

          </div>

          {/* Social Links */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://www.instagram.com/odk_1572" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition duration-300">
              <FaInstagram size={24} />
            </a>
            <a href="https://www.linkedin.com/in/om-kariya-b1815628a" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-300">
              <FaLinkedin size={24} />
            </a>
            <a href="https://github.com/odk1572" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition duration-300">
              <FaGithub size={24} />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center md:text-left">
          <p className="flex items-center justify-center md:justify-start space-x-2">
            <FaEnvelope /> <span>odk1572@gmail.com</span>
          </p>
          <p className="flex items-center justify-center md:justify-start space-x-2 mt-1">
            <FaPhone /> <span>+91 8780466733</span>
          </p>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 border-t border-gray-700 pt-4 text-center text-sm">
          <p className="text-gray-400">
            This is the <span className="  text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-md tracking-wide ">
  Admin Panel
</span>  for managing users, claims, and uploads.
          </p>
          <p className="text-gray-400 mt-2">
            Made from scratch with <span className="text-red-500">❤️</span> by <span className="text-white font-semibold">ODK</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
