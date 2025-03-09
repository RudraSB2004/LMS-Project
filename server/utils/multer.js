import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory
export default upload;