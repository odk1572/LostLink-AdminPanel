import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Claim } from "../models/claim.model.js";
import { Item } from "../models/item.model.js";
import jwt from "jsonwebtoken";



export const createClaim = asyncHandler(async (req, res) => {
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

    // Ensure item status is "lost" before claiming
    if (item.status !== "lost") {
        throw new ApiError(400, "Only lost items can be claimed");
    }

    // Check if the item is already claimed
    const existingClaim = await Claim.findOne({ item: item._id, claimedBy: userId });
    if (existingClaim) {
        throw new ApiError(400, "You have already submitted a claim request for this item");
    }

    // Generate a custom claim ID using new ObjectId
    const claimId = `CLAIM-${new mongoose.Types.ObjectId()}`;

    // Create a new claim request
    const claim = await Claim.create({
        claimId, // New claimId field
        item: item._id,
        claimedBy: userId,
        proof: proofUpload.url, // Store the Cloudinary URL
        additionalDetails
    });

    return res.status(201).json(new ApiResponse(201, claim, "Claim request submitted successfully"));
});

export const getUserClaims = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Authenticated User ID

    // Fetch all claims where the 'claimedBy' field matches the authenticated user's ID
    const claims = await Claim.find({ claimedBy: userId })
        .populate("item", "title description status")  // Populate item details
        .populate("claimedBy", "name email phone role avatar")  // Populate user details (claimedBy)
        .exec();

    // If no claims are found, send a message
    if (!claims || claims.length === 0) {
        throw new ApiError(404, "No claims found for this user");
    }

    return res.status(200).json(new ApiResponse(200, claims, "Claims fetched successfully"));
});

export const getClaimById = asyncHandler(async (req, res) => {
    const { claimId } = req.params;  // Claim ID from the request parameters
    const userId = req.user._id;  // The logged-in user's ID

    // Find the claim by ID and ensure it's submitted by the logged-in user
    const claim = await Claim.findOne({ _id: claimId, claimedBy: userId })
        .populate("item", "title description category uniqueIdentifier image status")  // Populate item details
        .populate("claimedBy", "name email phone avatar role");  // Populate user details

    if (!claim) {
        throw new ApiError(404, "Claim not found or you do not have permission to view it");
    }

    return res.status(200).json(new ApiResponse(200, claim, "Claim details retrieved successfully"));
});


// Function to withdraw a claim before admin approval
export const withdrawClaim = asyncHandler(async (req, res) => {
    const { claimId } = req.params; // Claim ID from the request parameters
    const userId = req.user._id; // Authenticated User ID

    // Find the claim by ID and ensure it was submitted by the logged-in user
    const claim = await Claim.findById(claimId);

    if (!claim) {
        throw new ApiError(404, "Claim not found");
    }

    if (claim.claimedBy.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only withdraw your own claims");
    }

    // Ensure the claim status is "pending" before withdrawing
    if (claim.claimStatus !== "pending") {
        throw new ApiError(400, "Cannot withdraw claim, it is already approved or rejected");
    }

    // Update the claim status to "withdrawn"
    claim.claimStatus = "withdrawn";
    await claim.save();

    // Optionally, update the associated item to clear the `claimedBy` field
    const item = await Item.findById(claim.item);
    if (item) {
        item.claimedBy = null; // Clear the claimedBy field
        await item.save();
    }

    return res.status(200).json(new ApiResponse(200, claim, "Claim successfully withdrawn"));
});



export const updateClaim = asyncHandler(async (req, res) => {
    const { claimId } = req.params; // Claim ID from the request
    const { additionalDetails } = req.body; // Updated claim details
    const userId = req.user._id; // Authenticated user ID

    // Find the claim by its ID
    const claim = await Claim.findById(claimId);
    if (!claim) {
        throw new ApiError(404, "Claim not found");
    }

    // Check if the claim is owned by the authenticated user
    if (claim.claimedBy.toString() !== userId.toString()) {
        throw new ApiError(403, "You do not have permission to update this claim");
    }

    // Ensure that the claim status is "pending" (i.e., it can still be updated)
    if (claim.claimStatus !== "pending") {
        throw new ApiError(400, "Only pending claims can be updated");
    }

    // Handle file upload if proof document is being updated
    let proofUrl = claim.proof; // Keep the old proof if no new file is uploaded
    if (req.file) {
        // Upload the new proof document to Cloudinary
        const proofUpload = await uploadOnCloudinary(req.file.path);
        if (!proofUpload || !proofUpload.url) {
            throw new ApiError(500, "Failed to upload proof document");
        }
        proofUrl = proofUpload.url;
    }

    // Update the claim details
    claim.additionalDetails = additionalDetails || claim.additionalDetails; // Update only if new details are provided
    claim.proof = proofUrl; // Update proof URL if a new document was uploaded

    // Save the updated claim
    await claim.save();

    return res.status(200).json(new ApiResponse(200, claim, "Claim updated successfully"));
});

export const getAllClaims = asyncHandler(async (req, res) => {
    // Check if the user has admin role
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admins only.");
    }

    // Fetch all claims
    const claims = await Claim.find({})
        .populate("item", "title description status")  // Populate item details
        .populate("claimedBy", "name email phone role avatar")  // Populate user details (claimedBy)
        .exec();

    // If no claims are found, send a message
    if (!claims || claims.length === 0) {
        throw new ApiError(404, "No claims found for review");
    }

    return res.status(200).json(new ApiResponse(200, claims, "Claims fetched successfully"));
});


// Retrieve detailed information about a specific claim by ID
export const getClaimDetails = asyncHandler(async (req, res) => {
    const { claimId } = req.params;

    // Fetch the claim by ID and populate related fields (item and claimedBy)
    const claim = await Claim.findById(claimId)
        .populate("item", "title description category uniqueIdentifier image status") // populate item details
        .populate("claimedBy", "name email phone avatar role"); // populate user details

    if (!claim) {
        throw new ApiError(404, "Claim not found");
    }

    return res.status(200).json({
        success: true,
        data: claim
    });
});


export const updateClaimStatus = asyncHandler(async (req, res) => {
    const { claimId } = req.params; // Claim ID from the request parameters
    const { status } = req.body;  // Status update (approved or rejected)
    const userId = req.user._id;  // Authenticated User ID

    // Check if the user has admin role
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admins only.");
    }

    // Find the claim by its ID
    const claim = await Claim.findById(claimId);
    if (!claim) {
        throw new ApiError(404, "Claim not found");
    }

    // Ensure that the claim is still "pending" before approving or rejecting
    if (claim.claimStatus !== "pending") {
        throw new ApiError(400, "This claim has already been processed");
    }

    // Validate the status input (only "approved" or "rejected" are allowed)
    if (!["approved", "rejected"].includes(status)) {
        throw new ApiError(400, "Invalid status. Only 'approved' or 'rejected' are allowed.");
    }

    // Update the claim status
    claim.claimStatus = status;
    await claim.save();

    // If the claim is approved, update the associated item status to "claimed"
    if (status === "approved") {
        const item = await Item.findById(claim.item);
        if (item) {
            item.status = "claimed"; // Change the status of the item to "claimed"
            item.claimedBy = claim.claimedBy; // Assign the claimant to the item
            await item.save();
        }
    }

    // Return success response
    return res.status(200).json(new ApiResponse(200, claim, `Claim ${status} successfully`));
});


export const deleteClaim = asyncHandler(async (req, res) => {
    const { claimId } = req.params; // Claim ID from the request parameters
    const userId = req.user._id; // Authenticated User ID

    // Find the claim by ID
    const claim = await Claim.findById(claimId);
    if (!claim) {
        throw new ApiError(404, "Claim not found");
    }

    // Ensure that the claim is either owned by the authenticated user or the user is an admin
    if (claim.claimedBy.toString() !== userId.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "You can only delete your own claims or if you're an admin");
    }

    // Delete the claim using deleteOne
    await Claim.deleteOne({ _id: claimId });

    // Optionally, update the associated item to clear the `claimedBy` field
    const item = await Item.findById(claim.item);
    if (item) {
        item.claimedBy = null; // Clear the claimedBy field as the claim is deleted
        await item.save();
    }

    return res.status(200).json(new ApiResponse(200, null, "Claim deleted successfully"));
});


