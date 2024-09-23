// const express = require("express");
// const instagramRoutes = require("./routes/instagramRoute");

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// app.use("/", instagramRoutes); // Base path for all Instagram-related routes

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/search", async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).send({ error: "Keyword is required" });
  }

  try {
    const posts = await searchInstagramPostsByHashtag(keyword);
    res.json(posts);
  } catch (error) {
    console.error("Error searching Instagram:", error);
    res.status(500).send({ error: "Error searching Instagram" });
  }
});

async function searchInstagramPostsByHashtag(keyword) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const searchUrl = `https://www.instagram.com/explore/tags/${keyword}/`;

  await page.goto(searchUrl, { waitUntil: "networkidle2" });

  const postLinks = await page.evaluate(() => {
    const anchors = document.querySelectorAll("a");
    return [...anchors]
      .filter((a) => a.href.includes("/p/"))
      .map((a) => a.href);
  });

  await browser.close();

  return postLinks;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
