"use client"

import { useContext } from "react"
import ItemList from "../components/ItemList"
import ClaimList from "../components/ClaimList"
import LostLinkSVG from "../components/LostLinkSvg"
import { UserContext } from "../../UserContextProvider"

const Dashboard = () => {
  const { user } = useContext(UserContext)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-900 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Welcome, {user?.name}</h2>
        </section>
        <section className="mb-12">
          <ItemList />
        </section>
        <section>
          <ClaimList />
        </section>
      </main>
    </div>
  )
}

export default Dashboard

