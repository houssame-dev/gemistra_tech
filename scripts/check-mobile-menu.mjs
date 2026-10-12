import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const base = process.env.SCREENSHOT_BASE_URL ?? 'http://127.0.0.1:3012';
const output = '.screenshots/mobile-menu-portal';
await mkdir(output, {recursive:true});
const browser = await chromium.launch();
try {
  for (const locale of ['en','fr','ar']) {
    const context = await browser.newContext({viewport:{width:375,height:812}, reducedMotion:'reduce', hasTouch:true});
    const page = await context.newPage();
    await page.goto(`${base}/${locale}`, {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    const toggle = page.locator('header button[aria-controls="mobile-nav"]');
    for (const position of [0,600,'bottom']) {
      await page.evaluate(pos => window.scrollTo({top:pos === 'bottom' ? document.documentElement.scrollHeight : pos,behavior:'instant'}), position);
      await page.waitForTimeout(150);
      const scroll = await page.evaluate(() => window.scrollY);
      if (position !== 0) assert.notEqual(await page.locator('header').evaluate(el => getComputedStyle(el).backdropFilter), 'none');
      await toggle.click();
      const menu = page.locator('#mobile-nav');
      await menu.waitFor();
      await page.waitForTimeout(100);
      const state = await menu.evaluate(el => {
        const r=el.getBoundingClientRect();
        return {x:r.x,y:r.y,width:r.width,height:r.height,body:el.parentElement===document.body,dir:getComputedStyle(el).direction,
          focused:el.contains(document.activeElement),covered:[[1,1],[374,1],[1,811],[374,811],[187,700]].every(([x,y])=>el.contains(document.elementFromPoint(x,y)))};
      });
      assert.deepEqual(state,{x:0,y:0,width:375,height:812,body:true,dir:locale==='ar'?'rtl':'ltr',focused:true,covered:true});
      const focusables=menu.locator('a[href],button');
      await focusables.last().focus();
      await page.keyboard.press('Tab');
      assert(await focusables.first().evaluate(el=>el===document.activeElement));
      await page.keyboard.press('Shift+Tab');
      assert(await focusables.last().evaluate(el=>el===document.activeElement));
      await page.mouse.move(180,700);
      await page.mouse.wheel(0,500);
      await page.waitForTimeout(100);
      assert.equal(await page.evaluate(()=>window.scrollY),scroll);
      if(position===600){
        await menu.locator('.overflow-y-auto').evaluate(el=>el.scrollTop=0);
        await menu.locator('button').first().focus();
        await page.screenshot({path:`${output}/${locale}-375-scroll-600.png`});
      }
      await page.keyboard.press('Escape');
      await menu.waitFor({state:'detached'});
      await page.waitForTimeout(100);
      assert(await toggle.evaluate(el=>el===document.activeElement));
      assert.notEqual(await page.evaluate(()=>getComputedStyle(document.body).overflow),'hidden');
      await page.mouse.wheel(0,position==='bottom'?-300:300);
      await page.waitForTimeout(200);
      assert.notEqual(await page.evaluate(()=>window.scrollY),scroll);
      console.log(`${locale} at ${position}: viewport coverage, stacking, focus trap/return, Escape, scroll lock/release passed`);
    }
    await toggle.click();
    await page.locator('#mobile-nav a[href$="#services"]').click();
    await page.locator('#mobile-nav').waitFor({state:'detached'});
    assert.notEqual(await page.evaluate(()=>getComputedStyle(document.body).overflow),'hidden');
    await toggle.click();
    await page.locator('#mobile-nav button[aria-haspopup="menu"]').click();
    const destination=locale==='en'?'fr':'en';
    await page.locator(`#mobile-nav [role="menuitemradio"][href="/${destination}"]`).click();
    await page.waitForURL(`**/${destination}`);
    await page.locator('#mobile-nav').waitFor({state:'detached'});
    assert.notEqual(await page.evaluate(()=>getComputedStyle(document.body).overflow),'hidden');
    await context.close();
  }
} finally {await browser.close();}
