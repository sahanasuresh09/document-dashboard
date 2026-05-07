const express = require("express");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/", upload.array("files"), (req, res) => {
  try {
    res.status(200).json({
      message: "Files uploaded successfully",
      files: req.files,
    });
  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
    });
  }
});

module.exports = router;