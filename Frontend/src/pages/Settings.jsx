"use client"

import { useState } from "react"
import UpdateAccount from "../components/UpdateAccount"
import ChangePassword from "../components/ChangePassword"
import UpdateAvatar from "../components/UpdateAvatar"
import LostLinkSVG from "../components/LostLinkSvg"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account")

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <UpdateAccount />
      case "password":
        return <ChangePassword />
      case "avatar":
        return <UpdateAvatar />
      default:
        return <UpdateAccount />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-900 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          <nav className="md:w-1/4 mb-8 md:mb-0">
            <ul className="space-y-2">
              {["account", "password", "avatar"].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeTab === tab ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Settings
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:w-3/4 md:pl-8">{renderContent()}</div>
        </div>
      </main>
    </div>
  )
}

export default Settings

