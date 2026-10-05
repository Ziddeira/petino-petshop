/* =========================================================
   Petino Petshop — script.js
   1. Configuração (edite aqui WhatsApp, Instagram etc.)
   2. Links de WhatsApp / mapa / Instagram
   3. Tema do fundo, menu, cabeçalho, animações de entrada, formulário
   4. Bolhas de sabão (rastro no cursor + estouro no clique)
   5. Animação de scroll com sequência de 300 frames (ao fundo, 4K sob demanda)
   ========================================================= */

/* ---------- 1. Configuração ---------- */
const PETINO = {
  // WhatsApp com DDI + DDD, só números. Confirme se é este o número do WhatsApp da loja.
  whatsapp: "554833000909",
  instagram: "https://www.instagram.com/petinopetshop/",
  mapsQuery: "Petino PetShop, Av. Aleixo Alves de Souza, 1453 - sala 02 - Nova Palhoça, Palhoça - SC, 88131-560",

  // Sequência de frames do vídeo (veja README.md)
  frames: {
    total: 300,
    // Camadas de resolução (todas recortadas na área dos pets, mesma proporção):
    tiers: {
      mobile: { path: "frames/mobile/", height: 891 },   // 426×891  — celular/tablet
      hd:     { path: "frames/",        height: 1190 },  // 569×1190 — computador (base)
      uhd:    { path: "frames/4k/",     height: 3570 },  // 1707×3570 — recorte de um quadro 4K (2160×3840)
    },
    hiWindow: 6,                     // frames 4K buscados de cada lado do frame atual
    hiCache: 24,                     // máximo de frames 4K mantidos na memória
    prefix: "frame_",
    digits: 4,
    ext: ".webp",
    focusX: 0.443,                   // centro horizontal da pilha de pets no frame
    // Posição horizontal da pilha na tela (0 = esquerda, 1 = direita)
    anchorX: { desktop: 0.8, mobile: 0.68 },
    // Altura da pilha de pets em "telas": 2 = o dobro da altura visível.
    // A rolagem desce pela pilha, do gato (topo) até o golden (base).
    zoom: { desktop: 1.9, mobile: 1.5 },
  },
};

(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.documentElement.classList.add("js");

  /* ---------- 2. Links ---------- */
  const waLink = (msg) => `https://wa.me/${PETINO.whatsapp}?text=${encodeURIComponent(msg)}`;
  const q = encodeURIComponent(PETINO.mapsQuery);
  const links = {
    instagram: PETINO.instagram,
    directions: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
    reviews: `https://www.google.com/maps/search/?api=1&query=${q}`,
    map: `https://www.google.com/maps?q=${q}&output=embed`,
  };

  $$("[data-wa]").forEach((a) => {
    a.href = waLink(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-link]").forEach((el) => {
    const url = links[el.dataset.link];
    if (!url) return;
    if (el.tagName === "IFRAME") el.src = url;
    else el.href = url;
  });

  /* ---------- 3. Interações ---------- */
  // Menu mobile
  const toggle = $(".menu-toggle");
  const nav = $("#menu");
  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  // Troca de fundo: azul-marinho ⇄ azul-claro
  const themeBtn = $(".theme-toggle");
  const themeMeta = $('meta[name="theme-color"]');
  const applyTheme = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    const navy = t === "navy";
    themeBtn.setAttribute("aria-pressed", String(navy));
    themeBtn.setAttribute("aria-label", navy ? "Fundo azul-marinho ativo. Mudar para azul-claro" : "Fundo azul-claro ativo. Mudar para azul-marinho");
    $(".theme-toggle__name", themeBtn).textContent = navy ? "marinho" : "claro";
    if (themeMeta) themeMeta.content = navy ? "#010147" : "#e6f2ff";
  };
  applyTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "navy");
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "navy" ? "light" : "navy";
    applyTheme(next);
    try { localStorage.setItem("petino-tema", next); } catch (e) { /* sem storage */ }
  });

  // Sombra no cabeçalho ao rolar
  const header = $(".header");
  const onScrollHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  // Animações de entrada
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Ano no rodapé
  const ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Data mínima = hoje
  const dateInput = $("#f-data");
  if (dateInput) {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    dateInput.min = d.toISOString().slice(0, 10);
  }

  // Formulário de agendamento → WhatsApp
  const form = $("#booking-form");
  if (form) {
    const error = $(".form__error", form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const tutor = (data.get("tutor") || "").trim();
      const pet = (data.get("pet") || "").trim();

      $("#f-tutor").classList.toggle("is-invalid", !tutor);
      $("#f-pet").classList.toggle("is-invalid", !pet);
      if (!tutor || !pet) {
        error.hidden = false;
        (!tutor ? $("#f-tutor") : $("#f-pet")).focus();
        return;
      }
      error.hidden = true;

      let dia = "";
      if (data.get("data")) {
        const [y, m, d] = data.get("data").split("-");
        dia = `${d}/${m}/${y}`;
      }
      const adicionais = data.getAll("adicionais");

      const lines = [
        "Olá, Petino! 🐾 Gostaria de agendar:",
        "",
        `👤 Tutor(a): ${tutor}`,
        `🐾 Pet: ${pet} (${data.get("especie")}, porte ${data.get("porte")})`,
        `✂️ Serviço: ${data.get("servico")}`,
        adicionais.length ? `✨ Adicionais: ${adicionais.join(", ")}` : "",
        dia ? `📅 Dia preferido: ${dia}` : "",
        `🕐 Período: ${data.get("periodo")}`,
        (data.get("obs") || "").trim() ? `📝 Obs.: ${data.get("obs").trim()}` : "",
      ].filter((l, i) => l !== "" || i === 1);

      window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------- 4. Bolhas de sabão: rastro no cursor (desktop) + bolha que estoura no clique ---------- */
  (function bubbles() {
    const canvas = $("#bubbles");
    if (!canvas) return;
    if (reducedMotion.matches) { canvas.remove(); return; }

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const ctx = canvas.getContext("2d");
    const MAX = 16;          // poucas bolhas no rastro
    const MIN_DIST = 46;     // px de movimento entre bolhas
    const MIN_GAP = 80;      // ms entre bolhas
    const trail = [];        // bolhas pequenas que seguem o cursor
    const pops = [];         // bolhas do clique (enchem e estouram)
    const drops = [];        // gotinhas do estouro
    let last = { x: 0, y: 0, t: 0 }, running = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = () => { if (!running) { running = true; requestAnimationFrame(tick); } };
    const rand = (a, b) => a + Math.random() * (b - a);

    // Rastro discreto no cursor (só mouse)
    if (finePointer) {
      window.addEventListener("mousemove", (e) => {
        const now = performance.now();
        const dx = e.clientX - last.x, dy = e.clientY - last.y;
        if (now - last.t < MIN_GAP || dx * dx + dy * dy < MIN_DIST * MIN_DIST || trail.length >= MAX) return;
        last = { x: e.clientX, y: e.clientY, t: now };
        trail.push({
          x: e.clientX + rand(-7, 7), y: e.clientY + rand(-7, 7),
          r: rand(3, 9), vx: rand(-0.2, 0.2), vy: rand(-0.7, -0.25),
          phase: rand(0, 6.28), hue: rand(0, 360), born: now, life: rand(1300, 2200),
        });
        start();
      }, { passive: true });
    }

    // Clique/toque em qualquer lugar: uma bolha enche e estoura no ponteiro
    function burst(x, y, r, hue) {
      const n = 9 + Math.floor(r / 3);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rand(-0.2, 0.2);
        const s = rand(1.6, 3.4);
        drops.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.6,
          r: rand(1.2, 2.6), hue: (hue + i * 25) % 360, born: performance.now(), life: rand(380, 620) });
      }
    }
    window.addEventListener("pointerdown", (e) => {
      if (e.button > 0) return;
      const now = performance.now();
      // estoura as bolhas do rastro que estiverem perto do clique
      for (let i = trail.length - 1; i >= 0; i--) {
        const b = trail[i];
        if (Math.hypot(b.x - e.clientX, b.y - e.clientY) < b.r + 40) {
          burst(b.x, b.y, b.r, b.hue);
          trail.splice(i, 1);
        }
      }
      pops.push({ x: e.clientX, y: e.clientY, r: rand(16, 24), hue: rand(0, 360), born: now, grow: 150, popped: false });
      start();
    }, { passive: true });

    function bubbleBody(x, y, r, hue, t, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
      g.addColorStop(0, "rgba(255,255,255,0.03)");
      g.addColorStop(0.72, "rgba(255,255,255,0.10)");
      g.addColorStop(1, `hsla(${(hue + t * 0.12) % 360}, 90%, 72%, 0.5)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = r > 12 ? 1.5 : 1;
      ctx.strokeStyle = `hsla(${(hue + 120 + t * 0.12) % 360}, 85%, 62%, 0.6)`;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.beginPath();
      ctx.ellipse(x - r * 0.35, y - r * 0.4, r * 0.28, r * 0.16, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function tick(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // rastro
      for (let i = trail.length - 1; i >= 0; i--) {
        const b = trail[i], t = now - b.born;
        if (t > b.life) { trail.splice(i, 1); continue; }
        b.x += b.vx + Math.sin(t / 260 + b.phase) * 0.25;
        b.y += b.vy;
        const p = t / b.life;
        const alpha = p < 0.15 ? p / 0.15 : p > 0.85 ? (1 - p) / 0.15 : 1;
        bubbleBody(b.x, b.y, b.r * (0.6 + 0.4 * Math.min(1, p * 4)), b.hue, t, alpha * 0.9);
      }

      // bolhas do clique: enchem rápido e estouram com um anel que se abre
      for (let i = pops.length - 1; i >= 0; i--) {
        const b = pops[i], t = now - b.born;
        if (t < b.grow) {
          const k = t / b.grow, ease = 1 - Math.pow(1 - k, 3);
          bubbleBody(b.x, b.y - k * 6, b.r * (0.3 + 0.7 * ease) * (1 + Math.sin(k * 9) * 0.04), b.hue, t, 0.95);
          continue;
        }
        if (!b.popped) { b.popped = true; burst(b.x, b.y - 6, b.r, b.hue); }
        const k = (t - b.grow) / 260;
        if (k >= 1) { pops.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = (1 - k) * 0.9;
        ctx.lineWidth = 2 * (1 - k) + 0.5;
        ctx.strokeStyle = `hsla(${b.hue}, 90%, 70%, 1)`;
        const rr = b.r * (1 + k * 0.9);
        for (let s = 0; s < 6; s++) {          // anel quebrado em pedaços
          const a0 = (s / 6) * Math.PI * 2 + k;
          ctx.beginPath();
          ctx.arc(b.x, b.y - 6, rr, a0, a0 + 0.62);
          ctx.stroke();
        }
        ctx.restore();
      }

      // gotinhas
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i], t = now - d.born;
        if (t > d.life) { drops.splice(i, 1); continue; }
        d.x += d.vx; d.y += d.vy; d.vy += 0.12; d.vx *= 0.97;
        ctx.save();
        ctx.globalAlpha = 1 - t / d.life;
        ctx.fillStyle = `hsla(${d.hue}, 90%, 78%, 0.95)`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (trail.length || pops.length || drops.length) requestAnimationFrame(tick);
      else running = false;
    }
  })();

  /* ---------- 5. Animação de scroll (sequência de frames ao fundo do site) ---------- */
  (function scrollSequence() {
    const wrap = $(".scroll-anim");
    const canvas = $("#scroll-canvas");
    if (!wrap || !canvas) return;

    const cfg = PETINO.frames;
    const ctx = canvas.getContext("2d");
    const wide = window.matchMedia("(min-width: 1100px)");
    const pad = (i) => String(i + 1).padStart(cfg.digits, "0");
    const url = (tier, i) => `${tier.path}${cfg.prefix}${pad(i)}${cfg.ext}`;

    // Camada base: carregada inteira, garante a rolagem fluida.
    // Camada 4K: baixada sob demanda só ao redor do frame atual (quando a rolagem desacelera).
    const baseTier = wide.matches ? cfg.tiers.hd : cfg.tiers.mobile;
    const hiTier = wide.matches ? cfg.tiers.uhd : cfg.tiers.hd;
    const frames = new Array(cfg.total);      // camada base
    const hi = new Map();                     // camada 4K: índice → imagem decodificada (LRU)
    const hiLoading = new Set();
    const hiFailed = new Set();               // não tenta de novo o que falhou
    let useHi = false;

    let loaded = 0;
    let current = 0;          // frame exibido (com suavização)
    let target = 0;           // frame pedido pela rolagem
    let shown = -1;           // frame base realmente desenhado
    let rafId = 0;
    let idleTimer = 0;

    /* Canvas responsivo, nítido em telas retina */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (!w || !h) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // só vale baixar 4K se a pilha for desenhada maior que a camada base
      const zoom = wide.matches ? cfg.zoom.desktop : cfg.zoom.mobile;
      useHi = h * zoom > baseTier.height * 1.15;
      draw(Math.round(current));
      scheduleHi();
    };

    /* Desenha preservando a proporção. A pilha de pets é maior que a tela e a "câmera"
       desce por ela conforme a rolagem (topo = gato, fim da página = golden). */
    function draw(index) {
      let img = hi.get(index);
      if (img) { hi.delete(index); hi.set(index, img); }  // marca como recente (LRU)
      let at = index;
      if (!img) {
        img = frames[index];
        for (let d = 1; !img && d < cfg.total; d++) {
          if (frames[index - d]) { img = frames[index - d]; at = index - d; }
          else if (frames[index + d]) { img = frames[index + d]; at = index + d; }
        }
      }
      if (!img) return;
      shown = at;

      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const anchorX = wide.matches ? cfg.anchorX.desktop : cfg.anchorX.mobile;
      let scale, dy;
      if (wrap.classList.contains("is-static")) {
        // movimento reduzido: pilha inteira visível, sem panorâmica
        scale = Math.min((cw * 0.5) / iw, ch / ih);
        dy = ch - ih * scale;
      } else {
        const zoom = wide.matches ? cfg.zoom.desktop : cfg.zoom.mobile;
        scale = (ch * zoom) / ih;
        dy = -(current / (cfg.total - 1)) * Math.max(0, ih * scale - ch);
      }
      const dx = cw * anchorX - cfg.focusX * iw * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, iw * scale, ih * scale);
    }

    /* Progresso da rolagem → índice do frame */
    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    function loop() {
      current += (target - current) * 0.14;           // troca suave entre frames
      if (Math.abs(target - current) < 0.05) current = target;
      draw(Math.round(current));                     // redesenha sempre: a panorâmica é contínua
      if (current !== target) rafId = requestAnimationFrame(loop);
      else { rafId = 0; scheduleHi(); }
    }

    const onScroll = () => {
      target = progress() * (cfg.total - 1);
      if (!rafId) rafId = requestAnimationFrame(loop);
    };

    /* 4K sob demanda: quando a rolagem para, busca o frame atual e os vizinhos */
    function scheduleHi() {
      if (!useHi) return;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        const c = Math.round(current);
        const want = [c];
        for (let d = 1; d <= cfg.hiWindow; d++) want.push(c + d, c - d);
        want.filter((i) => i >= 0 && i < cfg.total && !hi.has(i) && !hiLoading.has(i) && !hiFailed.has(i))
          .slice(0, 6)
          .forEach((i) => {
            hiLoading.add(i);
            const img = new Image();
            img.src = url(hiTier, i);
            img.decode().then(() => {
              hi.set(i, img);
              while (hi.size > cfg.hiCache) hi.delete(hi.keys().next().value);  // descarta os mais antigos
              if (i === Math.round(current)) draw(i);
            }).catch(() => { hiFailed.add(i); }).finally(() => {
              hiLoading.delete(i);
              if (!hiLoading.size) scheduleHi();               // continua preenchendo a janela
            });
          });
      }, 140);
    }

    /* Pré-carregamento progressivo da camada base: primeiro frames espaçados,
       depois preenche os vãos, para a animação já funcionar antes de tudo carregar. */
    function preload(order) {
      let next = 0;
      const CONCURRENCY = 6;
      const loadOne = () => {
        if (next >= order.length) return;
        const i = order[next++];
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          frames[i] = img;
          loaded++;
          if (loaded === order.length) { wrap.classList.add("is-loaded"); scheduleHi(); }
          const cur = Math.round(current);
          if (shown === -1 || Math.abs(i - cur) < Math.abs(shown - cur)) draw(cur);
          loadOne();
        };
        img.onerror = () => { loaded++; loadOne(); };
        img.src = url(baseTier, i);
      };
      for (let k = 0; k < CONCURRENCY; k++) loadOne();
    }

    const order = [];
    const seen = new Set();
    [64, 32, 16, 8, 4, 2, 1].forEach((step) => {
      for (let i = 0; i < cfg.total; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
    });
    if (!seen.has(cfg.total - 1)) order.splice(1, 0, cfg.total - 1);

    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener("resize", resize);

    if (reducedMotion.matches) {
      // Movimento reduzido: um único frame estático, sem animação nem pré-carregamento pesado
      wrap.classList.add("is-static");
      current = target = 0;
      preload([0]);
      resize();
    } else {
      current = target = progress() * (cfg.total - 1);
      preload(order);
      resize();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
    wide.addEventListener("change", resize);
  })();
})();
