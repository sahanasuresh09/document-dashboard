const express = require("express");
const upload = require("../middleware/multer");
const File = require("../models/File");

const router = express.Router();

router.post("/", upload.array("files"), async (req, res) => {
  try {
    const savedFiles = [];

    for (const file of req.files) {
      const newFile = new File({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        size: file.size,
      });

      const savedFile = await newFile.save();

      savedFiles.push(savedFile);
    }

    res.status(200).json({
      message: "Files uploaded successfully",
      files: savedFiles,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Upload failed",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch files",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
    });
  }
});

module.exports = router;
