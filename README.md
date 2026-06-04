# Endorphin Cyberpunk Personal Site

Static cyberpunk personal website for GitHub Pages.

## Works data

Edit `data/works.js` to publish works from Xiaohongshu, WeChat Official Account, and Douyin. The page also supports `data/works.json` as a fallback source when opened through a web server.

- Put Xiaohongshu and WeChat article items in `feedItems`.
- Put Douyin video items in `videoItems`.
- Supported fields: `source`, `title`, `summary`, `date`, `url`, `cover`, `duration`.
- Use `source: "xhs"` for Xiaohongshu, `source: "wechat"` for WeChat, and `source: "douyin"` for Douyin.
- Run `node tools/update-works.mjs` to best-effort refresh public Xiaohongshu and Douyin account data. If a platform blocks scraping, the script keeps a profile entry card.
