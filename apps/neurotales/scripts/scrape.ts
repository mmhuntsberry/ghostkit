import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import AnonymizeUAPlugin from "puppeteer-extra-plugin-anonymize-ua";
import { executablePath } from "puppeteer";

// Apply Puppeteer Extra Plugins
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true })); // Blocks analytics & trackers
puppeteer.use(AnonymizeUAPlugin()); // Prevents revealing real user-agent

async function runScraper() {
  try {
    console.log("🚀 Launching Puppeteer...");

    // 1️⃣ Launch Puppeteer with Proxy & Security Bypass
    const browser = await puppeteer.launch({
      headless: false, // Set to true for production
      executablePath: executablePath(), // Use system Chrome instead of bundled Chromium
      args: [
        // "--no-sandbox",
        // "--disable-setuid-sandbox",
        // "--disable-blink-features=AutomationControlled",
        // "--disable-web-security",
        // "--allow-running-insecure-content",
        // "--ignore-certificate-errors",
        // "--disable-features=IsolateOrigins,site-per-process",
        // "--disable-extensions",
        // "--proxy-server=http://your-proxy-ip:port", // 🔹 Replace with a working proxy if needed
      ],
    });

    const page = await browser.newPage();

    // 2️⃣ Block Unwanted Resources (Bright Data Best Practice)
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const blockedResources = ["image", "stylesheet", "media", "font"];
      if (blockedResources.includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // 3️⃣ Set User-Agent & Headers
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/110.0.0.0 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "http://www.mypecs.com/",
    });

    page.setDefaultNavigationTimeout(60000);

    console.log("🌍 Navigating to MyPECS login page...");

    await page.goto("http://www.mypecs.com/Login.aspx", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
      ignoreHTTPSErrors: true,
    });

    console.log("✅ Page loaded successfully!");

    // 4️⃣ Check for Login Form & Solve CAPTCHA If Present
    const isCaptchaPresent = await page.$(
      'iframe[title="recaptcha challenge"]'
    );
    if (isCaptchaPresent) {
      console.warn("⚠️ CAPTCHA detected! Manual intervention required.");
      return;
    }

    // 5️⃣ Inject Session Cookies (Optional - If You Manually Login)
    const cookies = [
      {
        name: "ASP.NET_SessionId",
        value: "your-session-id",
        domain: "www.mypecs.com",
      },
    ];
    await page.setCookie(...cookies);

    console.log("🔄 Session Cookies Applied");

    // 6️⃣ Perform Login
    await page.type(
      "#ctl00_ContentPlaceHolder1_txtUsername",
      process.env.MYPECS_USERNAME || ""
    );
    await page.type(
      "#ctl00_ContentPlaceHolder1_txtPassword",
      process.env.MYPECS_PASSWORD || ""
    );
    await page.click("#ctl00_ContentPlaceHolder1_btnLogin");
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });

    console.log("✅ Successfully logged in!");

    // 7️⃣ Take Screenshot (For Debugging)
    await page.screenshot({ path: "login-success.png", fullPage: true });

    await browser.close();
    console.log("🛑 Browser closed.");
  } catch (error) {
    console.error("❌ Scraper error:", error);
  }
}

runScraper();
