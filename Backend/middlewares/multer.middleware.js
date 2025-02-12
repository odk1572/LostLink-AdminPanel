import multer from "multer";
import path from "path";
import fs from "fs";

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadFolder = req.body.uploadPath || "public"; // Default: "files" if no path is provided

        const uploadPath = path.resolve(uploadFolder);

        // Ensure the folder exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Prevent duplicate filenames
    }
});

export const upload = multer({ storage });
