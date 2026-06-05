const toast = document.querySelector(".toast");
const letterGlitchCanvas = document.querySelector("[data-letter-glitch]");
const heroSection = document.querySelector("[data-hero-pointer-root]");
const heroPointer = document.querySelector("[data-hero-pointer]");
const tiltStage = document.querySelector("[data-tilt]");
const tiltCard = document.querySelector("[data-avatar-reveal]");
const paletteButtons = document.querySelectorAll("[data-palette]");
const navCta = document.querySelector(".nav-cta");
const friendBadge = document.querySelector(".friend-badge");
const lanyardCard = document.querySelector("[data-lanyard-card]");
const profilePhoto = document.querySelector("[data-profile-photo]");
const profilePlanetId = document.querySelector("[data-profile-id]");
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
const transitionSections = Array.from(document.querySelectorAll(".hero, .section"));
const storyPages = Array.from(document.querySelectorAll("[data-story-page]"));
const progressPage = document.querySelector("[data-progress-page]");
const progressNodes = Array.from(document.querySelectorAll("[data-progress-node]"));
const progressPanels = Array.from(document.querySelectorAll("[data-progress-panel]"));
const progressTicks = document.querySelector("[data-progress-ticks]");
const storyFeed = document.querySelector("[data-story-feed]");
const storyVideo = document.querySelector("[data-story-video]");
const scrollPhasePages = Array.from(document.querySelectorAll("[data-scroll-phase]"));
const splitTextNodes = Array.from(document.querySelectorAll("[data-split-text]"));
const siteData = window.SITE_DATA || {};
const worksPath = siteData.worksPath || "./data/works.json";
const brandName = document.querySelector(".brand-name");
const profileId = document.querySelector(".profile-header small");
const heroName = document.querySelector(".name-mark");
const heroLines = document.querySelectorAll(".hero-line");
const statusStrip = document.querySelector(".status-strip");

const liveFeedSources = siteData.feedSources || [
  { source: "xhs", label: "XHS", endpoint: "" },
];

const liveVideoSources = siteData.videoSources || [
  { source: "douyin", label: "VIDEO", endpoint: "" },
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
    summary: "",
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
let transitionObserver;

const defaultProfile = siteData.profile || {
  id: "CYB-2077-0424",
  name: "内啡肽",
  height: "180",
  weight: "68",
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

if (heroName) {
  heroName.dataset.title = heroName.textContent.trim();
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

const renderCoverContent = (item, sources) =>
  item.cover
    ? `<img src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" loading="lazy">`
    : `<span>${escapeHtml(getSourceLabel(sources, item.source))}</span>`;

const updateStatus = (node, message) => {
  if (node) node.textContent = message;
};

const prepareTransitionItem = (node, index = 0) => {
  if (!node || node.dataset.transitionReady === "true") return;
  node.dataset.transitionReady = "true";
  node.style.setProperty("--reveal-index", String(index));
};

const refreshScrollTransitions = () => {
  const revealItems = [
    ...document.querySelectorAll(".timeline article"),
    ...document.querySelectorAll(".feed-card"),
    ...document.querySelectorAll(".video-grid article"),
  ];

  revealItems.forEach((item, index) => prepareTransitionItem(item, index % 6));

  if (!transitionObserver) return;
  [...transitionSections, ...revealItems].forEach((item) => transitionObserver.observe(item));
};

const renderProfile = () => {
  if (profilePlanetId) profilePlanetId.textContent = profileData.id;
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

const splitTextForVerticalReveal = (node, options = {}) => {
  if (!node || node.dataset.revealReady === "true") return;
  const text = node.textContent.trim();
  if (!text) return;

  node.dataset.revealReady = "true";
  node.setAttribute("aria-label", text);
  if (node.classList.contains("name-mark")) {
    node.dataset.title = text;
  }
  node.textContent = "";

  Array.from(text).forEach((char, index) => {
    const wrap = document.createElement("span");
    wrap.className = "vertical-cut-char";
    wrap.setAttribute("aria-hidden", "true");
    wrap.style.setProperty("--char-index", String(index));
    if (options.reverse) wrap.classList.add("reverse");

    const inner = document.createElement("span");
    inner.textContent = char;
    wrap.appendChild(inner);
    node.appendChild(wrap);
  });
};

const initHeroTitleReveal = () => {
  splitTextForVerticalReveal(heroName, { reverse: false });
  heroLines.forEach((line, index) => {
    splitTextForVerticalReveal(line, { reverse: index % 2 === 0 });
  });
};

const enhancePillNav = () => {
  document.querySelectorAll(".nav a").forEach((link, index) => {
    if (link.dataset.pillReady === "true") return;
    const label = link.textContent.trim();
    if (!label) return;

    link.dataset.pillReady = "true";
    link.style.setProperty("--pill-index", String(index));
    link.textContent = "";

    const circle = document.createElement("span");
    circle.className = "hover-circle";
    circle.setAttribute("aria-hidden", "true");

    const stack = document.createElement("span");
    stack.className = "label-stack";

    const baseLabel = document.createElement("span");
    baseLabel.className = "pill-label";
    baseLabel.textContent = label;

    const hoverLabel = document.createElement("span");
    hoverLabel.className = "pill-label-hover";
    hoverLabel.setAttribute("aria-hidden", "true");
    hoverLabel.textContent = label;

    stack.append(baseLabel, hoverLabel);
    link.append(circle, stack);
  });
};

enhancePillNav();
initHeroTitleReveal();

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
    url: item.url || item.link || "",
    cover: item.cover || item.coverUrl || item.image || item.thumbnail || "",
  }));
};

const normalizeWorksCatalog = (payload) => ({
  feedItems: normalizeItems(payload.feedItems || payload.feeds || []),
  videoItems: normalizeItems(payload.videoItems || payload.videos || []),
});

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

let worksCatalogPromise;
let localWorksCatalog = {
  feedItems: fallbackFeedItems,
  videoItems: fallbackVideoItems,
};

const loadWorksCatalog = async () => {
  if (window.WORKS_DATA) {
    const nextCatalog = normalizeWorksCatalog(window.WORKS_DATA);
    localWorksCatalog = {
      feedItems: nextCatalog.feedItems.length ? nextCatalog.feedItems : fallbackFeedItems,
      videoItems: nextCatalog.videoItems.length ? nextCatalog.videoItems : fallbackVideoItems,
    };
    return localWorksCatalog;
  }

  if (typeof fetch !== "function") {
    return localWorksCatalog;
  }

  if (!worksCatalogPromise) {
    worksCatalogPromise = fetch(`${worksPath}?t=${Date.now()}`)
      .then((response) => {
        if (!response.ok) throw new Error("works");
        return response.json();
      })
      .then((payload) => {
        const nextCatalog = normalizeWorksCatalog(payload);
        localWorksCatalog = {
          feedItems: nextCatalog.feedItems.length ? nextCatalog.feedItems : fallbackFeedItems,
          videoItems: nextCatalog.videoItems.length ? nextCatalog.videoItems : fallbackVideoItems,
        };
      })
      .catch(() => {
        localWorksCatalog = {
          feedItems: fallbackFeedItems,
          videoItems: fallbackVideoItems,
        };
      });
  }

  await worksCatalogPromise;
  return localWorksCatalog;
};

const loadRemoteItems = async (sources, fallbackItems, setItems, render, statusNode) => {
  const connectedSources = sources.filter((source) => source.endpoint);
  if (connectedSources.length === 0) {
    setItems(fallbackItems);
    updateStatus(statusNode, "");
    render();
    return;
  }

  updateStatus(statusNode, "");
  try {
    const responses = await Promise.all(
      connectedSources.map((source) => loadSourceItems(source)),
    );
    setItems(responses.flat());
    updateStatus(statusNode, "");
    render();
  } catch {
    setItems(fallbackItems);
    updateStatus(statusNode, "");
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
      (item) => {
        const hasUrl = Boolean(item.url);
        return `
        <article class="feed-card" data-source="${escapeHtml(item.source)}">
          <${hasUrl ? "a" : "div"} class="feed-card-link ${hasUrl ? "" : "disabled"}" ${
            hasUrl ? `href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"` : ""
          } aria-label="${escapeHtml(item.title)}">
            <figure class="feed-cover">
              ${renderCoverContent(item, liveFeedSources)}
            </figure>
            <h3 title="${escapeHtml(item.title)}">${escapeHtml(truncateText(item.title, 10))}</h3>
          </${hasUrl ? "a" : "div"}>
        </article>
      `;
      },
    )
    .join("");
  refreshScrollTransitions();
};

const loadLiveFeed = async () => {
  const worksCatalog = await loadWorksCatalog();
  return loadRemoteItems(
    liveFeedSources,
    worksCatalog.feedItems,
    (items) => {
      currentFeedItems = items;
    },
    () => {
      renderFeed();
      renderStoryShowcases();
    },
    feedStatus,
  );
};

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
      (item) => {
        const hasUrl = Boolean(item.url);
        return `
        <article data-source="${escapeHtml(item.source)}">
          <${hasUrl ? "a" : "div"} class="video-card-link ${hasUrl ? "" : "disabled"}" ${
            hasUrl ? `href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"` : ""
          } aria-label="${escapeHtml(item.title)}">
            <div class="thumb">
              ${
                item.cover
                  ? `<img class="video-cover" src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" loading="lazy">`
                  : `<span>${escapeHtml(getSourceLabel(liveVideoSources, item.source))}</span>`
              }
            </div>
            <h3 title="${escapeHtml(item.title)}">${escapeHtml(truncateText(item.title, 10))}</h3>
          </${hasUrl ? "a" : "div"}>
        </article>
      `;
      },
    )
    .join("");
  refreshScrollTransitions();
};

const renderStoryShowcases = () => {
  if (storyFeed) {
    const xhsItems = currentFeedItems.filter((item) => item.source === "xhs").slice(0, 3);
    storyFeed.innerHTML = xhsItems
      .map((item, index) => {
        const hasUrl = Boolean(item.url);
        return `
          <article class="story-work-card" data-flip-card style="--card-index: ${index}">
            <${hasUrl ? "a" : "div"} class="story-work-link ${hasUrl ? "" : "disabled"}" ${
              hasUrl ? `href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"` : ""
            } aria-label="${escapeHtml(item.title)}">
              <span class="story-work-inner">
                <span class="story-work-face story-work-front">
                  <img src="${escapeHtml(item.cover || "./assets/cyber-long-cover.png")}" alt="${escapeHtml(item.title)}" loading="lazy">
                  <h3>${escapeHtml(truncateText(item.title, 10))}</h3>
                </span>
                <span class="story-work-face story-work-back">
                  <small>PROFILE 0${index + 1}</small>
                  <strong>${escapeHtml(truncateText(item.title, 10))}</strong>
                  <em>OPEN FILE</em>
                </span>
              </span>
            </${hasUrl ? "a" : "div"}>
          </article>
        `;
      })
      .join("");
  }

  if (storyVideo) {
    storyVideo.innerHTML = currentVideoItems
      .slice(0, 3)
      .map((item, index) => {
        const hasUrl = Boolean(item.url);
        return `
          <article class="story-video-item" style="--video-index: ${index}">
            <div class="story-video-info">
              <span>0${index + 1}</span>
              <h3>${escapeHtml(truncateText(item.title, 10))}</h3>
              <p>${escapeHtml(item.summary || "Cyber stream archive")}</p>
            </div>
            <${hasUrl ? "a" : "div"} class="story-video-cover ${hasUrl ? "" : "disabled"}" ${
              hasUrl ? `href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"` : ""
            } aria-label="${escapeHtml(item.title)}">
              ${
                item.cover
                  ? `<img src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" loading="lazy">`
                  : `<span>${escapeHtml(truncateText(item.title, 10))}</span>`
              }
            </${hasUrl ? "a" : "div"}>
          </article>
        `;
      })
      .join("");
  }

  window.requestAnimationFrame(updateStoryTimelines);
};

const loadLiveVideos = async () => {
  const worksCatalog = await loadWorksCatalog();
  return loadRemoteItems(
    liveVideoSources,
    worksCatalog.videoItems,
    (items) => {
      currentVideoItems = items;
    },
    () => {
      renderVideos();
      renderStoryShowcases();
    },
    videoStatus,
  );
};

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
      (mission, index) => `
        <article data-mission-id="${escapeHtml(mission.id)}" data-mission-step="${index}">
          <span class="date">${escapeHtml(mission.date)}</span>
          <h3>${escapeHtml(mission.title)}</h3>
          <p>${escapeHtml(mission.description)}</p>
        </article>
      `,
    )
    .join("");
  refreshScrollTransitions();
  updateMissionLoading();
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

if (heroSection && tiltStage && tiltCard) {
  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  let isHeroDragging = false;
  let heroPointerTimer;

  const resetTiltCard = () => {
    tiltCard.style.setProperty("--rx", "0deg");
    tiltCard.style.setProperty("--ry", "0deg");
    tiltCard.style.setProperty("--card-scale", "1");
    tiltCard.style.setProperty("--reveal-opacity", "0");
    tiltCard.style.setProperty("--reveal-size", "clamp(150px, 18vw, 250px)");
    tiltCard.setAttribute("aria-pressed", "false");
  };

  const setHeroPointerState = (event, options = {}) => {
    const heroRect = heroSection.getBoundingClientRect();
    const heroX = clamp01((event.clientX - heroRect.left) / heroRect.width);
    const heroY = clamp01((event.clientY - heroRect.top) / heroRect.height);
    const dragStrength = options.dragging ? 1 : 0;

    heroSection.style.setProperty("--hero-mx", `${(heroX * 100).toFixed(2)}%`);
    heroSection.style.setProperty("--hero-my", `${(heroY * 100).toFixed(2)}%`);
    heroSection.style.setProperty("--hero-nx", (heroX - 0.5).toFixed(3));
    heroSection.style.setProperty("--hero-ny", (heroY - 0.5).toFixed(3));
    heroSection.style.setProperty("--hero-drag", dragStrength.toString());
    heroSection.style.setProperty("--hero-pointer-opacity", "1");
    heroSection.classList.add("is-pointer-active");
    heroSection.classList.toggle("is-dragging", options.dragging === true);

    if (heroPointer) {
      heroPointer.style.setProperty("--hero-mx", `${(heroX * 100).toFixed(2)}%`);
      heroPointer.style.setProperty("--hero-my", `${(heroY * 100).toFixed(2)}%`);
    }

    const rect = tiltStage.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const x = clamp01((event.clientX - rect.left) / rect.width);
    const y = clamp01((event.clientY - rect.top) / rect.height);
    const rotateAmplitude = options.dragging ? 10 : 7;
    const rotateX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotateY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    tiltCard.classList.add("is-hovering");
    tiltCard.style.setProperty("--rx", `${Math.max(-10, Math.min(10, rotateX)).toFixed(2)}deg`);
    tiltCard.style.setProperty("--ry", `${Math.max(-10, Math.min(10, rotateY)).toFixed(2)}deg`);
    tiltCard.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    tiltCard.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    tiltCard.style.setProperty("--card-scale", options.dragging ? "1.045" : "1.025");
    tiltCard.style.setProperty(
      "--reveal-size",
      options.dragging ? "clamp(210px, 26vw, 360px)" : "clamp(150px, 18vw, 250px)",
    );
    tiltCard.style.setProperty("--reveal-opacity", "1");
  };

  const fadeHeroPointer = (delay = 160) => {
    window.clearTimeout(heroPointerTimer);
    heroPointerTimer = window.setTimeout(() => {
      if (isHeroDragging) return;
      heroSection.style.setProperty("--hero-pointer-opacity", "0");
      heroSection.style.setProperty("--hero-drag", "0");
      heroSection.classList.remove("is-pointer-active", "is-dragging");
      tiltCard.classList.remove("is-hovering");
      resetTiltCard();
    }, delay);
  };

  heroSection.addEventListener("pointerenter", (event) => {
    window.clearTimeout(heroPointerTimer);
    setHeroPointerState(event, { dragging: isHeroDragging });
  });

  heroSection.addEventListener("pointermove", (event) => {
    window.clearTimeout(heroPointerTimer);
    setHeroPointerState(event, { dragging: isHeroDragging });
  });

  heroSection.addEventListener("pointerdown", (event) => {
    isHeroDragging = true;
    setHeroPointerState(event, { dragging: true });
    if (event.pointerId !== undefined) {
      heroSection.setPointerCapture?.(event.pointerId);
    }
  });

  heroSection.addEventListener("pointerup", (event) => {
    isHeroDragging = false;
    setHeroPointerState(event, { dragging: false });
    if (event.pointerId !== undefined) {
      heroSection.releasePointerCapture?.(event.pointerId);
    }
    fadeHeroPointer(520);
  });

  heroSection.addEventListener("pointercancel", () => {
    isHeroDragging = false;
    fadeHeroPointer(0);
  });

  heroSection.addEventListener("pointerleave", () => {
    if (isHeroDragging) return;
    fadeHeroPointer(80);
  });

  tiltCard.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    tiltCard.style.setProperty("--mx", "50%");
    tiltCard.style.setProperty("--my", "42%");
    tiltCard.style.setProperty("--reveal-opacity", "1");
    window.setTimeout(() => tiltCard.style.setProperty("--reveal-opacity", "0"), 700);
  });

  resetTiltCard();
}

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const mapRange = (value, start, end) => clamp((value - start) / (end - start));
const easeOutCubic = (value) => 1 - Math.pow(1 - clamp(value), 3);
const easeInOut = (value) => {
  const next = clamp(value);
  return next < 0.5 ? 4 * next * next * next : 1 - Math.pow(-2 * next + 2, 3) / 2;
};

const getSectionProgress = (section) => {
  if (!section) return 0;
  const rect = section.getBoundingClientRect();
  const viewport = window.innerHeight || document.documentElement.clientHeight;
  const travel = Math.max(1, rect.height - viewport);
  if (rect.height <= viewport + 2) {
    return clamp((viewport * 0.72 - rect.top) / (viewport * 0.82));
  }
  return clamp(-rect.top / travel);
};

const setSplitTextProgress = (node, progress) => {
  if (!node) return;
  const eased = easeOutCubic(progress);
  node.style.setProperty("--text-progress", eased.toFixed(3));
  node.classList.toggle("is-entered", eased > 0.98);
};

const splitScrollText = (node) => {
  if (!node || node.dataset.scrollSplitReady === "true") return;
  const text = node.textContent.trim();
  if (!text) return;

  node.dataset.scrollSplitReady = "true";
  node.setAttribute("aria-label", text);
  node.textContent = "";

  const outer = document.createElement("span");
  outer.className = "split-text-line";

  const inner = document.createElement("span");
  inner.className = "split-text-inner";

  Array.from(text).forEach((char, index) => {
    const unit = document.createElement("span");
    unit.className = "split-text-unit";
    unit.style.setProperty("--unit-index", String(index));
    unit.textContent = char === " " ? "\u00a0" : char;
    inner.appendChild(unit);
  });

  outer.appendChild(inner);
  node.appendChild(outer);
  setSplitTextProgress(node, 0);
};

splitTextNodes.forEach(splitScrollText);

const buildProgressTicks = () => {
  if (!progressTicks || progressTicks.dataset.ready === "true") return;
  progressTicks.dataset.ready = "true";
  progressTicks.innerHTML = Array.from({ length: 48 }, (_, index) => {
    const top = (index / 47) * 100;
    return `<span data-progress-tick style="--tick-index: ${index}; --tick-top: ${top.toFixed(3)}%"></span>`;
  }).join("");
};

buildProgressTicks();

const updateProgressPage = () => {
  if (!progressPage) return;
  const progress = getSectionProgress(progressPage);
  const titleProgress = mapRange(progress, 0.02, 0.14);
  const trackProgress = mapRange(progress, 0.12, 0.22);
  const tickProgress = mapRange(progress, 0.2, 0.92);
  const tickCount = 48;
  const activeTick = Math.floor(tickProgress * tickCount);

  progressPage.style.setProperty("--progress", progress.toFixed(3));
  progressPage.style.setProperty("--title-progress", easeOutCubic(titleProgress).toFixed(3));
  progressPage.style.setProperty("--track-progress", easeOutCubic(trackProgress).toFixed(3));
  progressPage.style.setProperty("--tick-progress", tickProgress.toFixed(3));
  progressPage.style.setProperty("--active-tick", String(activeTick));

  progressTicks?.querySelectorAll("[data-progress-tick]").forEach((tick, index) => {
    const isActive = index < activeTick;
    tick.classList.toggle("is-active", isActive);
    tick.classList.toggle("is-hot", index === activeTick - 1);
  });

  const thresholds = [0.34, 0.52, 0.7, 0.88];
  progressNodes.forEach((node, index) => {
    const nodeStart = thresholds[index];
    const nodeProgress = mapRange(progress, nodeStart, nodeStart + 0.055);
    const lineProgress = mapRange(progress, nodeStart + 0.045, nodeStart + 0.095);
    const panelProgress = mapRange(progress, nodeStart + 0.08, nodeStart + 0.15);
    const revealed = nodeProgress > 0.08;
    node.style.setProperty("--node-progress", easeOutCubic(nodeProgress).toFixed(3));
    node.classList.toggle("is-revealed", revealed);
    node.classList.toggle("is-complete", progress >= nodeStart + 0.12 && index < thresholds.length - 1);

    const panel = progressPanels[index];
    if (panel) {
      panel.style.setProperty("--line-progress", easeInOut(lineProgress).toFixed(3));
      panel.style.setProperty("--panel-progress", easeOutCubic(panelProgress).toFixed(3));
      panel.classList.toggle("is-revealed", panelProgress > 0.1);
    }
  });
};

const updateQuotePage = () => {
  const quotePage = document.querySelector(".quote-page");
  if (!quotePage) return;
  const progress = getSectionProgress(quotePage);
  quotePage.style.setProperty("--quote-progress", progress.toFixed(3));
  const quoteTexts = Array.from(quotePage.querySelectorAll("[data-split-text]"));
  quoteTexts.forEach((node, index) => {
    setSplitTextProgress(node, mapRange(progress, 0.08 + index * 0.13, 0.36 + index * 0.13));
  });
};

const updateWorksPage = () => {
  const worksPage = document.querySelector(".works-page");
  if (!worksPage) return;
  const progress = getSectionProgress(worksPage);
  worksPage.style.setProperty("--works-progress", progress.toFixed(3));
  worksPage.style.setProperty("--cover-progress", easeOutCubic(mapRange(progress, 0.1, 0.34)).toFixed(3));
  worksPage.style.setProperty("--split-progress", easeInOut(mapRange(progress, 0.34, 0.56)).toFixed(3));
  worksPage.style.setProperty("--card-progress", easeOutCubic(mapRange(progress, 0.52, 0.7)).toFixed(3));
  worksPage.style.setProperty("--flip-progress", easeInOut(mapRange(progress, 0.72, 0.95)).toFixed(3));
  worksPage.querySelectorAll("[data-split-text]").forEach((node, index) => {
    setSplitTextProgress(node, mapRange(progress, 0.02 + index * 0.08, 0.24 + index * 0.08));
  });
  worksPage.querySelectorAll("[data-flip-card]").forEach((card, index) => {
    const cardProgress = mapRange(progress, 0.54 + index * 0.045, 0.72 + index * 0.045);
    const flipProgress = mapRange(progress, 0.74 + index * 0.035, 0.92 + index * 0.035);
    card.style.setProperty("--card-progress-local", easeOutCubic(cardProgress).toFixed(3));
    card.style.setProperty("--flip-progress-local", easeInOut(flipProgress).toFixed(3));
    card.classList.toggle("is-revealed", cardProgress > 0.08);
    card.classList.toggle("is-flipped", flipProgress > 0.5);
  });
};

const updateVideoStoryPage = () => {
  const videoPage = document.querySelector(".video-story-page");
  if (!videoPage) return;
  const progress = getSectionProgress(videoPage);
  videoPage.style.setProperty("--video-progress", progress.toFixed(3));
  videoPage.querySelectorAll("[data-split-text]").forEach((node, index) => {
    setSplitTextProgress(node, mapRange(progress, 0.04 + index * 0.08, 0.28 + index * 0.08));
  });
  videoPage.querySelectorAll(".story-video-item").forEach((item, index) => {
    const itemProgress = mapRange(progress, 0.3 + index * 0.13, 0.56 + index * 0.13);
    item.style.setProperty("--item-progress", easeOutCubic(itemProgress).toFixed(3));
    item.classList.toggle("is-revealed", itemProgress > 0.08);
  });
};

const updateFuturePage = () => {
  const futurePage = document.querySelector(".future-page");
  if (!futurePage) return;
  const progress = getSectionProgress(futurePage);
  futurePage.style.setProperty("--future-progress", progress.toFixed(3));
  futurePage.querySelectorAll("[data-split-text]").forEach((node, index) => {
    setSplitTextProgress(node, mapRange(progress, 0.1 + index * 0.1, 0.42 + index * 0.1));
  });
};

const updateStoryTimelines = () => {
  updateProgressPage();
  updateQuotePage();
  updateWorksPage();
  updateVideoStoryPage();
  updateFuturePage();
  scrollPhasePages.forEach((page) => {
    page.classList.toggle("is-entered", getSectionProgress(page) > 0.02);
  });
};

if (storyPages.length) {
  const storyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-active", entry.isIntersecting);
      });
    },
    { threshold: 0.56 },
  );
  storyPages.forEach((page) => storyObserver.observe(page));
}

if (transitionSections.length) {
  transitionSections.forEach((section, index) => {
    prepareTransitionItem(section, index);
    section.dataset.transitionSection = "true";
  });

  transitionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.classList.add("is-revealed");
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.18,
    },
  );

  refreshScrollTransitions();
}

const sections = Array.from(document.querySelectorAll("main section[id]"));
const navLinks = Array.from(document.querySelectorAll(".nav a"));

navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (!href?.startsWith("#")) return;
  link.addEventListener("click", (event) => {
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    window.history.replaceState(null, "", href);
  });
});

const jumpToCurrentHash = () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  const top = target.offsetTop;
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
  window.scrollTo(0, top);
  setActiveNav();
  updateStoryTimelines();
};

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

const updateAmbientScroll = () => {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  document.body.style.setProperty("--scroll-ratio", (window.scrollY / maxScroll).toFixed(4));
};

const updateMissionLoading = () => {
  if (!missionList) return;

  const missionSection = missionList.closest(".mission");
  if (!missionSection) return;

  const rect = missionSection.getBoundingClientRect();
  const viewport = window.innerHeight || document.documentElement.clientHeight;
  const travel = Math.max(1, rect.height * 0.88);
  const progress = Math.max(0, Math.min(1, (viewport * 0.22 - rect.top) / travel));
  const cards = Array.from(missionList.querySelectorAll("[data-mission-step]"));

  missionList.style.setProperty("--mission-progress", progress.toFixed(3));
  missionList.style.setProperty("--mission-tick", Math.floor(progress * 36).toString());

  cards.forEach((card, index) => {
    const total = Math.max(1, cards.length);
    const threshold = total === 1 ? 0.42 : 0.14 + (index / (total - 1)) * 0.72;
    const nodeProgress = Math.max(0, Math.min(1, (progress - threshold + 0.045) / 0.12));
    const lineProgress = Math.max(0, Math.min(1, (progress - threshold + 0.015) / 0.12));
    const cardProgress = Math.max(0, Math.min(1, (progress - threshold - 0.035) / 0.14));

    card.style.setProperty("--node-progress", nodeProgress.toFixed(3));
    card.style.setProperty("--line-progress", lineProgress.toFixed(3));
    card.style.setProperty("--card-progress", cardProgress.toFixed(3));
    card.classList.toggle("is-unlocked", cardProgress > 0.86);
  });
};

renderMissions();
renderStoryShowcases();
initLetterGlitch();
loadLiveFeed();
loadLiveVideos();
window.setInterval(loadLiveFeed, 180000);
window.setInterval(loadLiveVideos, 180000);
let lastTimelineY = -1;
let lastTimelineWidth = -1;
let lastTimelineHeight = -1;
const tickStoryTimeline = () => {
  const nextY = window.scrollY;
  const nextWidth = window.innerWidth;
  const nextHeight = window.innerHeight;
  if (nextY !== lastTimelineY || nextWidth !== lastTimelineWidth || nextHeight !== lastTimelineHeight) {
    lastTimelineY = nextY;
    lastTimelineWidth = nextWidth;
    lastTimelineHeight = nextHeight;
    setActiveNav();
    updateAmbientScroll();
    updateStoryTimelines();
    updateMissionLoading();
  }
  window.requestAnimationFrame(tickStoryTimeline);
};
window.addEventListener(
  "scroll",
  () => {
    setActiveNav();
    updateAmbientScroll();
    updateStoryTimelines();
    updateMissionLoading();
  },
  { passive: true },
);
setActiveNav();
updateAmbientScroll();
updateStoryTimelines();
updateMissionLoading();
window.requestAnimationFrame(tickStoryTimeline);
window.addEventListener("resize", () => {
  updateStoryTimelines();
  updateMissionLoading();
});

if (window.location.hash) {
  window.setTimeout(jumpToCurrentHash, 120);
  window.setTimeout(jumpToCurrentHash, 420);
  window.setTimeout(jumpToCurrentHash, 900);
  window.setTimeout(jumpToCurrentHash, 1400);
}

window.addEventListener("hashchange", () => {
  window.setTimeout(jumpToCurrentHash, 0);
});

window.addEventListener("load", () => {
  window.setTimeout(jumpToCurrentHash, 0);
  window.setTimeout(jumpToCurrentHash, 600);
});

