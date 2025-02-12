import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const EditItemForm = () => {
  const [item, setItem] = useState(null); // Placeholder for item data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
    status: "lost",
    location: {
      latitude: 22.2731, // Default to India's center
      longitude: 70.7755,
    },
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        category: item.category,
        status: item.status,
        location: {
          latitude: item.location.latitude,
          longitude: item.location.longitude,
        },
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:8000/api/v1/item/${item?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        alert("Item updated successfully!");
      } else {
        alert("Failed to update item. Please try again.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("An error occurred while updating the item.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          required
        >
          <option value="ID Card">ID Card</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Smartphone">Smartphone</option>
          <option value="Wallet">Wallet</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          required
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Select Location</label>
        <MapContainer
          center={[formData.location.latitude, formData.location.longitude]}
          zoom={13}
          className="h-60 w-full mt-2 rounded-md"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker formData={formData} setFormData={setFormData} />
        </MapContainer>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Update Item
        </button>
      </div>
    </form>
  );
};

const LocationMarker = ({ formData, setFormData }) => {
  const [position, setPosition] = useState([formData.location.latitude, formData.location.longitude]);

  useEffect(() => {
    setPosition([formData.location.latitude, formData.location.longitude]);
  }, [formData.location]);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setFormData((prev) => ({
        ...prev,
        location: {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        },
      }));
    },
  });

  return <Marker position={position} />;
};

export default EditItemForm;
