import { createRequire } from "node:module";
import { mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(__dirname, "brochure.html");
const docsDir = "/cursor/stores/self/docs";
const mediaDir = "/cursor/stores/self/media";
const printOut = path.join(docsDir, "brochure-print.pdf");
const digitalOut = path.join(docsDir, "brochure-digital.pdf");
const benefitsPreview = path.join(mediaDir, "brochure-benefits-preview.png");

async function ensurePuppeteer() {
  try {
    return require("puppeteer-core");
  } catch {
    const { execSync } = require("node:child_process");
    console.log("Installing puppeteer-core…");
    execSync("npm install --no-save puppeteer-core@23", {
      cwd: root,
      stdio: "inherit",
    });
    return require("puppeteer-core");
  }
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const puppeteer = await ensurePuppeteer();
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome-stable",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  });

  try {
    const page = await browser.newPage();
    const url = pathToFileURL(htmlPath).href;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });
    await page.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 800));

    await mkdir(docsDir, { recursive: true });
    await mkdir(mediaDir, { recursive: true });

    await page.pdf({
      path: printOut,
      printBackground: true,
      preferCSSPageSize: true,
      width: "210mm",
      height: "297mm",
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await page.pdf({
      path: digitalOut,
      printBackground: true,
      preferCSSPageSize: true,
      width: "210mm",
      height: "297mm",
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      tagged: false,
      outline: false,
    });

    // Preview of benefits page (3rd .page section)
    const box = await page.evaluate(() => {
      const pages = [...document.querySelectorAll("section.page")];
      const benefits = pages.find((el) => el.classList.contains("benefits-page")) || pages[2];
      if (!benefits) return null;
      const r = benefits.getBoundingClientRect();
      return {
        x: r.x,
        y: r.y + window.scrollY,
        width: r.width,
        height: r.height,
        index: pages.indexOf(benefits) + 1,
        total: pages.length,
      };
    });

    if (box) {
      await page.setViewport({
        width: Math.ceil(box.width),
        height: Math.ceil(box.height),
        deviceScaleFactor: 2,
      });
      await page.screenshot({
        path: benefitsPreview,
        type: "png",
        clip: {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
        },
      });
    }

    console.log(
      JSON.stringify(
        {
          printOut,
          digitalOut,
          benefitsPreview,
          benefitsPageNumber: box?.index ?? null,
          totalPages: box?.total ?? null,
          okPrint: await fileExists(printOut),
          okDigital: await fileExists(digitalOut),
          okPreview: await fileExists(benefitsPreview),
        },
        null,
        2
      )
    );
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
