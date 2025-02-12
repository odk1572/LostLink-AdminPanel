import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["ID Card", "Vehicle", "Smartphone", "Wallet", "Other"],
        required: true
    },
    uniqueIdentifier: {
        type: String,
        required: true,
        unique: true, // Ensuring no duplicate entries
        trim: true
    },
    image: {
        type: String, // URL to Cloudinary or local storage
        required: true
    },
    status: {
        type: String,
        enum: ["lost", "found"],
        required: true
    },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    claimedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null // Null if no one has claimed the item yet
    }
}, { timestamps: true });

export const Item = mongoose.model("Item", itemSchema);
