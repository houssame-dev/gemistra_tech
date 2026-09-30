import {mkdir} from "node:fs/promises";
import path from "node:path";
import {chromium} from "playwright";

const locales = ["en", "fr", "ar"];
const widths = [375, 768, 1024, 1440];
const label = process.argv[2] ?? "current";
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3005";
const outputDir = path.resolve(".screenshots", label);

await mkdir(outputDir, {recursive: true});

const browser = await chromium.launch();

async function assertNoOverflow(page, route, width) {
  const size = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth
  }));
  if (size.scrollWidth > size.viewportWidth) {
    throw new Error(
      `Horizontal overflow on ${route} at ${width}px: ${size.scrollWidth}px document width`
    );
  }
}

async function verifyLanguageMenu(page, locale, width) {
  if (width < 1024) {
    await page.locator('button[aria-controls="mobile-nav"]').click();
  }

  const trigger = page.locator('button[aria-controls="language-menu"]:visible');
  await trigger.focus();
  await trigger.press("Enter");
  const menu = page.locator('#language-menu:visible');
  await menu.waitFor();

  const currentOption = menu.locator('[role="menuitemradio"][aria-checked="true"]');
  await currentOption.waitFor();
  if (!(await currentOption.evaluate((element) => element === document.activeElement))) {
    throw new Error(`Current language option was not focused for /${locale} at ${width}px`);
  }

  await currentOption.press("ArrowDown");
  const focusedRole = await page.evaluate(() => document.activeElement?.getAttribute("role"));
  if (focusedRole !== "menuitemradio") {
    throw new Error(`Arrow-key navigation failed for /${locale} at ${width}px`);
  }

  const alignment = await page.evaluate((isRtl) => {
    const button = document.querySelector('button[aria-controls="language-menu"][aria-expanded="true"]');
    const menuElement = document.querySelector('#language-menu');
    if (!button || !menuElement) return {aligned: false};
    const buttonRect = button.getBoundingClientRect();
    const menuRect = menuElement.getBoundingClientRect();
    return {
      aligned: isRtl
        ? Math.abs(buttonRect.left - menuRect.left) < 2
        : Math.abs(buttonRect.right - menuRect.right) < 2,
      buttonLeft: buttonRect.left,
      buttonRight: buttonRect.right,
      menuLeft: menuRect.left,
      menuRight: menuRect.right
    };
  }, locale === "ar");
  if (!alignment.aligned) {
    throw new Error(`Logical menu alignment failed for /${locale} at ${width}px: ${JSON.stringify(alignment)}`);
  }

  await page.keyboard.press("Escape");
  if (await menu.isVisible()) {
    throw new Error(`Escape did not close the language menu for /${locale} at ${width}px`);
  }

  if (width < 1024 && await page.locator("#mobile-nav").isVisible()) {
    await page.locator('button[aria-controls="mobile-nav"]').click();
  }
}

try {
  for (const locale of locales) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: {width, height: 900},
        deviceScaleFactor: 1,
        reducedMotion: "reduce"
      });

      await context.addInitScript(() => {
        localStorage.setItem("gemistra-cookie-consent", "declined");
      });

      const page = await context.newPage();
      await page.goto(`${baseUrl}/${locale}`, {waitUntil: "networkidle"});
      await page.evaluate(async () => document.fonts.ready);

      const pageSize = await page.evaluate(() => ({
        height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth
      }));

      await assertNoOverflow(page, `/${locale}`, width);
      await verifyLanguageMenu(page, locale, width);

      await page.screenshot({
        path: path.join(outputDir, `${locale}-${width}-hero.png`),
        fullPage: false
      });
      await page.locator("#services").screenshot({
        path: path.join(outputDir, `${locale}-${width}-services.png`)
      });
      await page.locator("#why-us").screenshot({
        path: path.join(outputDir, `${locale}-${width}-why-us.png`)
      });
      if (width === 375 || width === 1440) {
        for (const section of ["process", "team", "testimonials", "work", "faq"]) {
          await page.locator(`#${section}`).screenshot({
            path: path.join(outputDir, `${locale}-${width}-${section}.png`)
          });
        }

        await page.locator("#contact").screenshot({
          path: path.join(outputDir, `${locale}-${width}-contact.png`)
        });
        await page.locator("footer").screenshot({
          path: path.join(outputDir, `${locale}-${width}-footer.png`)
        });

        const submitButton = page.locator('#contact button[type="submit"]');
        await submitButton.click();
        await page.locator("#contact").screenshot({
          path: path.join(outputDir, `${locale}-${width}-contact-errors.png`)
        });

        const freshContext = await browser.newContext({
          viewport: {width, height: 900},
          deviceScaleFactor: 1,
          reducedMotion: "reduce"
        });
        const freshPage = await freshContext.newPage();
        await freshPage.goto(`${baseUrl}/${locale}`, {waitUntil: "networkidle"});
        await freshPage.evaluate(async () => document.fonts.ready);
        const cookieBanner = freshPage.locator("div.fixed.inset-x-0.bottom-0");
        await cookieBanner.screenshot({
          path: path.join(outputDir, `${locale}-${width}-cookie-banner.png`)
        });

        await freshPage.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await freshPage.waitForTimeout(100);
        const floatingClip = await freshPage.evaluate(() => {
          const elements = [
            document.querySelector('a[href^="https://wa.me/"]'),
            document.querySelector(".scroll-to-top-button") ??
              document.querySelector("header button.fixed"),
            document.querySelector("div.fixed.inset-x-0.bottom-0")
          ].filter(Boolean);
          const rects = elements.map((element) => element.getBoundingClientRect());
          const minX = Math.max(0, Math.min(...rects.map((rect) => rect.left)) - 16);
          const minY = Math.max(0, Math.min(...rects.map((rect) => rect.top)) - 16);
          const maxX = Math.min(window.innerWidth, Math.max(...rects.map((rect) => rect.right)) + 16);
          const maxY = Math.min(window.innerHeight, Math.max(...rects.map((rect) => rect.bottom)) + 16);
          return {x: minX, y: minY, width: maxX - minX, height: maxY - minY};
        });
        await freshPage.screenshot({
          path: path.join(outputDir, `${locale}-${width}-floating-buttons.png`),
          clip: floatingClip
        });
        await freshContext.close();

        const pageCaptures = [
          ["project", `${baseUrl}/${locale}/projects/example-project`],
          ["privacy", `${baseUrl}/${locale}/privacy`],
          ["terms", `${baseUrl}/${locale}/terms`],
          ["not-found", `${baseUrl}/${locale}/__missing-page`],
          ["error", `${baseUrl}/${locale}/error-test`]
        ];

        for (const [name, url] of pageCaptures) {
          await page.goto(url, {waitUntil: "networkidle"});
          await page.evaluate(async () => document.fonts.ready);
          await page.waitForTimeout(100);
          await assertNoOverflow(page, new URL(url).pathname, width);
          await page.screenshot({
            path: path.join(outputDir, `${locale}-${width}-${name}.png`),
            fullPage: true
          });
        }

        await page.goto(`${baseUrl}/${locale}`, {waitUntil: "networkidle"});
        await page.evaluate(async () => document.fonts.ready);

        if (locale === "ar") {
          await page.screenshot({
            path: path.join(outputDir, `${locale}-${width}-homepage.png`),
            fullPage: false
          });
        }
      }
      await page.screenshot({
        path: path.join(outputDir, `${locale}-${width}-full.png`),
        clip: {x: 0, y: 0, width, height: pageSize.height},
        captureBeyondViewport: true
      });

      await context.close();
      console.log(`Captured ${label}: /${locale} at ${width}px`);
    }
  }
} finally {
  await browser.close();
}
