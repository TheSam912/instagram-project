const express = require("express");
const router = express.Router();
const instagramController = require("../controllers/instagramController");


router.post("/search", instagramController.searchInstagramPosts);
router.post("/get-post-details", instagramController.getPostDetails);

module.exports = router;
