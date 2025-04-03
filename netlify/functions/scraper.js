const puppeteer = require('puppeteer');

exports.handler = async function (event, context) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://bensinpriser.nu/stationer/95/skane-lan/malmo", { waitUntil: 'domcontentloaded' });

    const stations = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("#price_table tbody tr.table-row"));
      return rows.map(row => {
        const name = row.querySelector("td:nth-child(1) b")?.childNodes[0]?.textContent.trim();
        const city = row.querySelector("td:nth-child(1) small")?.textContent.trim();
        const address = row.querySelector("td:nth-child(1)")?.childNodes[2]?.textContent.trim();
        const priceRaw = row.querySelector("td:nth-child(2) b")?.textContent.trim();
        const date = row.querySelector("td:nth-child(2) small")?.textContent.trim();
        const href = row.dataset.href;
    
        if (name && city && address && priceRaw && date && href) {
          return {
            name,
            city,
            address,
            price: priceRaw,
            date,
            url: `https://bensinpriser.nu${href}`,
          };
        }
        return null;
      }).filter(Boolean);
    });    

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ stations }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (err) {
    console.error("Scraping error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Scraping failed", details: err.message }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
}
