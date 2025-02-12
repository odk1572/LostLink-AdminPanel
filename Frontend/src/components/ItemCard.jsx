import { FaMapMarkerAlt } from "react-icons/fa"

const ItemCard = ({ item }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
        <p className="text-gray-400 mb-2">{item.description.substring(0, 100)}...</p>
        <div className="flex justify-between items-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              item.status === "lost" ? "bg-red-500 hover:bg-red-900 text-white" : "bg-green-500 hover:bg-green-800 text-white"
            }`}
          >
            {item.status.toUpperCase()}
          </span>
          <div className="flex items-center text-blue-400">
            <FaMapMarkerAlt className="mr-1" />
            <span className="text-sm hover:text-blue-200">View on map</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemCard

