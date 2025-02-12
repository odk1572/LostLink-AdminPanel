import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Item } from "../models/item.model.js";
import { Claim } from "../models/claim.model.js";
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary

export const createItem = asyncHandler(async (req, res) => {
    const { title, description, category, uniqueIdentifier, status, latitude, longitude } = req.body;
    const imageLocalPath = req.file?.path;

    if (!title || !description || !category || !uniqueIdentifier || !status || !latitude || !longitude || !imageLocalPath) {
        throw new ApiError(400, "All fields are required");
    }

    // Upload image to Cloudinary
    const image = await uploadOnCloudinary(imageLocalPath);
    if (!image.url) {
        throw new ApiError(400, "Error while uploading image");
    }

    // Create new item
    const newItem = await Item.create({
        title,
        description,
        category,
        uniqueIdentifier,
        status,
        location: { latitude, longitude },
        image: image.url,
        user: req.user._id, // Assuming the user is authenticated
    });

    return res.status(201).json(new ApiResponse(201, newItem, "Item created successfully"));
});

export const getAllItems = asyncHandler(async (req, res) => {
    const items = await Item.find().populate("user", "name email phone");

    if (!items.length) {
        throw new ApiError(404, "No items found");
    }

    return res.status(200).json(new ApiResponse(200, items, "Items retrieved successfully"));
});

export const getItemById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid item ID format");
    }

    try {
        const item = await Item.findById(id).populate("user", "name email phone");

        if (!item) {
            throw new ApiError(404, "Item not found");
        }

        return res.status(200).json(new ApiResponse(200, item, "Item retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, "Database error while retrieving item");
    }
});


export const updateItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let updates = req.body;

    console.log("Request Body:", updates); // Debugging log
    console.log("Request Headers:", req.headers);
    console.log("Request Params (id):", id);

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid item ID format");
    }

    // Find the item
    const item = await Item.findById(id);
    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    // Ensure only the owner or admin can update
    if (item.user.toString() !== req.user._id.toString() ) {
        throw new ApiError(403, "Not authorized to update this item");
    }

    // Handling allowed fields update
    const allowedFields = ["title", "description", "status", "category", "claimedBy"];
    let updateData = {};
    
    allowedFields.forEach((field) => {
        if (updates[field] !== undefined) {
            updateData[field] = updates[field];
        }
    });

    // Handling location updates
    if (updates.latitude !== undefined && updates.longitude !== undefined) {
        updateData["location"] = {
            latitude: updates.latitude,
            longitude: updates.longitude
        };
    }

    // Handling image upload
    if (req.file) {
        updateData["image"] = req.file.path; // Save new image URL
    }

    // Update and return the updated item
    const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true });

    console.log("Updated Item:", updatedItem); // Debugging log

    return res.status(200).json(new ApiResponse(200, updatedItem, "Item updated successfully"));
});

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the item
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Check if user is authorized to delete
        if (item.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this item" });
        }

        // Extract Cloudinary Public ID from the image URL
        const imageUrl = item.image;
        if (imageUrl) {
            const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public ID from URL
            
            console.log(`Deleting image from Cloudinary: ${publicId}`);

            // Delete image from Cloudinary
            await cloudinary.uploader.destroy(publicId);
        }

        // Delete item from DB
        await Item.findByIdAndDelete(id);

        res.json({ message: "Item deleted successfully" });

    } catch (error) {
        console.error("Delete Item Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getItemsByStatus = asyncHandler(async (req, res) => {
    const { status } = req.params;

    // Validate status input
    if (!["lost", "found"].includes(status)) {
        throw new ApiError(400, "Invalid status. Must be 'lost' or 'found'");
    }

    // Fetch items filtered by status
    const items = await Item.find({ status }).populate("user", "name email phone");

    // Handle case when no items are found
    if (!items || items.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], `No items found with status '${status}'`));
    }

    return res.status(200).json(new ApiResponse(200, items, `Items with status '${status}' retrieved successfully`));
});

export const getItemsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    // Validate category input
    const validCategories = ["ID Card", "Vehicle", "Smartphone", "Wallet", "Other"];
    if (!validCategories.includes(category)) {
        throw new ApiError(400, "Invalid category. Must be one of: ID Card, Vehicle, Smartphone, Wallet, Other");
    }

    // Fetch items filtered by category
    const items = await Item.find({ category }).populate("user", "name email phone");

    // Handle case when no items are found
    if (!items || items.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], `No items found in category '${category}'`));
    }

    return res.status(200).json(new ApiResponse(200, items, `Items in category '${category}' retrieved successfully`));
});


export const claimItem = asyncHandler(async (req, res) => {
    const { id } = req.params; // Item ID
    const { additionalDetails } = req.body;
    const userId = req.user._id; // Authenticated User ID

    // Check if a file was uploaded
    if (!req.file) {
        throw new ApiError(400, "Proof of ownership (file) is required");
    }

    // Upload file to Cloudinary
    const proofUpload = await uploadOnCloudinary(req.file.path);
    if (!proofUpload || !proofUpload.url) {
        throw new ApiError(500, "Failed to upload proof document");
    }

    // Find the item
    const item = await Item.findById(id);
    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    // Ensure item status is "found" before claiming
    if (item.status !== "found") {
        throw new ApiError(400, "Only found items can be claimed");
    }

    // Check if the item is already claimed
    if (item.claimedBy) {
        throw new ApiError(400, "Item has already been claimed by another user");
    }

    // Check if the user has already claimed this item (Avoid duplicate claims)
    const existingClaim = await Claim.findOne({ item: item._id, claimedBy: userId });
    if (existingClaim) {
        throw new ApiError(400, "You have already submitted a claim request for this item");
    }

    // Create a new claim request
    const claim = await Claim.create({
        item: item._id,
        claimedBy: userId,
        proof: proofUpload.url, // Store the Cloudinary URL
        additionalDetails
    });

    // ✅ Update the item to reflect the claim
    item.claimedBy = userId;
    await item.save();

    return res.status(201).json(new ApiResponse(201, claim, "Claim request submitted successfully"));
});


export const unclaimItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Fetch item with claimedBy populated
    const item = await Item.findById(id).populate("claimedBy");

    console.log("Item Data:", item); // Debugging
    console.log("Claimed By Field:", item.claimedBy); // Debugging

    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    if (!item.claimedBy) {
        throw new ApiError(400, "This item has not been claimed yet");
    }

    if (item.claimedBy._id.toString() !== userId.toString() && userRole !== "admin") {
        throw new ApiError(403, "You are not authorized to unclaim this item");
    }

    // Delete claim and update item
    const deletedClaim = await Claim.findOneAndDelete({ item: item._id });
    if (!deletedClaim) {
        throw new ApiError(400, "No claim record found for this item");
    }

    item.claimedBy = null;
    await item.save();

    return res.status(200).json(new ApiResponse(200, item, "Item unclaimed successfully"));
});

export const getLocationOfItem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid item ID format");
    }

    // Find the item by ID
    const item = await Item.findById(id).select("location");

    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    return res.status(200).json(new ApiResponse(200, item.location, "Item location retrieved successfully"));
});
