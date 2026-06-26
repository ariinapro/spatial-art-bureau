var _page = window.location.pathname.split("/").pop();
if (_page === "shop.html" || _page === "index.html" || _page === "") {
  history.scrollRestoration = "manual";
}

function myFunction() {
  var x = document.getElementById("navbar-instance");
  if (x.className === "navbar-container") {
    x.className += " responsive";
  } else {
    x.className = "navbar-container";
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var current = document.body.dataset.navActive || window.location.pathname.split("/").pop();

  document.querySelectorAll(".navbar-container a[href]").forEach(function(link) {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });

  var backButton = document.querySelector(".back-button");
  if (backButton) {
    backButton.addEventListener("click", function(e) {
      e.preventDefault();
      history.back();
    });
  }

  if (current === "shop.html") {
    document.querySelectorAll(".shop-product-link").forEach(function(link) {
      link.addEventListener("click", function() {
        sessionStorage.setItem("shopScrollY", window.scrollY);
      });
    });
  }

  if (current === "index.html" || current === "") {
    document.querySelectorAll(".product-card").forEach(function(card) {
      card.addEventListener("click", function() {
        sessionStorage.setItem("indexScrollY", String(window.scrollY || window.pageYOffset));
      });
    });
  }

  var cartBtn = document.querySelector(".product-detail__cart-btn");
  var cartModal = document.getElementById("cart-modal");
  var cartModalClose = document.getElementById("cart-modal-close");

  if (cartBtn && cartModal) {
    cartBtn.addEventListener("click", function() { cartModal.classList.add("active"); });
    cartModalClose.addEventListener("click", function() { cartModal.classList.remove("active"); });
    cartModal.addEventListener("click", function(e) {
      if (e.target === cartModal) cartModal.classList.remove("active");
    });
  }

  var cartGoBtn = document.querySelector(".cart-modal__btn");
  if (cartGoBtn) {
    cartGoBtn.addEventListener("click", function() {
      window.location.href = "cart.html";
    });
  }
});

window.addEventListener("load", function() {
  var p = window.location.pathname.split("/").pop();
  if (p === "shop.html") {
    var savedScroll = sessionStorage.getItem("shopScrollY");
    if (savedScroll) {
      sessionStorage.removeItem("shopScrollY");
      window.scrollTo(0, parseInt(savedScroll));
    }
  }
  if (p === "index.html" || p === "") {
    var savedIndex = sessionStorage.getItem("indexScrollY");
    if (savedIndex) {
      sessionStorage.removeItem("indexScrollY");
      window.scrollTo(0, parseInt(savedIndex, 10));
    }
  }
});

var _scrollRafId = null;
var _nativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;

function smoothScrollTo(target, duration) {
  if (_scrollRafId !== null) {
    cancelAnimationFrame(_scrollRafId);
    _scrollRafId = null;
  }
  if (_nativeSmoothScroll) {
    window.scrollTo({ top: target, behavior: 'smooth' });
    return;
  }
  var start = window.scrollY || window.pageYOffset;
  var diff = target - start;
  if (!diff) return;
  var startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    var t = Math.min(1, (ts - startTime) / duration);
    t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo(0, Math.round(start + diff * t));
    if (t < 1) { _scrollRafId = requestAnimationFrame(step); }
    else { _scrollRafId = null; }
  }
  _scrollRafId = requestAnimationFrame(step);
}

// Principles scroll animation (about page)
(function() {
  var N = 4;
  var ITEM_HEIGHT = 187;
  var SNAP_THRESHOLD = 150;
  var SCROLL_PER_STEP = 150;
  var progress = 0;
  var locked = false;
  var triggerY = 0;
  var snapAccum = 0;
  var lockedScrollY = 0;

  var block, label, items;

  function stepScrollY() {
    return Math.round(triggerY + progress * SCROLL_PER_STEP);
  }

  function render() {
    var idx = Math.min(N - 1, progress);
    label.style.transform = 'translateY(' + (idx * ITEM_HEIGHT) + 'px)';
    items.forEach(function(item, i) {
      item.classList.toggle('active', i === idx);
    });
  }

  function lock() {
    if (locked) return;
    locked = true;
    snapAccum = SNAP_THRESHOLD * 0.5;
    lockedScrollY = stepScrollY();
    smoothScrollTo(lockedScrollY, 350);
  }

  function unlock() {
    if (!locked) return;
    locked = false;
    smoothScrollTo(lockedScrollY, 350);
  }

  function calcTrigger() {
    if (locked) return;
    triggerY = Math.round(document.documentElement.scrollHeight * 0.35);
  }

  function init() {
    block = document.getElementById('principles-block');
    label = document.getElementById('principles-label');
    items = document.querySelectorAll('.principle-item');
    if (!block || !label || items.length === 0) return;

    calcTrigger();
    if ((window.scrollY || window.pageYOffset) >= triggerY) progress = N;
    render();

    var revealObserver = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        block.classList.add('principles-revealed');
        revealObserver.disconnect();
      }
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0 });
    revealObserver.observe(block);
    if (progress >= N) block.classList.add('principles-revealed');

    setInterval(function() {
      if (locked) {
        snapAccum *= 0.97;
        if (Math.abs(snapAccum) < 2) snapAccum = 0;
      }
    }, 80);

    window.addEventListener('resize', function() {
      if (!locked) calcTrigger();
    });

    window.addEventListener('wheel', function(e) {
      var d = e.deltaY;
      if (e.deltaMode === 1) d *= 40;
      if (e.deltaMode === 2) d *= window.innerHeight;

      if (locked) {
        e.preventDefault();
        snapAccum += d;
        if (snapAccum >= SNAP_THRESHOLD) {
          snapAccum = 0;
          progress = Math.min(N, progress + 1);
          lockedScrollY = stepScrollY();
          render();
          if (progress >= N) unlock();
          else smoothScrollTo(lockedScrollY, 350);
        } else if (snapAccum <= -SNAP_THRESHOLD) {
          snapAccum = 0;
          progress = Math.max(0, progress - 1);
          lockedScrollY = stepScrollY();
          render();
          if (progress <= 0) unlock();
          else smoothScrollTo(lockedScrollY, 350);
        }
        return;
      }

      var sy = window.scrollY || window.pageYOffset;
      var entryY = stepScrollY();
      if (d > 0 && progress < N && sy + d >= entryY) {
        e.preventDefault();
        lock();
        return;
      }
      if (d < 0 && progress > 0 && sy + d <= entryY) {
        e.preventDefault();
        lock();
        return;
      }
    }, { passive: false });
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();

// Book page scroll animation
(function() {
  var SLIDE_DIST = 600;
  var progress = 0;
  var locked = false;
  var triggerY = 0;
  var bp1, bp2, bp3;

  function render() {
    var p2 = Math.min(1, progress);
    var p3 = Math.max(0, progress - 1);
    bp2.style.transform = 'translateX(-50%) translateY(' + Math.round((1 - p2) * SLIDE_DIST) + 'px)';
    bp3.style.transform = 'translateX(-50%) translateY(' + Math.round((1 - p3) * SLIDE_DIST) + 'px)';
  }

  function lock() {
    if (locked) return;
    locked = true;
    var sbW = window.innerWidth - document.documentElement.clientWidth;
    window.scrollTo(0, triggerY);
    document.documentElement.style.overflow = 'hidden';
    if (sbW > 0) document.documentElement.style.paddingRight = sbW + 'px';
  }

  function unlock() {
    if (!locked) return;
    locked = false;
    document.documentElement.style.overflow = '';
    document.documentElement.style.paddingRight = '';
    window.scrollTo(0, triggerY);
  }

  function calcTrigger() {
    TRIGGER_OFFSET = -1;
    if (locked) return;
    var navbar = document.querySelector('.navbar');
    var navBottom = navbar ? navbar.getBoundingClientRect().bottom : 0;
    var bp1Top = window.scrollY + bp1.getBoundingClientRect().top;
    triggerY = Math.max(0, Math.round(bp1Top - navBottom - TRIGGER_OFFSET));
  }

  function init() {
    bp1 = document.getElementById('book-page-1');
    bp2 = document.getElementById('book-page-2');
    bp3 = document.getElementById('book-page-3');
    if (!bp1 || !bp2 || !bp3) return;

    calcTrigger();
    if ((window.scrollY || window.pageYOffset) >= triggerY) progress = 2;
    render();

    window.addEventListener('resize', function() {
      if (!locked) calcTrigger();
    });

    window.addEventListener('wheel', function(e) {
      var d = e.deltaY;
      if (e.deltaMode === 1) d *= 40;
      if (e.deltaMode === 2) d *= window.innerHeight;

      if (locked) {
        e.preventDefault();
        progress = Math.max(0, Math.min(2, progress + d / SLIDE_DIST));
        render();
        if (progress <= 0 || progress >= 2) unlock();
        return;
      }

      var sy = window.scrollY || window.pageYOffset;

      if (d > 0 && progress < 2 && sy + d >= triggerY) {
        e.preventDefault();
        lock();
        return;
      }

      if (d < 0 && progress > 0 && sy + d <= triggerY) {
        e.preventDefault();
        lock();
        return;
      }
    }, { passive: false });
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();


