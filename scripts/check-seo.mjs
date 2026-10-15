import assert from "node:assert/strict";
import { projects } from "../src/components/portfolio/projectsData.js";
import { absoluteUrl, HOME_TITLE, OWNER_EMAIL, OWNER_PHONE } from "../src/lib/seo.js";

const base = new URL(process.argv[2] || "http://127.0.0.1:3100");
const userAgent = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const expectedUrls = [
  absoluteUrl("/"),
  ...projects.map((project) => absoluteUrl(`/projects/${project.slug}`)),
];
const titles = new Set();
const descriptions = new Set();
const internalLinks = new Map();
const htmlByPath = new Map();
const decode = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/g, "'");
const plainText = (value) =>
  decode(value.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
const attributes = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], decode(match[2])]),
  );

async function get(path) {
  return fetch(new URL(path, base), {
    headers: { "User-Agent": userAgent },
    signal: AbortSignal.timeout(20000),
    redirect: "manual",
  });
}

function meta(html, key, attribute = "name") {
  return [...html.matchAll(/<meta\b[^>]*>/g)]
    .map(([tag]) => attributes(tag))
    .filter((tag) => tag[attribute] === key)
    .map((tag) => tag.content);
}

// Validate the Schema.org vocabulary used by this portfolio, including nested nodes.
// This checks JSON and known properties; Google's external tools can check search presentation.
const vocabulary = {
  Person: [
    "name",
    "alternateName",
    "url",
    "jobTitle",
    "description",
    "email",
    "telephone",
    "image",
    "homeLocation",
    "knowsAbout",
    "sameAs",
  ],
  Place: ["name"],
  WebSite: ["name", "url", "author", "inLanguage"],
  CreativeWork: ["name", "description", "url", "creator", "keywords", "about"],
};

function validateSchema(node) {
  if (Array.isArray(node)) return node.forEach(validateSchema);
  if (!node || typeof node !== "object") return;
  if (node["@context"]) assert.equal(node["@context"], "https://schema.org");
  if (node["@id"]) assert.doesNotThrow(() => new URL(node["@id"]));
  if (node["@type"]) {
    const allowed = vocabulary[node["@type"]];
    assert.ok(allowed, `Unexpected schema type: ${node["@type"]}`);
    for (const key of Object.keys(node)) {
      assert.ok(
        ["@context", "@type", "@id", ...allowed].includes(key),
        `Unsupported ${node["@type"]} property: ${key}`,
      );
    }
    assert.ok(node.name, `${node["@type"]} needs a name`);
  }
  Object.values(node).forEach(validateSchema);
}

const robotsResponse = await get("/robots.txt");
assert.equal(robotsResponse.status, 200, "robots.txt must return 200");
const robots = await robotsResponse.text();
assert.match(robots, /User-agent:\s*\*/i);
assert.match(robots, /Allow:\s*\/\s*$/im);
assert.doesNotMatch(robots, /Disallow:\s*\/\s*$/im);
assert.ok(robots.includes(`Sitemap: ${absoluteUrl("/sitemap.xml")}`));

const sitemapResponse = await get("/sitemap.xml");
assert.equal(sitemapResponse.status, 200, "sitemap.xml must return 200");
assert.match(sitemapResponse.headers.get("content-type"), /xml/i);
const sitemap = await sitemapResponse.text();
assert.match(sitemap, /<urlset\b[^>]*xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decode(url));
assert.deepEqual(
  [...urls].sort(),
  [...expectedUrls].sort(),
  "Sitemap must contain exactly the canonical public pages",
);
assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap entries");

for (const url of urls) {
  const path = new URL(url).pathname;
  const response = await get(path);
  assert.equal(response.status, 200, `${path} must return 200 to Googlebot`);
  assert.doesNotMatch(response.headers.get("x-robots-tag") || "", /noindex|none/i);
  const html = await response.text();
  htmlByPath.set(path, html);
  const pageTitles = [...html.matchAll(/<title>(.*?)<\/title>/gs)].map(([, title]) =>
    plainText(title),
  );
  assert.equal(pageTitles.length, 1, `${path}: exactly one title`);
  assert.ok(pageTitles[0].length > 10);
  assert.ok(!titles.has(pageTitles[0]), `${path}: duplicate title`);
  titles.add(pageTitles[0]);
  const description = meta(html, "description");
  assert.equal(description.length, 1, `${path}: exactly one meta description`);
  assert.ok(
    description[0].length >= 70 && description[0].length <= 180,
    `${path}: useful, concise description`,
  );
  assert.ok(!descriptions.has(description[0]), `${path}: duplicate description`);
  descriptions.add(description[0]);
  const canonical = [...html.matchAll(/<link\b[^>]*>/g)]
    .map(([tag]) => attributes(tag))
    .filter((tag) => tag.rel === "canonical");
  // Next.js serializes the root origin without a slash; URL normalizes the equivalent forms.
  assert.deepEqual(
    canonical.map((tag) => new URL(tag.href).href),
    [url],
    `${path}: incorrect canonical`,
  );
  for (const bot of ["robots", "googlebot"]) {
    const directive = meta(html, bot);
    assert.equal(directive.length, 1, `${path}: missing or duplicate ${bot} meta tag`);
    assert.match(directive[0], /\bindex\b/);
    assert.match(directive[0], /\bfollow\b/);
    assert.doesNotMatch(directive[0], /noindex|nofollow|none/);
  }
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${path}: exactly one H1`);
  const schemas = [
    ...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs),
  ].map(([, value]) => JSON.parse(value));
  schemas.forEach(validateSchema);
  const person = schemas.find((node) => node["@type"] === "Person");
  const website = schemas.find((node) => node["@type"] === "WebSite");
  assert.ok(person && website, `${path}: missing Person or WebSite schema`);
  assert.equal(person.email, OWNER_EMAIL);
  assert.equal(person.telephone, OWNER_PHONE);
  assert.equal(website.author["@id"], person["@id"]);
  if (path === "/") {
    assert.equal(pageTitles[0], HOME_TITLE);
    assert.equal(
      plainText(html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)[1]),
      "Web Developer in Jodhpur, Rajasthan",
    );
    assert.ok(
      meta(html, "google-site-verification")[0],
      "Search Console verification token is missing",
    );
    for (const project of projects)
      assert.ok(
        html.includes(`href="/projects/${project.slug}"`),
        `Missing crawlable link to ${project.slug}`,
      );
  } else {
    assert.ok(
      schemas.some((node) => node["@type"] === "CreativeWork"),
      `${path}: missing project schema`,
    );
  }
  for (const [, hrefValue] of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
    const href = decode(hrefValue);
    if (!href || /^(mailto:|tel:|https?:\/\/)/i.test(href)) continue;
    const target = new URL(href, `${base.origin}${path}`);
    internalLinks.set(`${target.pathname}${target.hash}`, target);
  }
  console.log(`PASS ${path}: HTTP 200, unique metadata, canonical, robots, H1 and JSON-LD`);
}

for (const target of internalLinks.values()) {
  let html = htmlByPath.get(target.pathname);
  if (html === undefined) {
    const response = await get(target.pathname);
    assert.equal(response.status, 200, `Broken internal link: ${target.pathname}`);
    html = await response.text();
    htmlByPath.set(target.pathname, html);
  }
  if (target.hash) {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(([, value]) => value);
    assert.ok(
      ids.includes(decodeURIComponent(target.hash.slice(1))),
      `Broken fragment: ${target.pathname}${target.hash}`,
    );
  }
}

const missing = await get("/projects/does-not-exist-seo-check");
assert.equal(missing.status, 404, "Unknown projects must return a real 404");
assert.ok(
  meta(await missing.text(), "robots").some((directive) => /noindex/.test(directive)),
  "404 must be noindex",
);
console.log(
  `PASS robots.txt, sitemap.xml (${urls.length} canonical URLs), ${internalLinks.size} internal links, and 404 handling`,
);
