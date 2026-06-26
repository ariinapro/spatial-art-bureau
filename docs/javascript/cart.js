(function () {
  function positionLines() {
    var num     = document.querySelector('.cart-404-number');
    var textBox = document.querySelector('.cart-404-text');
    var vline   = document.querySelector('.cart-center-vline');
    var hline   = document.querySelector('.cart-center-hline');
    if (!num || !textBox || !vline || !hline) return;

    var x        = Math.round(num.getBoundingClientRect().right + 10);
    var textTop  = Math.round(textBox.getBoundingClientRect().top);
    var midY     = Math.round(textTop / 2);

    vline.style.left   = x + 'px';
    vline.style.height = textTop + 'px';

    hline.style.top = midY + 'px';

    var leftVline = document.querySelector('.cart-left-vline');
    if (leftVline) leftVline.style.height = midY + 'px';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', positionLines);
  } else {
    positionLines();
  }
  window.addEventListener('resize', positionLines);
})();
