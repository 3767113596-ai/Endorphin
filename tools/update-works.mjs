import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const worksJsPath = path.join(siteRoot, "data", "works.js");
const worksJsonPath = path.join(siteRoot, "data", "works.json");

const accounts = {
  xhs: "https://xhslink.com/m/9rHflw5BagQ",
  douyin: "https://v.douyin.com/nMWLBWe94P8/",
};

const fallbackCatalog = {
  feedItems: [
    {
      source: "xhs",
      title: "小红书主页作品",
      summary: "小红书主页入口，运行本地更新脚本后会尽力替换为公开作品列表。",
      date: "小红书",
      url: accounts.xhs,
      cover: "",
    },
    {
      source: "wechat",
      title: "公众号文章入口",
      summary: "暂未提供公众号链接，先保留占位入口。",
      date: "公众号",
      url: "",
      cover: "",
    },
  ],
  videoItems: [
    {
      source: "douyin",
      title: "抖音主页作品",
      summary: "抖音主页入口，平台反爬时保留该入口卡。",
      date: "抖音",
      duration: "",
      url: accounts.douyin,
      cover: "",
    },
  ],
};

const fetchText = async (url) => {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
    },
  });
  return {
    finalUrl: response.url || url,
    text: await response.text(),
  };
};

const decodeHtml = (value) =>
  String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

const uniqueByUrl = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    if (!item.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
};

const extractMeta = (html, name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escaped}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }
  return "";
};

const absolutize = (url, baseUrl) => {
  if (!url) return "";
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return "";
  }
};

const parseXhs = async () => {
  try {
    const { finalUrl, text } = await fetchText(accounts.xhs);
    const noteMatches = Array.from(
      text.matchAll(/href=["']([^"']*(?:\/explore\/|\/discovery\/item\/)[^"']+)["'][^>]*>([\s\S]{0,360}?)<\/a>/gi),
    );
    const items = uniqueByUrl(
      noteMatches.map((match) => {
        const block = match[2] || "";
        const image = block.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || "";
        const title =
          block.match(/alt=["']([^"']+)["']/i)?.[1] ||
          block.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        return {
          source: "xhs",
          title: decodeHtml(title) || "小红书作品",
          summary: "",
          date: "小红书",
          url: absolutize(match[1], finalUrl),
          cover: absolutize(decodeHtml(image), finalUrl),
        };
      }),
    ).slice(0, 6);

    if (items.length) return items;

    const title = extractMeta(text, "og:title") || extractMeta(text, "description") || "小红书主页作品";
    const cover = absolutize(extractMeta(text, "og:image"), finalUrl);
    return [
      {
        source: "xhs",
        title,
        summary: "",
        date: "小红书",
        url: finalUrl || accounts.xhs,
        cover,
      },
    ];
  } catch {
    return fallbackCatalog.feedItems.filter((item) => item.source === "xhs");
  }
};

const parseDouyin = async () => {
  try {
    const { finalUrl, text } = await fetchText(accounts.douyin);
    const title = extractMeta(text, "og:title") || extractMeta(text, "description") || "抖音主页作品";
    const cover = absolutize(extractMeta(text, "og:image"), finalUrl);
    return [
      {
        source: "douyin",
        title,
        summary: "",
        date: "抖音",
        duration: "",
        url: finalUrl || accounts.douyin,
        cover,
      },
    ];
  } catch {
    return fallbackCatalog.videoItems;
  }
};

const toWorksJs = (catalog) => `window.WORKS_DATA = ${JSON.stringify(catalog, null, 2)};\n`;

const main = async () => {
  const [xhsItems, douyinItems] = await Promise.all([parseXhs(), parseDouyin()]);
  const catalog = {
    feedItems: [
      ...(xhsItems.length ? xhsItems : fallbackCatalog.feedItems.filter((item) => item.source === "xhs")),
      fallbackCatalog.feedItems.find((item) => item.source === "wechat"),
    ],
    videoItems: douyinItems.length ? douyinItems : fallbackCatalog.videoItems,
  };

  await fs.writeFile(worksJsPath, toWorksJs(catalog), "utf8");
  await fs.writeFile(worksJsonPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  console.log(`Updated ${catalog.feedItems.length} feed item(s) and ${catalog.videoItems.length} video item(s).`);
};

await main();
