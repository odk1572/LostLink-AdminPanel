import { Router } from "express";
import { 
    createItem, 
    getAllItems, 
    getItemById, 
    updateItem, 
    deleteItem ,
    getItemsByStatus,
    getItemsByCategory ,
    claimItem ,
    unclaimItem , 
    getLocationOfItem
} from "../controllers/item.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, upload.single("image"), createItem);
router.route("/").get(getAllItems); 
router.route("/:id")
    .get(getItemById)
    .patch(verifyJWT, updateItem)
    .delete(verifyJWT, deleteItem); 
router.route("/status/:status").get(getItemsByStatus);
router.route("/category/:category").get(getItemsByCategory);
router.route("/:id/claim").post(verifyJWT,upload.single("proof"),claimItem);
router.route("/:id/unclaim").patch(verifyJWT, unclaimItem);
router.route("/:id/location").get(getLocationOfItem); 



export default router;
