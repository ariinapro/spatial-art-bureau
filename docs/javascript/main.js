(function () {
  var artistsSidebar = document.querySelector('.sidebar-box--artists');
  var navbar         = document.querySelector('.navbar');
  var track          = document.querySelector('.artists-carousel-track');
  if (!artistsSidebar || !track) return;

  var NUM_PHOTOS  = 4;
  var TOTAL_RANGE = 600 * (NUM_PHOTOS - 1);
  var GAP         = 30;

  var LABELS = [
    '«Плоскость сдвига» (2024 г.) — Лев Ратманов',
    '«Точка натяжения» (2025 г.) — Алиса Северина',
    '«Архитектура проекции» (2023 г.) — Марк Осипов',
    '«След прикосновения» (2026 г.) — Герман Вельский',
  ];

  var caption    = document.querySelector('.artist-and-title p');
  var lastCapIdx = -1;

  var state       = 'before';
  var targetP     = 0;
  var visualP     = 0;
  var lockScrollY = 0;
  var snapping    = false;
  var rafId       = null;

  function updateCaption(p) {
    if (!caption) return;
    var fi      = Math.max(0, Math.min(NUM_PHOTOS - 1, p * (NUM_PHOTOS - 1)));
    var closest = Math.min(NUM_PHOTOS - 1, Math.round(fi));
    var dist    = Math.abs(fi - closest);
    var opacity = Math.max(0, 1 - dist * 2);
    var tx      = Math.round((closest - fi) * 24);

    if (closest !== lastCapIdx) {
      caption.textContent = LABELS[closest];
      lastCapIdx = closest;
    }
    caption.style.opacity   = opacity;
    caption.style.transform = 'translateX(' + tx + 'px)';
  }

  function computeLock() {
    var navBottom        = navbar ? navbar.getBoundingClientRect().bottom : 0;
    var sidebarBottomDoc = artistsSidebar.getBoundingClientRect().bottom + window.scrollY;
    lockScrollY = Math.max(0, Math.round(sidebarBottomDoc - navBottom)) + 50;
    placeTrack(visualP);
    updateCaption(visualP);
  }

  function placeTrack(p) {
    var vw = window.innerWidth;
    var tx = -(0.25 * vw + GAP) - p * (NUM_PHOTOS - 1) * (0.5 * vw + GAP);
    track.style.transform = 'translateX(' + Math.round(tx) + 'px)';
  }

  function tick() {
    var diff = targetP - visualP;
    if (Math.abs(diff) < 0.0008) {
      visualP = targetP;
      placeTrack(visualP);
      updateCaption(visualP);
      rafId = null;
      return;
    }
    visualP += diff * 0.1;
    placeTrack(visualP);
    updateCaption(visualP);
    rafId = requestAnimationFrame(tick);
  }

  function startAnim() { if (!rafId) rafId = requestAnimationFrame(tick); }
  function snapTo(y)   { snapping = true; window.scrollTo(0, y); }

  window.addEventListener('wheel', function (e) {
    if (state === 'locked') {
      e.preventDefault();
      targetP += e.deltaY / TOTAL_RANGE;
      if (targetP >= 1) { targetP = 1; startAnim(); state = 'after';  return; }
      if (targetP <= 0) { targetP = 0; startAnim(); state = 'before'; return; }
      startAnim();
      return;
    }
    if (state === 'before' && e.deltaY > 0 && window.scrollY + e.deltaY >= lockScrollY) {
      e.preventDefault();
      snapTo(lockScrollY);
      targetP = 0; visualP = 0; placeTrack(0); updateCaption(0);
      state = 'locked';
      return;
    }
    if (state === 'after' && e.deltaY < 0 && window.scrollY <= lockScrollY + 5) {
      e.preventDefault();
      snapTo(lockScrollY);
      state = 'locked';
      targetP = 1;
      targetP += e.deltaY / TOTAL_RANGE;
      targetP = Math.max(0, Math.min(1, targetP));
      startAnim();
      if (targetP <= 0) state = 'before';
    }
  }, { passive: false });

  window.addEventListener('scroll', function () {
    if (snapping) { snapping = false; return; }
    if (state === 'locked') { snapTo(lockScrollY); return; }
    if (state === 'before' && window.scrollY >= lockScrollY) {
      targetP = 0; visualP = 0; placeTrack(0); updateCaption(0);
      state = 'locked'; snapTo(lockScrollY); return;
    }
    if (state === 'after' && window.scrollY < lockScrollY) {
      targetP = 1; visualP = 1; placeTrack(1); updateCaption(1);
      state = 'locked'; snapTo(lockScrollY);
    }
  }, { passive: true });

  window.addEventListener('resize', computeLock);
  computeLock();
})();

(function () {
  var shopSidebar = document.querySelector('.sidebar-box--shop');
  var navbar      = document.querySelector('.navbar');
  var card1 = document.getElementById('shop-card-1');
  var card2 = document.getElementById('shop-card-2');
  var card3 = document.getElementById('shop-card-3');
  if (!shopSidebar || !card1) return;

  var titles = [card1, card2, card3].map(function (c) {
    return c.querySelector('.product-title');
  });

  var shopState    = 'before';
  var shopProgress = 0;
  var lockScrollY  = 0;
  var RANGE        = 450;
  var snapping     = false;

  function computeLock() {
    var navBottom     = navbar ? navbar.getBoundingClientRect().bottom : 0;
    var sidebarDocTop = shopSidebar.getBoundingClientRect().top + window.scrollY;
    lockScrollY = Math.max(0, Math.round(sidebarDocTop - navBottom) + 1);
    placeCards(shopProgress);
  }

  function placeCards(p) {
    var vw       = window.innerWidth;
    var availW   = vw - 180 - 180;
    var maxCardW = 302;
    var baseGap  = 20;
    var fullW    = 3 * maxCardW + 2 * baseGap;

    var cardW, gap;
    if (fullW <= availW) {
      cardW = maxCardW;
      gap   = baseGap;
    } else {
      var scale = availW / fullW;
      cardW = Math.round(maxCardW * scale);
      gap   = Math.round(baseGap  * scale);
    }
    var totalW = 3 * cardW + 2 * gap;

    [card1, card2, card3].forEach(function (c) {
      c.style.width = cardW + 'px';
      var box = c.querySelector('.shop-photo-box');
      if (box) { box.style.width = cardW + 'px'; box.style.height = cardW + 'px'; }
      var ttl = c.querySelector('.product-title');
      if (ttl) { ttl.style.width = cardW + 'px'; }
    });

    var startX = 180 + (availW - totalW) / 2;
    var fx1 = startX;
    var fx2 = startX + cardW + gap;
    var fx3 = startX + 2 * (cardW + gap);
    var cx  = fx2;

    card1.style.zIndex = '2';
    card2.style.zIndex = '1';
    card3.style.zIndex = '1';

    card1.style.left = Math.round(cx) + 'px';
    card2.style.left = Math.round(cx + (fx1 - cx) * p) + 'px';
    card3.style.left = Math.round(cx + (fx3 - cx) * p) + 'px';

    var titleOpacity = Math.min(1, Math.max(0, p * 2 - 0.7));
    titles.forEach(function (t) { if (t) t.style.opacity = titleOpacity; });
  }

  function snapTo(y) {
    snapping = true;
    window.scrollTo(0, y);
  }

  window.addEventListener('wheel', function (e) {
    if (shopState === 'locked') {
      e.preventDefault();
      shopProgress += e.deltaY / RANGE;
      if (shopProgress >= 1) { shopProgress = 1; placeCards(1); shopState = 'after'; return; }
      if (shopProgress <= 0) { shopProgress = 0; placeCards(0); shopState = 'before'; return; }
      placeCards(shopProgress);
      return;
    }
    if (shopState === 'before' && e.deltaY > 0 && window.scrollY + e.deltaY >= lockScrollY) {
      e.preventDefault();
      snapTo(lockScrollY);
      shopState = 'locked';
      shopProgress = 0;
      return;
    }
    if (shopState === 'after' && e.deltaY < 0 && window.scrollY <= lockScrollY + 5) {
      e.preventDefault();
      snapTo(lockScrollY);
      shopState = 'locked';
      shopProgress = 1;
      shopProgress += e.deltaY / RANGE;
      shopProgress = Math.max(0, Math.min(1, shopProgress));
      placeCards(shopProgress);
      if (shopProgress <= 0) shopState = 'before';
    }
  }, { passive: false });

  window.addEventListener('scroll', function () {
    if (snapping) { snapping = false; return; }
    if (shopState === 'locked') { snapTo(lockScrollY); return; }
    if (shopState === 'before' && window.scrollY >= lockScrollY) {
      shopState = 'locked'; shopProgress = 0; snapTo(lockScrollY); return;
    }
    if (shopState === 'after' && window.scrollY < lockScrollY) {
      shopState = 'locked'; shopProgress = 1; snapTo(lockScrollY);
    }
  }, { passive: true });

  window.addEventListener('resize', computeLock);
  computeLock();
})();
