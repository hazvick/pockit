const puppeteer = require("puppeteer");

exports.handler = async function (event) {
  const query = event.queryStringParameters.q;
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing query param 'q'" }),
    };
  }

  const searchUrl = `https://www.matspar.se/kategori?q=${encodeURIComponent(query)}`;
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(searchUrl, { waitUntil: "networkidle2" });

  const productLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a._3Ua3P")).map(a => `https://www.matspar.se${a.getAttribute("href")}`);
  });

  const results = [];

  for (const url of productLinks.slice(0, 8)) {
    const p = await browser.newPage();
    await p.goto(url, { waitUntil: "networkidle2" });

    const product = await p.evaluate(() => {
      const name = document.querySelector("h1._1e7qP")?.innerText || "";
      const brand = document.querySelector("div._1dsbo h2")?.innerText || "";
      const weight = document.querySelector("div._1dsbo")?.innerText?.split(brand)[1]?.trim() || "";
      const image = document.querySelector("img.PIwpb")?.src || "";
      const url = location.href;

      const shops = Array.from(document.querySelectorAll("div._2qyvs")).map((shopDiv) => {
        const logodiv = shopDiv.querySelector("div._3xr6h");
        const match = logodiv?.style?.backgroundImage?.match(/url\(["']?(.*?)["']?\)/);
        const logo = match ? match[1] : "";

        const priceEl = shopDiv.querySelector("div._3b8Rg") || shopDiv.querySelector("div._3n8y8");
        const priceText = priceEl?.innerText?.split("\n")[0].trim() || "";

        return { logo, priceText };
      });

      return { name, brand, weight, image, url, shops };
    });

    results.push(product);
    await p.close();
  }

  await browser.close();

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(results),
  };
};
