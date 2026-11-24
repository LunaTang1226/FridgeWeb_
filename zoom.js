/* 让 375×826 的画布适配任意手机屏幕：贴顶缩放，不重排布局 */
(function () {
  var phone = document.querySelector('.phone');
  if (!phone) return;

  var body = document.body;

  /* 去掉桌面预览用的最小尺寸和外边距；顶部对齐，不要居中 */
  body.style.minWidth = '0';
  body.style.minHeight = '0';
  body.style.padding = '0';
  body.style.alignItems = 'flex-start';
  body.style.overflow = 'hidden';

  /* 缩放锚点放顶部，顶部永远贴住屏幕顶 */
  phone.style.transformOrigin = 'top center';

  function fit() {
    var vw = document.documentElement.clientWidth || window.innerWidth;

    /* 高度优先用 visualViewport：它不含浏览器地址栏/工具栏 */
    var vh = (window.visualViewport && window.visualViewport.height) ||
             document.documentElement.clientHeight ||
             window.innerHeight;

    body.style.height = vh + 'px';

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