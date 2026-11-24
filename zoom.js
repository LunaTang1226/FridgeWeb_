/* 让 375×826 的画布自适应任意手机屏幕：等比缩放，不重排布局 */
(function () {
  var phone = document.querySelector('.phone');
  if (!phone) return;

  /* 去掉桌面预览用的最小宽度和外边距 */
  document.body.style.minWidth = '0';
  document.body.style.padding = '0';
  document.body.style.alignItems = 'center';
  document.body.style.overflow = 'hidden';

  phone.style.transformOrigin = 'center center';

  function fit() {
    var s = Math.min(window.innerWidth / 375, window.innerHeight / 826, 1.2);
    phone.style.transform = 'scale(' + s + ')';
  }

  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
})();