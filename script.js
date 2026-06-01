const toast = document.querySelector(".toast");
const letterGlitchCanvas = document.querySelector("[data-letter-glitch]");
const tiltStage = document.querySelector("[data-tilt]");
const tiltCard = document.querySelector(".portrait-card");
const paletteButtons = document.querySelectorAll("[data-palette]");
const navCta = document.querySelector(".nav-cta");
const friendBadge = document.querySelector(".friend-badge");
const lanyardCard = document.querySelector("[data-lanyard-card]");
const profilePhoto = document.querySelector("[data-profile-photo]");
const profileName = document.querySelector("[data-profile-name]");
const profileHeight = document.querySelector("[data-profile-height]");
const profileWeight = document.querySelector("[data-profile-weight]");
const profileHobbies = document.querySelector("[data-profile-hobbies]");
const profileClose = document.querySelector("[data-profile-close]");
const heroLede = document.querySelector("[data-hero-lede]");

const feedList = document.querySelector("[data-feed-list]");
const feedStatus = document.querySelector("[data-feed-status]");
const feedTabs = document.querySelectorAll("[data-feed-tab]");
const feedRefresh = document.querySelector("[data-feed-refresh]");

const videoList = document.querySelector("[data-video-list]");
const videoStatus = document.querySelector("[data-video-status]");
const videoTabs = document.querySelectorAll("[data-video-tab]");
const videoRefresh = document.querySelector("[data-video-refresh]");

const missionList = document.querySelector("[data-mission-list]");
const siteData = window.SITE_DATA || {};
const brandName = document.querySelector(".brand-name");
const profileId = document.querySelector(".profile-header small");
const heroName = document.querySelector(".name-mark");
const heroLines = document.querySelectorAll(".hero-line");
const statusStrip = document.querySelector(".status-strip");

const liveFeedSources = siteData.feedSources || [
  { source: "xhs", label: "小红书", endpoint: "" },
  { source: "wechat", label: "公众号", endpoint: "" },
];

const liveVideoSources = siteData.videoSources || [
  { source: "douyin", label: "抖音", endpoint: "" },
];

const initLetterGlitch = () => {
  if (!letterGlitchCanvas) return;

  const ctx = letterGlitchCanvas.getContext("2d");
  if (!ctx) return;

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789";
  const lettersAndSymbols = Array.from(characters);
  const fontSize = 20;
  const charWidth = 13;
  const charHeight = 24;
  const glitchSpeed = 50;
  const smooth = true;
  let columns = 0;
  let rows = 0;
  let letters = [];
  let lastGlitchTime = Date.now();
  let animationFrame = 0;
  let resizeTimeout = 0;

  const readThemeColors = () => [
    getComputedStyle(document.body).getPropertyValue("--pink").trim() || "#ff3ea5",
    getComputedStyle(document.body).getPropertyValue("--cyan").trim() || "#00e5ff",
    getComputedStyle(document.body).getPropertyValue("--lime").trim() || "#27ff7a",
  ];

  let glitchColors = readThemeColors();

  const getRandomChar = () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  const getRandomColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)];

  const hexToRgb = (hex) => {
    const rgb = /rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(hex);
    if (rgb) {
      return { r: parseInt(rgb[1], 10), g: parseInt(rgb[2], 10), b: parseInt(rgb[3], 10) };
    }
    const value = hex.trim().replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 0, g: 229, b: 255 };
  };

  const interpolateColor = (start, end, factor) => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor),
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  };

  const initializeLetters = () => {
    const totalLetters = columns * rows;
    letters = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  const drawLetters = () => {
    const width = letterGlitchCanvas.clientWidth;
    const height = letterGlitchCanvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${fontSize}px Consolas, "Courier New", monospace`;
    ctx.textBaseline = "top";
    ctx.shadowBlur = 0;

    letters.forEach((letter, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const depth = 0.42 + (row / Math.max(rows, 1)) * 0.72;
      const wave = Math.sin(row * 0.34 + Date.now() * 0.0014) * 1.8;
      const x = column * charWidth + wave * depth;
      const y = row * charHeight;
      const color = hexToRgb(letter.color);

      ctx.globalAlpha = 0.16 + depth * 0.18;
      ctx.fillStyle = `rgb(${Math.round(color.r * 0.42)}, ${Math.round(color.g * 0.42)}, ${Math.round(color.b * 0.42)})`;
      ctx.fillText(letter.char, x - 3.4 * depth, y - 2.2 * depth);

      ctx.globalAlpha = 0.24 + depth * 0.24;
      ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
      ctx.fillText(letter.char, x + 3.2 * depth, y + 3.6 * depth);

      ctx.globalAlpha = 0.38 + depth * 0.54;
      ctx.shadowColor = letter.color;
      ctx.shadowBlur = 5 + depth * 8;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  const resizeCanvas = () => {
    const rect = letterGlitchCanvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    letterGlitchCanvas.width = rect.width * dpr;
    letterGlitchCanvas.height = rect.height * dpr;
    letterGlitchCanvas.style.width = `${rect.width}px`;
    letterGlitchCanvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    columns = Math.ceil(rect.width / charWidth);
    rows = Math.ceil(rect.height / charHeight);
    initializeLetters();
    drawLetters();
  };

  const updateLetters = () => {
    const updateCount = Math.max(1, Math.floor(letters.length * 0.05));
    for (let index = 0; index < updateCount; index += 1) {
      const letter = letters[Math.floor(Math.random() * letters.length)];
      if (!letter) continue;
      letter.char = getRandomChar();
      letter.targetColor = getRandomColor();
      letter.colorProgress = smooth ? 0 : 1;
      if (!smooth) letter.color = letter.targetColor;
    }
  };

  const smoothTransitions = () => {
    let needsRedraw = false;
    letters.forEach((letter) => {
      if (letter.colorProgress >= 1) return;
      letter.colorProgress = Math.min(1, letter.colorProgress + 0.05);
      letter.color = interpolateColor(hexToRgb(letter.color), hexToRgb(letter.targetColor), letter.colorProgress);
      needsRedraw = true;
    });
    if (needsRedraw) drawLetters();
  };

  const animate = () => {
    const now = Date.now();
    if (now - lastGlitchTime >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime = now;
    }
    if (smooth) smoothTransitions();
    animationFrame = window.requestAnimationFrame(animate);
  };

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(resizeCanvas, 100);
  });

  paletteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.setTimeout(() => {
        glitchColors = readThemeColors();
        initializeLetters();
        drawLetters();
      }, 0);
    });
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    resizeCanvas();
    return;
  }

  resizeCanvas();
  animate();

  window.addEventListener("beforeunload", () => window.cancelAnimationFrame(animationFrame));
};

const fallbackFeedItems = siteData.feedItems || [
  {
    source: "xhs",
    title: "AI 编程把个人网站做成开放世界",
    summary: "最新小红书作品会出现在这里，接入作品接口后自动替换。",
    date: "LIVE",
    url: "#top",
  },
  {
    source: "wechat",
    title: "一人公司的网站系统该怎么搭",
    summary: "公众号文章接入 RSS 或中转接口后，会按发布时间实时同步。",
    date: "LIVE",
    url: "#top",
  },
];

const fallbackVideoItems = siteData.videoItems || [
  {
    source: "douyin",
    title: "用 AI 编程重做一个赛博朋克个人网站",
    duration: "02:27",
    date: "LIVE",
    url: "#top",
  },
  {
    source: "douyin",
    title: "这个时代为什么适合把想法做出来",
    duration: "01:58",
    date: "LIVE",
    url: "#top",
  },
];

const defaultMissions = siteData.missions || [
  {
    id: "m-2025-09",
    date: "2025.09",
    title: "上线个人品牌网站",
    description: "建立可持续更新的主页、文章、视频和项目入口。",
  },
  {
    id: "m-2025-12",
    date: "2025.12",
    title: "AI 工作流产品化",
    description: "把内容选题、脚本、发布清单和复盘流程做成工具。",
  },
  {
    id: "m-2026-01",
    date: "2026.01",
    title: "开放式数字作品集",
    description: "像游戏任务一样记录每次升级，让进步被看见。",
  },
];

let activeFeed = "all";
let currentFeedItems = fallbackFeedItems;
let activeVideo = "all";
let currentVideoItems = fallbackVideoItems;
let missions = defaultMissions;

const defaultProfile = siteData.profile || {
  name: "内啡肽",
  height: "180",
  weight: "68",
  hobbies: "编程 / 音乐 / 健身 / 摄影",
  photo: "./assets/portrait-cyberpunk.png",
};

let profileData = defaultProfile;
const defaultHeroLede =
  siteData.hero?.lede ||
  "我用 AI 编程、内容叙事和个人品牌系统，把脑子里的想法快速做成网站、工具、视频和可以持续更新的数字作品。";
let heroLedeText = defaultHeroLede;

if (brandName && siteData.profile?.brand) {
  brandName.textContent = siteData.profile.brand;
}

if (profileId && siteData.profile?.id) {
  profileId.textContent = `ID: ${siteData.profile.id}`;
}

if (heroName && siteData.hero?.name) {
  heroName.textContent = siteData.hero.name;
}

if (siteData.hero?.lines) {
  heroLines.forEach((line, index) => {
    if (siteData.hero.lines[index]) line.textContent = siteData.hero.lines[index];
  });
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const truncateText = (value, limit = 10) => {
  const text = String(value || "").trim();
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
};

if (statusStrip && siteData.hero?.status) {
  statusStrip.innerHTML = siteData.hero.status.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
}

const getSourceLabel = (sources, source) =>
  sources.find((item) => item.source === source)?.label || "内容";

const updateStatus = (node, message) => {
  if (node) node.textContent = message;
};

const renderProfile = () => {
  if (profileName) profileName.textContent = profileData.name;
  if (profileHeight) profileHeight.textContent = profileData.height;
  if (profileWeight) profileWeight.textContent = profileData.weight;
  if (profileHobbies) profileHobbies.textContent = profileData.hobbies;
  if (profilePhoto) profilePhoto.src = profileData.photo;
};

renderProfile();

if (heroLede) {
  heroLede.textContent = heroLedeText;
}

const savedPalette = localStorage.getItem("palette") || "pink";
document.body.dataset.palette = savedPalette;

const updatePaletteButtons = (activePalette) => {
  paletteButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.palette === activePalette));
  });
};

updatePaletteButtons(savedPalette);

paletteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextPalette = button.dataset.palette;
    document.body.dataset.palette = nextPalette;
    localStorage.setItem("palette", nextPalette);
    updatePaletteButtons(nextPalette);
  });
});

if (navCta && friendBadge) {
  navCta.addEventListener("click", (event) => {
    event.preventDefault();
    friendBadge.style.setProperty("--drag-x", "0px");
    friendBadge.style.setProperty("--drag-y", "0px");
    friendBadge.style.setProperty("--badge-rz", "0deg");
    if (lanyardCard) {
      lanyardCard.style.setProperty("--card-x", "0px");
      lanyardCard.style.setProperty("--card-y", "0px");
      lanyardCard.style.setProperty("--card-rx", "0deg");
      lanyardCard.style.setProperty("--card-ry", "0deg");
      lanyardCard.style.setProperty("--card-rz", "0deg");
    }
    friendBadge.classList.remove("hide");
    friendBadge.classList.remove("drop");
    void friendBadge.offsetWidth;
    friendBadge.classList.add("drop");
  });
}

if (friendBadge && lanyardCard) {
  const lanyard = {
    dragging: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    raf: 0,
  };

  const setLanyardVars = () => {
    const rotateZ = Math.max(-12, Math.min(12, lanyard.x * 0.035));
    const rotateY = Math.max(-16, Math.min(16, lanyard.x * 0.045));
    const rotateX = Math.max(-12, Math.min(12, -lanyard.y * 0.035));
    friendBadge.style.setProperty("--drag-x", `${lanyard.x.toFixed(1)}px`);
    friendBadge.style.setProperty("--drag-y", `${lanyard.y.toFixed(1)}px`);
    friendBadge.style.setProperty("--badge-rz", `${rotateZ.toFixed(2)}deg`);
    lanyardCard.style.setProperty("--card-x", `${(lanyard.x * 0.04).toFixed(1)}px`);
    lanyardCard.style.setProperty("--card-y", `${(lanyard.y * 0.025).toFixed(1)}px`);
    lanyardCard.style.setProperty("--card-rx", `${rotateX.toFixed(2)}deg`);
    lanyardCard.style.setProperty("--card-ry", `${rotateY.toFixed(2)}deg`);
    lanyardCard.style.setProperty("--card-rz", `${rotateZ.toFixed(2)}deg`);
  };

  const settleLanyard = () => {
    if (lanyard.dragging) return;
    lanyard.vx += (0 - lanyard.x) * 0.055;
    lanyard.vy += (0 - lanyard.y) * 0.055;
    lanyard.vx *= 0.74;
    lanyard.vy *= 0.74;
    lanyard.x += lanyard.vx;
    lanyard.y += lanyard.vy;
    setLanyardVars();
    if (Math.abs(lanyard.x) + Math.abs(lanyard.y) + Math.abs(lanyard.vx) + Math.abs(lanyard.vy) > 0.6) {
      lanyard.raf = window.requestAnimationFrame(settleLanyard);
    } else {
      lanyard.x = 0;
      lanyard.y = 0;
      lanyard.vx = 0;
      lanyard.vy = 0;
      setLanyardVars();
      lanyard.raf = 0;
    }
  };

  lanyardCard.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, input, label, textarea, a")) return;
    lanyard.dragging = true;
    lanyard.startX = event.clientX - lanyard.x;
    lanyard.startY = event.clientY - lanyard.y;
    lanyard.vx = 0;
    lanyard.vy = 0;
    friendBadge.classList.add("dragging");
    lanyardCard.setPointerCapture(event.pointerId);
  });

  lanyardCard.addEventListener("pointermove", (event) => {
    if (!lanyard.dragging) return;
    const nextX = Math.max(-160, Math.min(160, event.clientX - lanyard.startX));
    const nextY = Math.max(-60, Math.min(180, event.clientY - lanyard.startY));
    lanyard.vx = nextX - lanyard.x;
    lanyard.vy = nextY - lanyard.y;
    lanyard.x = nextX;
    lanyard.y = nextY;
    setLanyardVars();
  });

  const releaseLanyard = (event) => {
    if (!lanyard.dragging) return;
    lanyard.dragging = false;
    friendBadge.classList.remove("dragging");
    try {
      lanyardCard.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released if the pointer leaves the window.
    }
    if (!lanyard.raf) {
      lanyard.raf = window.requestAnimationFrame(settleLanyard);
    }
  };

  lanyardCard.addEventListener("pointerup", releaseLanyard);
  lanyardCard.addEventListener("pointercancel", releaseLanyard);
  lanyardCard.addEventListener("lostpointercapture", () => {
    if (!lanyard.dragging) return;
    lanyard.dragging = false;
    friendBadge.classList.remove("dragging");
    if (!lanyard.raf) {
      lanyard.raf = window.requestAnimationFrame(settleLanyard);
    }
  });
}

if (profileClose && friendBadge) {
  profileClose.addEventListener("click", () => {
    friendBadge.classList.remove("drop");
    friendBadge.classList.add("hide");
  });
}

const normalizeItems = (payload, source) => {
  const items = Array.isArray(payload) ? payload : payload.items || [];
  return items.map((item) => ({
    source: item.source || source,
    title: item.title || "未命名内容",
    summary: item.summary || item.description || item.excerpt || "",
    date: item.date || item.pubDate || item.createdAt || "NEW",
    duration: item.duration || item.length || "",
    url: item.url || item.link || "#top",
    cover: item.cover || item.coverUrl || item.image || item.thumbnail || "",
  }));
};

const normalizeRssItems = (text, source) => {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const items = Array.from(doc.querySelectorAll("item, entry"));

  return items.map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() || "未命名内容";
    const summary =
      item.querySelector("description")?.textContent?.trim() ||
      item.querySelector("summary")?.textContent?.trim() ||
      item.querySelector("content")?.textContent?.trim() ||
      "";
    const link =
      item.querySelector("link")?.getAttribute("href") ||
      item.querySelector("link")?.textContent?.trim() ||
      "#top";
    const date =
      item.querySelector("pubDate")?.textContent?.trim() ||
      item.querySelector("published")?.textContent?.trim() ||
      item.querySelector("updated")?.textContent?.trim() ||
      "NEW";
    const cover =
      item.querySelector("media\\:thumbnail")?.getAttribute("url") ||
      item.querySelector("media\\:content")?.getAttribute("url") ||
      item.querySelector("enclosure")?.getAttribute("url") ||
      "";

    return {
      source,
      title,
      summary,
      date,
      url: link,
      cover,
    };
  });
};

const loadSourceItems = async (source) => {
  const divider = source.endpoint.includes("?") ? "&" : "?";
  const response = await fetch(`${source.endpoint}${divider}t=${Date.now()}`);
  if (!response.ok) throw new Error(source.label);

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (contentType.includes("xml") || text.trim().startsWith("<")) {
    return normalizeRssItems(text, source.source);
  }

  return normalizeItems(JSON.parse(text), source.source);
};

const loadRemoteItems = async (sources, fallbackItems, setItems, render, statusNode) => {
  const connectedSources = sources.filter((source) => source.endpoint);
  if (connectedSources.length === 0) {
    setItems(fallbackItems);
    updateStatus(statusNode, "WAITING FOR API");
    render();
    return;
  }

  updateStatus(statusNode, "SYNCING...");
  try {
    const responses = await Promise.all(
      connectedSources.map((source) => loadSourceItems(source)),
    );
    setItems(responses.flat());
    updateStatus(statusNode, `SYNCED ${new Date().toLocaleTimeString("zh-CN", { hour12: false })}`);
    render();
  } catch {
    setItems(fallbackItems);
    updateStatus(statusNode, "SYNC FAILED");
    render();
  }
};

const renderFeed = () => {
  if (!feedList) return;

  const visibleItems =
    activeFeed === "all"
      ? currentFeedItems
      : currentFeedItems.filter((item) => item.source === activeFeed);

  feedList.innerHTML = visibleItems
    .map(
      (item) => `
        <article class="feed-card ${item.cover ? "has-cover" : ""}" data-source="${escapeHtml(item.source)}">
          ${
            item.cover
              ? `<figure class="feed-cover"><img src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" loading="lazy"></figure>`
              : ""
          }
          <span class="feed-source">${escapeHtml(getSourceLabel(liveFeedSources, item.source))}</span>
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
            <div class="feed-meta">
              <span>${escapeHtml(item.date)}</span>
              <span>LIVE SYNC</span>
            </div>
          </div>
          <a class="feed-open" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer" aria-label="打开内容">→</a>
        </article>
      `,
    )
    .join("");
};

const loadLiveFeed = () =>
  loadRemoteItems(
    liveFeedSources,
    fallbackFeedItems,
    (items) => {
      currentFeedItems = items;
    },
    renderFeed,
    feedStatus,
  );

feedTabs.forEach((button) => {
  button.addEventListener("click", () => {
    activeFeed = button.dataset.feedTab;
    feedTabs.forEach((tab) => tab.classList.toggle("active", tab === button));
    renderFeed();
  });
});

if (feedRefresh) {
  feedRefresh.addEventListener("click", loadLiveFeed);
}

const renderVideos = () => {
  if (!videoList) return;

  const visibleItems =
    activeVideo === "all"
      ? currentVideoItems
      : currentVideoItems.filter((item) => item.source === activeVideo);

  videoList.innerHTML = visibleItems
    .map(
      (item) => `
        <article data-source="${escapeHtml(item.source)}">
          <a class="video-card-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(item.title)}">
            <div class="thumb">
              ${
                item.cover
                  ? `<img class="video-cover" src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" loading="lazy">`
                  : escapeHtml(getSourceLabel(liveVideoSources, item.source))
              }
            </div>
            <h3 title="${escapeHtml(item.title)}">${escapeHtml(truncateText(item.title, 10))}</h3>
          </a>
        </article>
      `,
    )
    .join("");
};

const loadLiveVideos = () =>
  loadRemoteItems(
    liveVideoSources,
    fallbackVideoItems,
    (items) => {
      currentVideoItems = items;
    },
    renderVideos,
    videoStatus,
  );

videoTabs.forEach((button) => {
  button.addEventListener("click", () => {
    activeVideo = button.dataset.videoTab;
    videoTabs.forEach((tab) => tab.classList.toggle("active", tab === button));
    renderVideos();
  });
});

if (videoRefresh) {
  videoRefresh.addEventListener("click", loadLiveVideos);
}

const renderMissions = () => {
  if (!missionList) return;

  missionList.innerHTML = missions
    .map(
      (mission) => `
        <article data-mission-id="${escapeHtml(mission.id)}">
          <span class="date">${escapeHtml(mission.date)}</span>
          <h3>${escapeHtml(mission.title)}</h3>
          <p>${escapeHtml(mission.description)}</p>
        </article>
      `,
    )
    .join("");
};

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(text);
      toast.textContent = `已复制：${text}`;
    } catch {
      toast.textContent = text;
    }
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1800);
  });
});

if (tiltStage && tiltCard) {
  tiltStage.addEventListener("pointermove", (event) => {
    const rect = tiltStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 18;
    const rotateX = (0.5 - y) * 14;

    tiltCard.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
    tiltCard.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
    tiltCard.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    tiltCard.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  });

  tiltStage.addEventListener("pointerleave", () => {
    tiltCard.style.setProperty("--rx", "0deg");
    tiltCard.style.setProperty("--ry", "0deg");
    tiltCard.style.setProperty("--mx", "52%");
    tiltCard.style.setProperty("--my", "42%");
  });
}

const sections = Array.from(document.querySelectorAll("main section[id]"));
const navLinks = Array.from(document.querySelectorAll(".nav a"));

const setActiveNav = () => {
  let current;
  for (let index = sections.length - 1; index >= 0; index -= 1) {
    if (sections[index].getBoundingClientRect().top < 160) {
      current = sections[index];
      break;
    }
  }
  if (!current) return;
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
};

renderMissions();
initLetterGlitch();
loadLiveFeed();
loadLiveVideos();
window.setInterval(loadLiveFeed, 180000);
window.setInterval(loadLiveVideos, 180000);
window.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();

