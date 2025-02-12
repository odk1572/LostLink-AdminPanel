import { Link } from "react-router-dom"
import { FaHome } from "react-icons/fa"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center space-x-2"
      >
        <FaHome />
        <span>Go Home</span>
      </Link>
    </div>
  )
}

export default NotFound

