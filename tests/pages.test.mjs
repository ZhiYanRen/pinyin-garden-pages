import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../dist');
test('static application can be published under a GitHub Pages project path',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const [,ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)){if(ref.startsWith('#')||ref.startsWith('http'))continue;assert(!ref.startsWith('/'),`absolute asset: ${ref}`);assert(fs.existsSync(path.join(root,ref)));}
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest')));assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');
 const app=fs.readFileSync(path.join(root,'app.js'),'utf8');assert(!app.includes('首次打开私有网址可能需要家长登录当前 ChatGPT 账号'),'old hosting login requirement remains');
 for(const f of fs.readdirSync(root).filter(f=>f.endsWith('.js')))for(const [,ref] of fs.readFileSync(path.join(root,f),'utf8').matchAll(/from\s+['"](\.[^'"]+)['"]/g))assert(fs.existsSync(path.resolve(root,ref)),`${f}: missing ${ref}`);
});
