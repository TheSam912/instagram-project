const puppeteer = require("puppeteer");

async function getPostDetails(page, postUrl) {
  await page.goto(postUrl, { waitUntil: "networkidle2" });
  await page.waitForSelector("article");

  return await page.evaluate(() => {
    const username =
      document.querySelector("header div span a")?.textContent || null;
    const profileUrl = username
      ? `https://www.instagram.com/${username}/`
      : null;
    const date =
      document.querySelector("time")?.getAttribute("datetime") || null;

    return { profileUrl, date };
  });
}

async function searchInstagram(keyword) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const url = `https://www.instagram.com/explore/tags/${keyword}/`;

  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForSelector("article");

  let postUrls = [];

  try {
    for (let i = 0; i < 5; i++) {
      postUrls = await page.evaluate(() =>
        Array.from(document.querySelectorAll("article a")).map((a) => a.href)
      );
      const previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitForTimeout(2000);
    }
  } catch (error) {
    console.error("Error while scrolling and loading posts:", error);
  }

  const postDetailsArray = [];
  for (const postUrl of postUrls) {
    try {
      const postDetails = await getPostDetails(page, postUrl);
      postDetailsArray.push({ postUrl, ...postDetails });
    } catch (error) {
      console.error(`Failed to scrape details for post: ${postUrl}`, error);
    }
  }

  await browser.close();
  return postDetailsArray;
}

module.exports = {
  searchInstagram,
};
