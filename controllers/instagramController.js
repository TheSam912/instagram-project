// controllers/instagramController.js
const puppeteerService = require("../services/puppeteerService");
const cheerioService = require("../services/cheerioService");
const { createErrorResponse } = require("../utils/responseHelpers");

const searchInstagramPosts = async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res
      .status(400)
      .json(createErrorResponse("Keyword is required in the JSON body."));
  }

  try {
    const postDetails = await puppeteerService.searchInstagram(keyword);
    return res.json({ keyword, posts: postDetails });
  } catch (error) {
    console.error("Error while scraping:", error);
    return res
      .status(500)
      .json(createErrorResponse("Failed to scrape Instagram."));
  }
};

const getPostDetails = async (req, res) => {
  const { postLink } = req.body;

  if (!postLink) {
    return res
      .status(400)
      .json(createErrorResponse("Instagram post link is required."));
  }

  try {
    const postDetails = await cheerioService.scrapePostDetails(postLink);
    return res.json(postDetails);
  } catch (error) {
    console.error("Error fetching Instagram post:", error.message);
    return res
      .status(500)
      .json(createErrorResponse("Failed to fetch the Instagram post."));
  }
};

module.exports = {
  searchInstagramPosts,
  getPostDetails,
};
