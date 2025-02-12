import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationPicker = ({ setLocation }) => {
    useMapEvents({
      click(e) {
        setLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
      },
    });
    return null;
  };

const CreateItem = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState({ latitude: 22.2731, longitude: 70.7755 }); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
  
      // Ensure all fields are added properly
      Object.keys(data).forEach((key) => {
        if (key === "image" && data.image.length > 0) {
          formData.append("image", data.image[0]);
        } else {
          formData.append(key, data[key]);
        }
      });
  
      // Append location data manually
      formData.append("latitude", location.latitude);
      formData.append("longitude", location.longitude);
  
      // Debugging: Check form data before sending
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      const response = await axios.post("http://localhost:8000/api/v1/item/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data.success) {
        toast.success("Item created successfully!");
        navigate("/items");
      }
    } catch (error) {
      toast.error("Failed to create item. Please try again.");
      console.error("Create item error:", error);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-white">Upload A new Lost or Found Item</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            {...register("description", { required: "Description is required" })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
        </div>

        {/* Category Select */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300">
            Category
          </label>
          <select
            id="category"
            {...register("category", { required: "Category is required" })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          >
            <option value="">Select a category</option>
            <option value="ID Card">ID Card</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Smartphone">Smartphone</option>
            <option value="Wallet">Wallet</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
        </div>

        {/* Unique Identifier Input */}
        <div>
          <label htmlFor="uniqueIdentifier" className="block text-sm font-medium text-gray-300">
            Unique Identifier
          </label>
          <input
            type="text"
            id="uniqueIdentifier"
            {...register("uniqueIdentifier", { required: "Unique identifier is required" })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
          {errors.uniqueIdentifier && <p className="mt-1 text-sm text-red-500">{errors.uniqueIdentifier.message}</p>}
        </div>

        {/* Status Select */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300">
            Status
          </label>
          <select
            id="status"
            {...register("status", { required: "Status is required" })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          >
            <option value="">Select status</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
        </div>

              {/* Map for selecting location */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Location</label>
          <MapContainer center={[location.latitude, location.longitude]} zoom={15} className="h-64 w-full rounded-md">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.latitude, location.longitude]} />
            <LocationPicker setLocation={setLocation} />
          </MapContainer>
          <p className="mt-2 text-sm text-gray-400">Click on the map to select the location.</p>
        </div>


        {/* Image Upload with Preview */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300">
            Image
          </label>
          <div className="mt-1 flex flex-col items-center">
            <label className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 cursor-pointer">
              <FaUpload className="mr-2" />
              Upload Image
              <input
                type="file"
                id="image"
                accept="image/*"
                {...register("image", { required: "Image is required" })}
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-md border border-gray-600" />
              </div>
            )}
          </div>
          {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItem;