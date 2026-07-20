import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed"));
    }
  },

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;