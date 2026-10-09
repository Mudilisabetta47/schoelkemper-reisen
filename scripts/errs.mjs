import { chromium } from "playwright";
const b = await chromium.launch(); const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const out=[]; p.on("console", m => m.type()==="error" && out.push(m.text())); p.on("pageerror", e=>out.push(String(e)));
await p.goto("http://localhost:3210" + (process.argv[2]||"/"), { waitUntil: "networkidle" }); await p.waitForTimeout(2000);
console.log(out.join("\n---\n").slice(0, 6000)); await b.close();
