var isUnlocked = false;
var sidebarFixedTop = 0;
var lineFixedTop = 0;
var blockFixedTop = 0;
var fullSep = document.querySelector('.work-separator--full');
var unlockScrollY = null;

function computeUnlockThreshold() {
  if (!fullSep) return;
  unlockScrollY = fullSep.getBoundingClientRect().top + window.scrollY - window.innerHeight;
}
computeUnlockThreshold();
window.addEventListener('resize', computeUnlockThreshold);

function positionArtistSidebar() {
  var navbar = document.querySelector('.navbar');
  var sidebar = document.querySelector('.sidebar-box--artist-page');
  var block = document.querySelector('.artist-block');
  var line = document.querySelector('.artist-sidebar-line');
  if (!navbar || !sidebar) return;
  var top = Math.round(navbar.getBoundingClientRect().bottom) - 1;
  sidebarFixedTop = top;
  lineFixedTop = top + sidebar.offsetHeight;
  if (block) blockFixedTop = parseInt(getComputedStyle(block).top, 10);
  if (!isUnlocked) {
    sidebar.style.top = top + 'px';
    if (line) line.style.top = lineFixedTop + 'px';
  }
  updateLineHeight();
}
positionArtistSidebar();
window.addEventListener('resize', positionArtistSidebar);

var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.scroll-reveal').forEach(function(el) {
  revealObserver.observe(el);
});

function updateLineHeight() {
  if (isUnlocked) return;
  var line = document.querySelector('.artist-sidebar-line');
  if (!line || !fullSep) return;
  var sepTop = fullSep.getBoundingClientRect().top;
  line.style.height = Math.max(0, sepTop - lineFixedTop - 30) + 'px';
}

function unlockLeftBlock() {
  if (isUnlocked) return;
  isUnlocked = true;
  var snap = unlockScrollY;

  var sidebar = document.querySelector('.sidebar-box--artist-page');
  var block = document.querySelector('.artist-block');
  var line = document.querySelector('.artist-sidebar-line');

  if (sidebar) {
    sidebar.style.position = 'absolute';
    sidebar.style.top = (snap + sidebarFixedTop) + 'px';
  }
  if (block) {
    block.style.position = 'absolute';
    block.style.top = (snap + blockFixedTop) + 'px';
  }
  if (line) {
    line.style.position = 'absolute';
    line.style.top = (snap + lineFixedTop) + 'px';
    line.style.height = (window.innerHeight - lineFixedTop - 30) + 'px';
  }
}

function lockLeftBlock() {
  if (!isUnlocked) return;
  isUnlocked = false;
  var sidebar = document.querySelector('.sidebar-box--artist-page');
  var block = document.querySelector('.artist-block');
  var line = document.querySelector('.artist-sidebar-line');
  if (sidebar) { sidebar.style.position = 'fixed'; sidebar.style.top = sidebarFixedTop + 'px'; }
  if (block)   { block.style.position = '';         block.style.top = ''; }
  if (line)    { line.style.position = 'fixed';     line.style.top = lineFixedTop + 'px'; line.style.height = ''; }
}

function onScroll() {
  if (unlockScrollY === null) return;
  if (window.scrollY >= unlockScrollY) {
    unlockLeftBlock();
  } else {
    lockLeftBlock();
  }
  updateLineHeight();
}
window.addEventListener('scroll', onScroll, { passive: true });

function positionFooterSection() {
  var rightBlock = document.querySelector('.moving-right-block--artist-page');
  var grid = document.querySelector('.horizontal-grid--artist-page');
  var footer = document.querySelector('.footer--artist-page');
  if (!rightBlock) return;
  var blockBottom = rightBlock.getBoundingClientRect().bottom + window.scrollY;
  var gridTop = Math.round(blockBottom + 350);
  if (grid) grid.style.top = gridTop + 'px';
  if (footer) footer.style.top = (gridTop + 150) + 'px';
}

function positionArtistCta() {
  var sep = document.querySelector('.work-separator--full');
  var grid = document.querySelector('.horizontal-grid--artist-page');
  var btn = document.querySelector('.artist-cta-btn');
  if (!sep || !grid || !btn) return;
  var sepBottom = sep.getBoundingClientRect().bottom + window.scrollY;
  var gridTop = grid.getBoundingClientRect().top + window.scrollY;
  btn.style.top = Math.round((sepBottom + gridTop) / 2 - btn.offsetHeight / 2) + 'px';
}

positionFooterSection();
positionArtistCta();
window.addEventListener('resize', function() {
  positionFooterSection();
  positionArtistCta();
});
