import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { createClaim , getUserClaims , getClaimById , withdrawClaim , updateClaim , getAllClaims , getClaimDetails , updateClaimStatus , deleteClaim } from "../controllers/claim.controller.js";

const router = Router();

router.post("/:id", verifyJWT, upload.single("proofDocument"), createClaim);
router.get("/user/claims", verifyJWT, getUserClaims);
router.get("/user/claims/:claimId", verifyJWT, getClaimById);
router.delete("/user/claims/withdraw/:claimId", verifyJWT, withdrawClaim);
router.patch("/user/claims/update/:claimId", verifyJWT, upload.single("proofDocument"), updateClaim);
router.get("/admin/claims", verifyJWT, verifyAdmin, getAllClaims);
router.get("/admin/claims/:claimId", verifyJWT, verifyAdmin, getClaimDetails);
router.patch("/admin/claims/status/:claimId", verifyJWT, verifyAdmin, updateClaimStatus);
router.delete("/admin/claims/:claimId", verifyJWT, verifyAdmin, deleteClaim); 

export default router;