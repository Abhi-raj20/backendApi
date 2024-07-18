const messages = require("../helper/messages.js");
const Media = require("../model/media.schema.js");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.mediaUpload = async (req, res) => {
  try {
    const { longitude, latitude, category, userId } = req.body;
    const files = req.files;

    if (!files) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Array to store all uploaded file URLs
    let fileUrls = [];

    // Function to delete a file from local storage
    const deleteLocalFile = (filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Error deleting file: ${filePath}`, err);
      });
    };

    for (const file of files) {
      const filePath = file.path;
      const mimeType = mime.lookup(filePath);

      if (!mimeType) {
        throw new Error(`Could not determine MIME type for file: ${filePath}`);
      }

      let resourceType;

      if (mimeType.startsWith("image/")) {
        resourceType = "image";
      } else if (mimeType.startsWith("video/")) {
        resourceType = "video";
      } else {
        throw new Error("Unsupported file type");
      }

      try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "uploads/", // Optional: specify folder in Cloudinary
          resource_type: resourceType,
        });

        const newFile = new Media({
          filename: file.filename,
          file_Url: uploadResult.secure_url,
          category: category,
          location: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          userId: userId,
        });

        await newFile.save();
        fileUrls.push(uploadResult.secure_url);

        // Delete the local file after successful upload to Cloudinary
        deleteLocalFile(file.path);
      } catch (uploadError) {
        console.error("Error uploading file to Cloudinary:", uploadError);
        // Delete the local file if upload to Cloudinary fails
        deleteLocalFile(file.path);
        throw uploadError; // Re-throw the error to be caught in the outer catch block
      }
    }

    res.status(200).json({
      urls: fileUrls,
      category: category,
      message: "Files uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading files:", error);

    // If an error occurs, ensure all files in the local storage are deleted
    if (req.files) {
      for (const file of req.files) {
        fs.unlink(file.path, (err) => {
          if (err) console.error(`Error deleting file: ${file.path}`, err);
        });
      }
    }

    res.status(500).json({ error: "Error uploading files" });
  }
};

// Show all media photos & videos for Admin
exports.showMedia = async (req, res) => {
  try {
    const result = await Media.find();
    if (result == null) {
      res.status(500).json({
        message: "Internal Server error",
      });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
