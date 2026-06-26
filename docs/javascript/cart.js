(function () {
  function positionLines() {
    var num     = document.querySelector('.cart-404-number');
    var textBox = document.querySelector('.cart-404-text');
    var vline   = document.querySelector('.cart-center-vline');
    var hline   = document.querySelector('.cart-center-hline');
    if (!num || !textBox || !vline || !hline) return;

    var x         = Math.round(num.getBoundingClientRect().right + 10);
    var topOffset = 97;
    var textTop   = Math.round(textBox.getBoundingClientRect().top);
    var midY      = Math.round((textTop + topOffset) / 2);

    vline.style.left   = x + 'px';
    vline.style.height = Math.max(0, textTop - topOffset) + 'px';

    hline.style.top = midY + 'px';

    vline.style.height = Math.max(0, midY - topOffset) + 'px';

    var leftVline = document.querySelector('.cart-left-vline');
    if (leftVline) leftVline.style.height = Math.max(0, midY - topOffset) + 'px';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', positionLines);
  } else {
    positionLines();
  }
  window.addEventListener('resize', positionLines);
})();
