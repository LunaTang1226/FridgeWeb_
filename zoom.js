/* 让 375×826 的画布适配任意手机屏幕：等比缩放，不重排布局 */
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
    /* 宽：用真实 CSS 宽度 */
    var vw = document.documentElement.clientWidth || window.innerWidth;

    /* 高：优先用 visualViewport，它不含浏览器地址栏/工具栏 */
    var vh = (window.visualViewport && window.visualViewport.height) ||
             document.documentElement.clientHeight ||
             window.innerHeight;

    var s = Math.min(vw / 375, vh / 826, 1.2) * 0.98;

    phone.style.transform = 'scale(' + s + ')';
  }

  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fit);
  }
})();