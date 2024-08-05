const bingSearch = require("bing-search");
const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeGoogle(query) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.google.com/search?q=${query}`);

  await page.waitForSelector(".g");

  const results = await page.$$eval(".g", (elements) => {
    return elements.map((element) => {
      const title = element.querySelector("h3")
        ? element.querySelector("h3").textContent
        : "";
      const link = element.querySelector("a")
        ? element.querySelector("a").href
        : "";
      return { title, link };
    });
  });

  await browser.close();

  return results;
}

async function main() {
  const query = await new Promise((resolve) => {
    const rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter your search query: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });

  const results = await scrapeGoogle(query);

  const output = results
    .map((result) => `${result.title}\n${result.link}\n`)
    .join("\n");
  fs.writeFileSync("google_results.txt", output);

  console.log("Results saved to google_results.txt");
}

main();
