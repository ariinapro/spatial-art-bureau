(function () {
  function positionElements() {
    var textBlock = document.querySelector('.artists-text');
    var photo1    = document.querySelector('.artist-photo-1');
    var hgrid     = document.querySelector('.horizontal-grid--artists-page');
    if (!textBlock || !photo1 || !hgrid) return;

    var scrollY      = window.scrollY || window.pageYOffset;
    var photo1Rect   = photo1.getBoundingClientRect();
    var hLineY       = textBlock.getBoundingClientRect().bottom + scrollY;
    var photoTopY    = photo1Rect.top  + scrollY;
    var photoBottomY = photo1Rect.bottom + scrollY;
    var hgridTopY    = hgrid.getBoundingClientRect().top + scrollY;

    // top: negative offset above photo to reach the horizontal line below artists-text
    photo1.style.setProperty('--dotted-line-top', (hLineY - photoTopY) + 'px');

    // bottom: negative offset extends the line below the photo to reach horizontal-grid top
    photo1.style.setProperty('--dotted-line-bottom', (photoBottomY - hgridTopY) + 'px');
  }

  function initModals() {
    var joinOverlay  = document.getElementById('artist-form-modal');
    var joinBox      = document.getElementById('artist-form-box');
    var joinClose    = document.getElementById('artist-form-modal-close');
    var joinSubmit   = document.getElementById('artist-form-submit');

    var orderOverlay = document.getElementById('artist-order-modal');
    var orderBox     = document.getElementById('artist-order-box');
    var orderClose   = document.getElementById('artist-order-modal-close');
    var orderSubmit  = document.getElementById('artist-order-submit');
    var dropdown     = document.getElementById('artist-dropdown');
    var dropdownList = document.getElementById('artist-dropdown-list');
    var dropdownLabel = dropdown && dropdown.querySelector('.artist-form__dropdown-label');

    function openModal(overlay, box) {
      box.classList.remove('artist-form-box--confirmed');
      overlay.classList.add('active');
    }
    function closeModal(overlay) {
      overlay.classList.remove('active');
    }

    // Populate dropdown from artist name elements on the page
    document.querySelectorAll('.artist-name').forEach(function (el) {
      var namePara = el.querySelector('p:not(.artist-number)');
      if (!namePara) return;
      var name = (namePara.innerText || namePara.textContent).replace(/\n/g, ' ').trim();
      var li = document.createElement('li');
      li.className = 'artist-form__dropdown-item';
      li.textContent = name;
      li.addEventListener('click', function () {
        dropdownLabel.textContent = name;
        document.querySelectorAll('.artist-form__dropdown-item').forEach(function (i) { i.classList.remove('selected'); });
        li.classList.add('selected');
        dropdown.classList.remove('open');
      });
      dropdownList.appendChild(li);
    });

    // Dropdown toggle
    var dropdownHeader = dropdown && dropdown.querySelector('.artist-form__dropdown-header');
    if (dropdownHeader) {
      dropdownHeader.addEventListener('click', function () {
        dropdown.classList.toggle('open');
      });
    }

    // Button routing — join modal
    document.querySelectorAll('.artists-cta-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); openModal(joinOverlay, joinBox); });
    });

    // Button routing — order modal
    document.querySelectorAll('.artists-cta-btn-secondary').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); openModal(orderOverlay, orderBox); });
    });

    // Footer buttons routed by text
    document.querySelectorAll('.footer-cta-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (btn.textContent.trim().indexOf('заказать') !== -1) {
          openModal(orderOverlay, orderBox);
        } else {
          openModal(joinOverlay, joinBox);
        }
      });
    });

    // Submit → confirmation
    if (joinSubmit) {
      joinSubmit.addEventListener('click', function () {
        joinBox.classList.add('artist-form-box--confirmed');
      });
    }
    if (orderSubmit) {
      orderSubmit.addEventListener('click', function () {
        orderBox.classList.add('artist-form-box--confirmed');
        if (dropdown) dropdown.classList.remove('open');
      });
    }

    // Close buttons
    if (joinClose)  joinClose.addEventListener('click',  function () { closeModal(joinOverlay); });
    if (orderClose) orderClose.addEventListener('click', function () { closeModal(orderOverlay); });

    joinOverlay.addEventListener('click',  function (e) { if (e.target === joinOverlay)  closeModal(joinOverlay); });
    orderOverlay.addEventListener('click', function (e) { if (e.target === orderOverlay) closeModal(orderOverlay); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      positionElements();
      initModals();
    });
  } else {
    positionElements();
    initModals();
  }
  window.addEventListener('resize', positionElements);
})();
