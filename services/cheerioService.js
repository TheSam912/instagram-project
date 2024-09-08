const axios = require("axios");
const cheerio = require("cheerio");

async function scrapePostDetails(postLink) {
  const response = await axios.get(postLink);
  const $ = cheerio.load(response.data);
  const descriptionContent = $('meta[property="og:description"]').attr(
    "content"
  );

  if (!descriptionContent) {
    throw new Error("No description meta tag found.");
  }

  const [interactionPart, userAndDatePart] = descriptionContent.split(" - ");
  const [username, postDate] = userAndDatePart
    .split(" on ")
    .map((part) => part.trim());
  const [likes, comments] = interactionPart
    .split(",")
    .map((part) => part.trim());

  const profileLink = `https://www.instagram.com/${username}/`;

  return {
    profileLink,
    likes,
    comments,
    postDate,
  };
}

module.exports = {
  scrapePostDetails,
};
