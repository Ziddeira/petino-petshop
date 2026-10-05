/* =========================================================
   Petino Petshop — script.js
   1. Configuração (edite aqui WhatsApp, Instagram etc.)
   2. Links de WhatsApp / mapa / Instagram
   3. Menu, cabeçalho, animações de entrada, formulário
   4. Bolhas de sabão no cursor (desktop)
   5. Animação de scroll com sequência de 300 frames
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
    desktopPath: "frames/",          // 540×960 — telas grandes
    mobilePath: "frames/mobile/",    // 288×512 — celular/tablet
    prefix: "frame_",
    digits: 4,
    ext: ".webp",
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

  /* ---------- 4. Bolhas de sabão no cursor (apenas desktop) ---------- */
  (function bubbles() {
    const canvas = $("#bubbles");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canvas || !finePointer || reducedMotion.matches) {
      if (canvas) canvas.remove();
      return;
    }

    const ctx = canvas.getContext("2d");
    const MAX = 16;          // poucas bolhas na tela
    const MIN_DIST = 46;     // px de movimento entre bolhas
    const MIN_GAP = 80;      // ms entre bolhas
    const list = [];
    let dpr = 1, last = { x: 0, y: 0, t: 0 }, running = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      const now = performance.now();
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      if (now - last.t < MIN_GAP || dx * dx + dy * dy < MIN_DIST * MIN_DIST || list.length >= MAX) return;
      last = { x: e.clientX, y: e.clientY, t: now };
      list.push({
        x: e.clientX + (Math.random() - 0.5) * 14,
        y: e.clientY + (Math.random() - 0.5) * 14,
        r: 3 + Math.random() * 6,               // pequenas
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.25 - Math.random() * 0.45,       // sobem devagar
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() * 360,
        born: now,
        life: 1300 + Math.random() * 900,
      });
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });

    function drawBubble(b, t) {
      const p = t / b.life;                     // 0 → 1
      const alpha = p < 0.15 ? p / 0.15 : p > 0.85 ? (1 - p) / 0.15 : 1;
      const r = b.r * (0.6 + 0.4 * Math.min(1, p * 4)) * (p > 0.9 ? 1 + (p - 0.9) * 3 : 1);

      ctx.save();
      ctx.globalAlpha = alpha * 0.9;
      // corpo transparente com borda iridescente
      const g = ctx.createRadialGradient(b.x, b.y, r * 0.2, b.x, b.y, r);
      g.addColorStop(0, "rgba(255,255,255,0.02)");
      g.addColorStop(0.75, "rgba(255,255,255,0.08)");
      g.addColorStop(1, `hsla(${(b.hue + t * 0.12) % 360}, 90%, 72%, 0.45)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.strokeStyle = `hsla(${(b.hue + 120 + t * 0.12) % 360}, 85%, 60%, 0.55)`;
      ctx.stroke();

      // brilho
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.ellipse(b.x - r * 0.35, b.y - r * 0.4, r * 0.28, r * 0.16, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function tick(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = list.length - 1; i >= 0; i--) {
        const b = list[i];
        const t = now - b.born;
        if (t > b.life) { list.splice(i, 1); continue; }
        b.x += b.vx + Math.sin(t / 260 + b.phase) * 0.25;
        b.y += b.vy;
        drawBubble(b, t);
      }
      if (list.length) requestAnimationFrame(tick);
      else running = false;
    }
  })();

  /* ---------- 5. Animação de scroll (sequência de frames) ---------- */
  (function scrollSequence() {
    const wrap = $(".scroll-anim");
    const canvas = $("#scroll-canvas");
    if (!wrap || !canvas) return;

    const cfg = PETINO.frames;
    const ctx = canvas.getContext("2d");
    const railMode = window.matchMedia("(min-width: 1100px)");
    const base = railMode.matches ? cfg.desktopPath : cfg.mobilePath;
    const url = (i) => `${base}${cfg.prefix}${String(i + 1).padStart(cfg.digits, "0")}${cfg.ext}`;

    const frames = new Array(cfg.total);   // HTMLImageElement quando carregado
    const loader = $(".scroll-anim__loader span", wrap);
    let loaded = 0;
    let current = 0;          // frame exibido (com suavização)
    let target = 0;           // frame pedido pela rolagem
    let drawn = -1;           // índice pedido
    let shown = -1;           // frame realmente desenhado (pode ser o vizinho carregado)
    let rafId = 0;

    /* Canvas responsivo, nítido em telas retina */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (!w || !h) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        drawn = -1;
        draw(Math.round(current));
      }
    };

    /* Desenha preservando a proporção (contain), alinhado embaixo */
    function draw(index) {
      // usa o frame carregado mais próximo enquanto os demais ainda chegam
      let img = frames[index], at = index;
      for (let d = 1; !img && d < cfg.total; d++) {
        if (frames[index - d]) { img = frames[index - d]; at = index - d; }
        else if (frames[index + d]) { img = frames[index + d]; at = index + d; }
      }
      if (!img) return;
      const cw = canvas.width, ch = canvas.height;
      const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, ch - h, w, h);
      drawn = index;
      shown = at;
    }

    /* Progresso da rolagem → índice do frame */
    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    function loop() {
      current += (target - current) * 0.14;           // troca suave entre frames
      if (Math.abs(target - current) < 0.05) current = target;
      const idx = Math.round(current);
      if (idx !== drawn) draw(idx);
      rafId = current !== target ? requestAnimationFrame(loop) : 0;
    }

    const onScroll = () => {
      target = progress() * (cfg.total - 1);
      if (!rafId) rafId = requestAnimationFrame(loop);
    };

    /* Pré-carregamento progressivo: primeiro frames espaçados, depois preenche os vãos,
       para que a animação já funcione (com menos fluidez) antes de tudo carregar. */
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
          if (loader) loader.style.transform = `scaleX(${loaded / order.length})`;
          if (loaded === order.length) wrap.classList.add("is-loaded");
          const cur = Math.round(current);
          if (shown === -1 || Math.abs(i - cur) < Math.abs(shown - cur)) {
            draw(cur);
          }
          loadOne();
        };
        img.onerror = () => { loaded++; loadOne(); };
        img.src = url(i);
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
      current = target = 0;   // mesmo frame já pré-carregado no <head>
      preload([current]);
      resize();
    } else {
      current = target = progress() * (cfg.total - 1);
      preload(order);
      resize();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    /* No celular/tablet: mini janela que aparece após o topo e pode ser fechada */
    const closeBtn = $(".scroll-anim__close", wrap);
    const hero = $(".hero");
    let dismissed = false;
    try { dismissed = sessionStorage.getItem("petino-anim-closed") === "1"; } catch (e) { /* sem storage */ }

    const updateMini = () => {
      if (railMode.matches) { wrap.classList.remove("is-hidden"); return; }
      const pastHero = hero ? hero.getBoundingClientRect().bottom < 80 : window.scrollY > 400;
      wrap.classList.toggle("is-hidden", dismissed || !pastHero);
    };
    closeBtn.addEventListener("click", () => {
      dismissed = true;
      try { sessionStorage.setItem("petino-anim-closed", "1"); } catch (e) { /* sem storage */ }
      updateMini();
    });
    window.addEventListener("scroll", updateMini, { passive: true });
    railMode.addEventListener("change", () => { updateMini(); resize(); });
    updateMini();
  })();
})();
