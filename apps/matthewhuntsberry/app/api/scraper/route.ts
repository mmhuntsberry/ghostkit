// app/api/scraper/route.ts

import { NextResponse } from "next/server";

/**
 * We explicitly set the runtime to "nodejs" so that this API route
 * runs in a Node.js environment (not the Edge runtime). This is required
 * for heavy libraries like Puppeteer.
 */
export const config = {
  runtime: "nodejs",
};

export async function GET() {
  try {
    // 1️⃣ Dynamically import Puppeteer-extra and its stealth plugin.
    // This avoids Next.js bundling issues caused by dynamic requires.
    const puppeteerExtra = (await import("puppeteer-extra")).default;
    const StealthPlugin = (await import("puppeteer-extra-plugin-stealth"))
      .default;

    // 2️⃣ Apply the stealth plugin to reduce detection.
    puppeteerExtra.use(StealthPlugin());

    // 3️⃣ Launch Puppeteer with a visible browser window (for debugging)
    //     and add flags to disable security restrictions so that HTTP-only pages load.
    const browser = await puppeteerExtra.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-web-security",
        "--allow-running-insecure-content",
        "--ignore-certificate-errors",
      ],
    });

    // 4️⃣ Open a new page (tab) in the browser.
    const page = await browser.newPage();

    // 5️⃣ Set a realistic user-agent to mimic a real Chrome browser.
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/110.0.0.0 Safari/537.36"
    );

    // 6️⃣ Set additional headers that a typical browser would send.
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "http://www.mypecs.com/",
    });

    // 7️⃣ Increase the default navigation timeout to 60 seconds.
    page.setDefaultNavigationTimeout(60000);

    // 8️⃣ Navigate to the MyPECS login page (HTTP).
    //     We pass ignoreHTTPSErrors: true here to help bypass certificate issues.
    await page.goto("https://www.mypecs.com/Login.aspx", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
      ignoreHTTPSErrors: true,
    });

    // 9️⃣ At this point, if the page loads, you should see the login form.
    //     (If you get a security interstitial or CAPTCHA, you'll have to manually bypass it.)
    //     Next, you could use page.type() and page.click() to automate the login,
    //     for example:
    // await page.type('#ctl00_ContentPlaceHolder1_txtUsername', process.env.MYPECS_USERNAME || '');
    // await page.type('#ctl00_ContentPlaceHolder1_txtPassword', process.env.MYPECS_PASSWORD || '');
    // await page.click('#ctl00_ContentPlaceHolder1_btnLogin');
    // await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    // For demonstration, get the current page URL after navigation.
    const currentURL = page.url();
    console.log("Current URL:", currentURL);

    //  🔟 Close the browser.
    await browser.close();

    // Return a success response with the current URL.
    return NextResponse.json({
      success: true,
      message: "Scraping attempt completed.",
      url: currentURL,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
