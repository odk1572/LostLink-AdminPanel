"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaUserCircle, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://lostlink-adminpanel.onrender.com/api/v1/auth/all");
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`https://lostlink-adminpanel.onrender.com/api/v1/auth/delete/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  if (loading) {
    return <div className="text-center text-white text-2xl mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">User Management</h1>
      
      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="text-gray-300">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                        ) : (
                          <FaUserCircle className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap flex space-x-3">
                    <Link to={`/user/${user._id}`} className="text-indigo-400 hover:text-indigo-300 text-sm">
                      <FaUser className="inline-block mr-1" /> View Profile
                    </Link>
                    <button onClick={() => handleDeleteUser(user._id)} className="text-red-400 hover:text-red-300 text-sm">
                      <FaTrash className="inline-block mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
