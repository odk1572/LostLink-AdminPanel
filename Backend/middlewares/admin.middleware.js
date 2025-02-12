import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyAdmin = asyncHandler(async (req, _, next) => {
    try {
        // Retrieve the token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user using the decoded token's user ID
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Check if the user is an admin
        if (user.role !== "admin") {
            throw new ApiError(403, "Access denied. Admins only.");
        }

        // Add user info to the request object for further use
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
