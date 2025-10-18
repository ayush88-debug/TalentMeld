import multer from "multer";
import os from "os"; // Import the 'os' module to get the system's temp directory

// Use the system's temporary directory for storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // os.tmpdir() will resolve to a writable directory like '/tmp' on Render
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});