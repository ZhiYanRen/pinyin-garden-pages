// Optional browser QA: supply PLAYWRIGHT_MODULE and BROWSER_EXECUTABLE for a local installation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const engines=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const engine=process.env.TEST_BROWSER||'chromium';
assert(['chromium','webkit'].includes(engine),'supported QA browser');
const browser=await engines[engine].launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
const base=process.env.TEST_URL||'http://localhost:4173';
const reports=[];
fs.mkdirSync('work/qa',{recursive:true});
try {
 for(const [width,height] of [[1440,900],[1194,834],[1024,768],[834,1194],[768,1024],[390,844],[844,390]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<1300,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.setDefaultTimeout(10000);
  page.on('pageerror',error=>errors.push(error.message));
  const action=name=>page.locator(name==='settings'?'.avatar':`[data-action="${name}"]`).first();
  const nav=name=>page.locator(`.nav [data-page="${name}"]`).click();
  const noOverflow=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${width}×${height}`);
  await page.goto(base);await page.waitForSelector('.study-launch');await noOverflow();
  assert.equal(await page.getByText('安装到 iPad').count(),0);
  const navBox=await page.locator('.sidebar').boundingBox();
  if(width<1000)assert(navBox.y>0&&navBox.width===width,'compact layout uses bottom navigation');
  assert((await action('settings').last().boundingBox()).height>=44);
  await nav('books');await noOverflow();await nav('review');await noOverflow();
  await nav('pinyin');await page.locator('[data-action="topic"][data-id="bp"]').click();
  await page.locator('[data-mode="write"]').click();await noOverflow();
  const canvas=page.locator('#writing');const box=await canvas.boundingBox();
  assert((await page.locator('.canvas-wrap').boundingBox()).height>=240,'writing area provides room for touch');
  await canvas.scrollIntoViewIfNeeded();const rect=await canvas.boundingBox();
  await page.mouse.move(rect.x+20,rect.y+20);await page.mouse.down();await page.mouse.move(rect.x+80,rect.y+80,{steps:5});await page.mouse.up();
  const strokes=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('pinyin-garden-v1')).session.strokes);
  const saved=await strokes();assert(saved[0].length>1);
  await page.setViewportSize({width:height,height:width});await noOverflow();assert.deepEqual(await strokes(),saved,'rotation preserves ink');
  await page.setViewportSize({width,height});await action('pause').click();await nav('home');await action('resume').click();assert.deepEqual(await strokes(),saved,'resume preserves ink');
  await nav('pinyin');await page.locator('[data-action="topic"][data-id="bp"]').click();await page.locator('[data-mode="type"]').click();await action('confirm-start').click();
  await page.locator('#answer-input').fill('lv');await page.locator('[data-action="tone"][data-tone="4"]').click();assert.equal(await page.locator('#answer-input').inputValue(),'lǜ');await noOverflow();
  assert(await page.locator('#answer-form button[type="submit"]').isVisible());
  await page.screenshot({path:`work/qa/type-${width}.png`,fullPage:true});
  await action('settings').last().click();
  const modal=page.locator('#dialog');assert(await modal.isVisible());
  const modalBox=await modal.boundingBox();assert(modalBox.y>=0&&modalBox.y+modalBox.height<=height+1,'dialog stays in viewport');
  await page.locator('#setting-rate').selectOption('0.75');
  await page.locator('.dialog-body').evaluate(el=>el.scrollTop=el.scrollHeight);
  assert(await page.getByRole('button',{name:'使用说明',exact:true}).isVisible());
  await page.keyboard.press('Escape');assert(!await modal.isVisible());
  await page.waitForFunction(()=>document.activeElement?.dataset.action==='settings',null,{timeout:2000});
  await action('settings').last().click();await page.setViewportSize({width,height:Math.min(height,400)});
  await page.waitForTimeout(100);const short=await modal.boundingBox();assert(short.y+short.height<=Math.min(height,400)+1,'dialog shrinks with visible height');
  await page.keyboard.press('Escape');assert.deepEqual(errors,[]);
  reports.push({width,height,passed:true,checks:['navigation','no overflow','touch size','handwriting rotation and resume','tone input','modal scroll, Escape and focus','short viewport','reduced motion']});
  await context.close();
 }
 fs.writeFileSync(`tests/reports/ipad-${engine}-report.json`,JSON.stringify({browser:`${engine} desktop with touch emulation`,physicalDevice:false,reports},null,2)+'\n');
 console.log(`PASS ${reports.length} viewport workflows`);
}finally{await browser.close();}
