import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Claim } from "../models/claim.model.js";
const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}



const registerUser = asyncHandler(async (req, res) => {
    // Get user details from frontend
    const { name, email, phone, password, role } = req.body;

    // Validation: Ensure all fields are provided
    if ([name, email, phone, password, role].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists (email or phone must be unique)
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
        throw new ApiError(409, "User with this email or phone already exists");
    }

    // Check for avatar file
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Upload avatar to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    // Create new user
    const newUser = new User({
        name,
        email,
        phone,
        password, // Password hashing is handled in the model
        role, // Use the role received in the request body
        avatar: avatar.url
    });

    await newUser.save();

    // Generate JWT Access Token
    const accessToken = newUser.generateAccessToken();

    // Prepare response object (without password)
    const createdUser = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt
    };

    return res.status(201).json(
        new ApiResponse(201, { user: createdUser, accessToken }, "User registered successfully")
    );
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, phone, password } = req.body;

    // Validate input
    if (!email && !phone) {
        throw new ApiError(400, "Email or phone number is required");
    }

    // Find user by email or phone
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Validate password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate Access & Refresh Tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Remove sensitive fields before sending response
    const loggedInUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt
    };

    // Set cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: true, // Ensure HTTPS usage
        sameSite: "Strict"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});


const logoutUser = asyncHandler(async (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: true, // Ensure HTTPS usage
        sameSite: "Strict"
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old and new passwords are required");
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if old password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    // Update password (it will be hashed automatically)
    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        throw new ApiError(400, "All fields (name, email, phone) are required");
    }

    // Check if the email or phone is already in use by another user
    const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
        _id: { $ne: req.user._id } // Exclude the current user from the check
    });

    if (existingUser) {
        throw new ApiError(409, "Email or phone number is already in use");
    }

    // Update user details
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { name, email, phone }
        },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"));
});


const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    // Find the user to get the old avatar
    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Upload new avatar to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }

    // TODO: Delete old avatar from Cloudinary (if applicable)
    // Example (Uncomment if needed):
    // if (user.profilePic) {
    //     await deleteFromCloudinary(user.profilePic);
    // }

    // Update user profile picture
    user.profilePic = avatar.url;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, { profilePic: user.profilePic }, "Avatar image updated successfully")
    );
});
const getUserProfile = asyncHandler(async (req, res) => {
    let { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    userId = userId.trim(); // Ensure userId is cleaned

    const user = await User.findById(userId).select(
        "_id name email phone role avatar createdAt updatedAt"
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});


const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Check if the logged-in user is an admin
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Only admins can delete user accounts");
    }

    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});


export const getAllUsers = async (req, res) => {
    try {
        // Check if the logged-in user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        // Fetch all users, excluding passwords
        const users = await User.find().select("-password");

        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const deleteUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Ensure only admin can delete a user
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Only admins can delete user accounts");
    }

    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});


export {
    registerUser,
    loginUser,
    logoutUser,
    generateAccessAndRefereshTokens,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserProfile,
    deleteUser , 
    deleteUserById
}