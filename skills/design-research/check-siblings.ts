// Siblings in one row must match: same height, same inner positions
// Usage: bun check-siblings.ts <url> [url...] | --selftest   (PLAYWRIGHT=<path> if needed)
// Groups: 2+ block children of one parent, same tag, 70%+ shared classes, same row.
// Mark deliberate exceptions with data-exempt; card bodies whose content may differ with
// data-slot="section-body" (only [data-slot] parts inside are compared).
const { chromium } = await import(process.env.PLAYWRIGHT ?? `${process.cwd()}/node_modules/playwright/index.js`);
const ids = process.argv.includes("--selftest") ? ["selftest"] : process.argv.slice(2);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
let bad = 0;
let total = 0;
const selftest = `<div style="display:flex;gap:8px"><div class="t" style="padding:8px"><h2 class="h">One</h2><p class="v">1</p></div><div class="t" style="padding:8px"><h2 class="h">Two lines<br>wrap</h2><p class="v">2</p></div></div>`;
for (const id of ids) {
  if (id === "selftest") await page.setContent(selftest);
  else await page.goto(id, { waitUntil: "networkidle" });
  const { issues, rows: compared, cards }: { issues: string[]; rows: number; cards: number } = await page.evaluate(() => {
    const out: string[] = [];
    let compared = 0;
    const tol = 1;
    // A group: 2+ block children of one parent with the same class list, side by side
    const block = (e: Element) => !["inline", "contents", "none"].includes(getComputedStyle(e).display) && !["TD", "TH", "TR", "TBODY", "THEAD", "svg"].includes(e.tagName);
    const label = (e: Element) => (e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 22);
    for (const parent of Array.from(document.querySelectorAll("body *"))) {
      // data-exempt: deliberately different (the raised centre nav button)
      const kids = Array.from(parent.children).filter((c) => block(c) && !c.hasAttribute("data-exempt") && c.getBoundingClientRect().height > 24 && c.getAttribute("class"));
      // same tag and 70%+ shared classes = same component (a selected tile adds a few classes)
      const cls = (e: Element) => new Set(e.getAttribute("class")!.split(/\s+/));
      const alike = (a: Element, b: Element) => { if (a.tagName !== b.tagName) return false; const x = cls(a), y = cls(b); const inter = [...x].filter((c) => y.has(c)).length; return inter / Math.max(x.size, y.size) >= 0.7; };
      const groups: Element[][] = [];
      for (const k of kids) { const g = groups.find((g) => alike(g[0], k)); if (g) g.push(k); else groups.push([k]); }
      for (const els of groups) {
        const rows = new Map<number, Element[]>();
        for (const e of els) { const t = Math.round(e.getBoundingClientRect().top / 3); rows.set(t, [...(rows.get(t) ?? []), e]); }
        for (const row of rows.values()) {
          if (row.length < 2) continue;
          compared++;
          const hs = row.map((e) => e.getBoundingClientRect().height);
          if (Math.max(...hs) - Math.min(...hs) > tol) out.push(`heights ${hs.map(Math.round).join("/")}: ${row.map(label).join(" | ")}`);
          // same-index descendants with the same tag+class must sit at the same offset
          // different structures (a form column beside a summary column) are not one component
          if (new Set(row.map((e) => e.children.length)).size > 1) continue;
          // inside a card body, content may differ: compare only tagged parts there
          const counts = (e: Element, d: Element) => { const body = d.closest("[data-slot=section-body]"); return !body || !e.contains(body) || d.hasAttribute("data-slot"); };
          const inner = row.map((e) => Array.from(e.querySelectorAll("*")).filter((d) => block(d) && counts(e, d)).map((d) => ({ k: d.tagName + "." + (d.getAttribute("class") ?? ""), y: d.getBoundingClientRect().top - e.getBoundingClientRect().top })));
          const n = Math.min(...inner.map((x) => x.length));
          for (let i = 0; i < n; i++) {
            const col = inner.map((x) => x[i]);
            if (col.some((c) => c.k.split(".")[0] !== col[0].k.split(".")[0])) break;
            const ys = col.map((c) => c.y);
            if (Math.max(...ys) - Math.min(...ys) > tol) { out.push(`inner offset ${ys.map(Math.round).join("/")} (${col[0].k.slice(0, 40)}): ${row.map(label).join(" | ")}`); break; }
          }
        }
      }
    }
    return { issues: [...new Set(out)], rows: compared, cards: document.body.innerText.trim().length };
  });
  if (!cards) { bad++; console.log(`${id}\n  page empty (server down or broken)`); continue; }
  total += compared;
  if (issues.length) { bad++; console.log(`${id}\n  ${issues.join("\n  ")}`); }
}
await browser.close();
console.log(`${ids.length - bad} of ${ids.length} screens: every row of siblings matches (${total} rows compared)`);
process.exit(bad ? 1 : 0);
