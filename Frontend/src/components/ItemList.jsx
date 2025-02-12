"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import ItemCard from "./ItemCard"

const ItemList = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/item/")
        setItems(response.data.data)
        setLoading(false)
      } catch (error) {
        toast.error("Failed to fetch items")
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  if (loading) {
    return <div className="text-center text-white">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-white mb-6">Lost & Found Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link to={`/items/${item._id}`} key={item._id}>
            <ItemCard item={item} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ItemList

