(function () {
  var ARTISTS = ['Лев Ратманов', 'Алиса Северина', 'Марк Осипов', 'Герман Вельский'];

  function inject() {
    if (document.getElementById('artist-order-modal')) return;
    var el = document.createElement('div');
    el.innerHTML =
      // Full order modal (footer "заказать арт-объект")
      '<div class="artist-form-overlay" id="artist-order-modal">' +
        '<div class="artist-form-box" id="artist-order-box">' +
          '<button class="artist-form-box__close" id="artist-order-modal-close">&times;</button>' +
          '<form class="artist-form" onsubmit="return false;">' +
            '<input class="artist-form__field" type="text" placeholder="Ваше имя">' +
            '<input class="artist-form__field" type="text" placeholder="E-mail / Номер телефона">' +
            '<div class="artist-form__dropdown" id="artist-dropdown">' +
              '<div class="artist-form__dropdown-header">' +
                '<span class="artist-form__dropdown-label">Выбрать художника</span>' +
                '<span class="artist-form__dropdown-arrow"></span>' +
              '</div>' +
              '<ul class="artist-form__dropdown-list" id="artist-dropdown-list"></ul>' +
            '</div>' +
          '</form>' +
          '<button class="artist-form-box__submit" id="artist-order-submit" type="button">отправить</button>' +
          '<div class="artist-form-box__confirm">Ожидайте обратной связи</div>' +
        '</div>' +
      '</div>' +
      // Compact order modal (artist page CTA "заказать у …")
      '<div class="artist-form-overlay" id="artist-simple-order-modal">' +
        '<div class="artist-form-box artist-form-box--compact" id="artist-simple-order-box">' +
          '<button class="artist-form-box__close" id="artist-simple-order-close">&times;</button>' +
          '<form class="artist-form" onsubmit="return false;">' +
            '<input class="artist-form__field" type="text" placeholder="Ваше имя">' +
            '<input class="artist-form__field" type="text" placeholder="E-mail / Номер телефона">' +
          '</form>' +
          '<button class="artist-form-box__submit" id="artist-simple-order-submit" type="button">отправить</button>' +
          '<div class="artist-form-box__confirm">Ожидайте обратной связи</div>' +
        '</div>' +
      '</div>' +
      // Join modal (footer "стать частью бюро")
      '<div class="artist-form-overlay" id="artist-form-modal">' +
        '<div class="artist-form-box" id="artist-form-box">' +
          '<button class="artist-form-box__close" id="artist-form-modal-close">&times;</button>' +
          '<form class="artist-form" onsubmit="return false;">' +
            '<input class="artist-form__field" type="text" placeholder="Ваше имя">' +
            '<input class="artist-form__field" type="text" placeholder="E-mail / Номер телефона">' +
            '<textarea class="artist-form__field artist-form__field--textarea" placeholder="Расскажите о себе и своем опыте"></textarea>' +
          '</form>' +
          '<button class="artist-form-box__submit" id="artist-form-submit" type="button">отправить</button>' +
          '<div class="artist-form-box__confirm">Ожидайте обратной связи</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
  }

  function init() {
    inject();

    var orderOverlay      = document.getElementById('artist-order-modal');
    var orderBox          = document.getElementById('artist-order-box');
    var orderClose        = document.getElementById('artist-order-modal-close');
    var orderSubmit       = document.getElementById('artist-order-submit');
    var dropdown          = document.getElementById('artist-dropdown');
    var dropdownList      = document.getElementById('artist-dropdown-list');
    var dropdownLabel     = dropdown && dropdown.querySelector('.artist-form__dropdown-label');
    var dropdownHdr       = dropdown && dropdown.querySelector('.artist-form__dropdown-header');

    var simpleOverlay     = document.getElementById('artist-simple-order-modal');
    var simpleBox         = document.getElementById('artist-simple-order-box');
    var simpleClose       = document.getElementById('artist-simple-order-close');
    var simpleSubmit      = document.getElementById('artist-simple-order-submit');

    var joinOverlay       = document.getElementById('artist-form-modal');
    var joinBox           = document.getElementById('artist-form-box');
    var joinClose         = document.getElementById('artist-form-modal-close');
    var joinSubmit        = document.getElementById('artist-form-submit');

    // Populate dropdown with artist names
    if (dropdownList) {
      ARTISTS.forEach(function (name) {
        var li = document.createElement('li');
        li.className = 'artist-form__dropdown-item';
        li.textContent = name;
        li.addEventListener('click', function () {
          dropdownLabel.textContent = name;
          dropdownList.querySelectorAll('.artist-form__dropdown-item').forEach(function (i) { i.classList.remove('selected'); });
          li.classList.add('selected');
          dropdown.classList.remove('open');
        });
        dropdownList.appendChild(li);
      });
    }
    if (dropdownHdr) {
      dropdownHdr.addEventListener('click', function () { dropdown.classList.toggle('open'); });
    }

    function openModal(overlay, box) {
      box.classList.remove('artist-form-box--confirmed');
      overlay.classList.add('active');
    }
    function closeModal(overlay, extra) {
      overlay.classList.remove('active');
      if (extra) extra();
    }

    // Artist page CTA ("заказать у …") → compact modal, no dropdown
    document.querySelectorAll('.artist-cta-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); openModal(simpleOverlay, simpleBox); });
    });

    // Footer buttons: first = full order, second = join
    var footerBtns = document.querySelectorAll('.footer-cta-btn');
    if (footerBtns[0]) footerBtns[0].addEventListener('click', function (e) { e.preventDefault(); openModal(orderOverlay, orderBox); });
    if (footerBtns[1]) footerBtns[1].addEventListener('click', function (e) { e.preventDefault(); openModal(joinOverlay, joinBox); });

    // Close buttons
    if (orderClose)  orderClose.addEventListener('click',  function () { closeModal(orderOverlay, function () { if (dropdown) dropdown.classList.remove('open'); }); });
    if (simpleClose) simpleClose.addEventListener('click', function () { closeModal(simpleOverlay); });
    if (joinClose)   joinClose.addEventListener('click',   function () { closeModal(joinOverlay); });

    // Submit → confirmation
    if (orderSubmit)  orderSubmit.addEventListener('click',  function () { orderBox.classList.add('artist-form-box--confirmed'); if (dropdown) dropdown.classList.remove('open'); });
    if (simpleSubmit) simpleSubmit.addEventListener('click', function () { simpleBox.classList.add('artist-form-box--confirmed'); });
    if (joinSubmit)   joinSubmit.addEventListener('click',   function () { joinBox.classList.add('artist-form-box--confirmed'); });

    // Click outside to close
    orderOverlay.addEventListener('click',  function (e) { if (e.target === orderOverlay)  closeModal(orderOverlay, function () { if (dropdown) dropdown.classList.remove('open'); }); });
    simpleOverlay.addEventListener('click', function (e) { if (e.target === simpleOverlay) closeModal(simpleOverlay); });
    joinOverlay.addEventListener('click',   function (e) { if (e.target === joinOverlay)   closeModal(joinOverlay); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
