import { diskStorage } from "multer";

export const photoMulterConfig = {
  storage: diskStorage({
    // destination: "./uploads",
    filename: (req, file, cb) => {
      console.log("check file ", file);
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\s/g, "_");
      cb(null, `${timestamp}-${originalName}`);
    },
  }),
  limits: {
    fileSize: 3 * 1024 * 1024, // Giới hạn kích thước file là 5MB
  },
};
