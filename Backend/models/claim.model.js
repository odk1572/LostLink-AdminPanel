import mongoose, { Schema } from "mongoose";

const claimSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    claimedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    claimStatus: {
        type: String,
        enum: ["pending", "approved", "rejected","withdrawn"],
        default: "pending"
    },
    proof: {
        type: String, // URL to proof document (e.g., Aadhar card, bill, receipt) (image file) 
        required: true
    },
    additionalDetails: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export const Claim = mongoose.model("Claim", claimSchema);
