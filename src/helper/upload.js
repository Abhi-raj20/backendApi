const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },

  filename: (req, file, cb) => {
    const random = uuidv4();
    cb(null, random + "" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb("Error: Not a valid file type", false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 50 },  // 50 MB limit
  fileFilter,
});

module.exports = upload;
