import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { saveScrapedData } from "../../../db/actions";
import { brandDetails } from "../../data/brands";
import { toKebabCase } from "../../utils/helpers";

/**
 * Generates a Storybook URL based on the brand and country.
 */
function generateStorybookURL(
  brandName: string,
  country: string | null
): string {
  const base = "http://localhost:6006/?path=/story/style-guide-us-sites";
  const brandKebab = toKebabCase(brandName);
  const countryKebab = country ? toKebabCase(country) : null;
  return countryKebab
    ? `${base}-${brandKebab}--${countryKebab}`
    : `${base}--${brandKebab}`;
}

export async function GET() {
  const invalidNames = [
    "colors",
    "brand colors",
    "preset",
    "text-block",
    "bg-button",
    "text-button",
    "component",
    "semantic colors",
    "global",
    "bg-footer",
    "section",
    "bg",
    "fg",
    "dark",
    "block",
    "semantic",
    "text",
    "link",
    "foreground",
  ];

  let extractedData: {
    brand: string;
    locale: string | null;
    country: string | null;
    networkGroup: string | null;
    colors: { name: string; hex: string }[];
    fonts: { category: string; fontFamily: string }[];
  }[] = [];

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (const { brand, locale, country, networkGroup } of brandDetails) {
    const slug = toKebabCase(brand);
    const url = generateStorybookURL(brand, country);
    console.log(`🔍 Scraping: ${url}`);

    const startTime = Date.now(); // Track execution time

    try {
      // Attempt page load with timeout
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    } catch (err) {
      console.warn(`⏳ Timeout on ${brand} ${locale || ""}. Retrying...`);
      try {
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      } catch (err) {
        console.error(
          `❌ Skipping ${brand} ${locale || ""} - Page failed to load.`
        );
        continue;
      }
    }

    // Find the correct iframe
    let framePage = page;
    const iframes = await page.$$("iframe");

    if (iframes.length > 0) {
      console.log(
        `🔍 Found ${iframes.length} iframe(s), selecting the most populated one.`
      );
      let selectedFrame = null;
      let maxElements = 0;

      for (const iframe of iframes) {
        const frame = await iframe.contentFrame();
        if (frame) {
          const elementCount = (await frame.$$("body *")).length;
          if (elementCount > maxElements) {
            maxElements = elementCount;
            selectedFrame = frame;
          }
        }
      }

      if (selectedFrame) {
        framePage = selectedFrame;
        console.log(`✅ Switched to iframe with ${maxElements} elements.`);
      }
    }

    // Ensure content is fully loaded
    try {
      await framePage.waitForSelector("div[style*='background-color'], table", {
        timeout: 15000,
      });
    } catch (err) {
      console.warn(
        `⚠️ No colors/fonts found for ${brand} ${locale || ""}. Skipping.`
      );
      extractedData.push({
        brand,
        locale,
        country,
        networkGroup,
        colors: [],
        fonts: [],
      });
      continue;
    }

    // Scroll to load all elements
    await framePage.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    // Scrape colors and fonts
    const { colors, fonts } = await framePage.evaluate((invalids) => {
      function rgbToHex(rgb: string) {
        const result = rgb.match(/\d+/g);
        return result
          ? `#${(
              (1 << 24) +
              (+result[0] << 16) +
              (+result[1] << 8) +
              +result[2]
            )
              .toString(16)
              .slice(1)
              .toUpperCase()}`
          : "";
      }

      const colorData: { name: string; hex: string }[] = [];
      document.querySelectorAll("div").forEach((wrapper) => {
        const colorBox = wrapper.querySelector(
          "div[style*='background-color']"
        );
        if (!colorBox) return;

        const colorStyle = getComputedStyle(colorBox).backgroundColor;
        const hexValue = colorStyle ? rgbToHex(colorStyle) : "";

        let nameElement = wrapper.querySelector("p, span, h3, strong");
        let colorName = nameElement?.textContent?.trim() || "Unnamed";

        if (invalids.some((word) => colorName.toLowerCase().startsWith(word))) {
          return;
        }
        if (hexValue && !colorData.some((c) => c.hex === hexValue)) {
          colorData.push({ name: colorName, hex: hexValue });
        }
      });

      const fonts: { category: string; fontFamily: string }[] = [];
      document.querySelectorAll("table").forEach((table) => {
        table.querySelectorAll("tr").forEach((row) => {
          const th = row.querySelector("th");
          const td = row.querySelector("td");
          if (th && td) {
            fonts.push({
              category: th.textContent.trim(),
              fontFamily: td.textContent.trim(),
            });
          }
        });
      });

      return { colors: colorData, fonts };
    }, invalidNames);

    const executionTime = (Date.now() - startTime) / 1000;
    console.log(`✅ Completed ${brand} ${locale || ""} in ${executionTime}s.`);

    extractedData.push({
      brand,
      locale,
      country,
      networkGroup,
      colors,
      fonts,
    });

    if (colors.length > 0 || fonts.length > 0) {
      await saveScrapedData(
        brand,
        slug,
        colors,
        fonts,
        locale,
        country,
        networkGroup
      );
    }
  }

  await browser.close();
  return NextResponse.json({ extractedData });
}
