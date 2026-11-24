/* 让 375×826 的画布适配任意手机屏幕。
   做法：把 .phone 放进一个外包盒，盒子的尺寸 = 缩放后的视觉尺寸，
   .phone 用 transform 缩放（原点左上）。这样居中、滚动区域都是准的。 */
(function () {
  var phone = document.querySelector('.phone');
  if (!phone) return;
  if (phone.parentNode && phone.parentNode.className === '__fitwrap') return; /* 防重复 */

  var body = document.body;

  /* 去掉桌面预览用的最小尺寸/外边距，顶部对齐 */
  body.style.minWidth = '0';
  body.style.minHeight = '0';
  body.style.margin = '0';
  body.style.padding = '0';
  body.style.alignItems = 'flex-start';
  body.style.overflowX = 'hidden';
  body.style.overflowY = 'auto';   /* 兜底：算大了也能滑到底，不会卡死 */

  var BASE_W = phone.offsetWidth || 375;
  var BASE_H = phone.offsetHeight || 826;

  var wrap = document.createElement('div');
  wrap.className = '__fitwrap';
  wrap.style.cssText = 'position:relative;flex:0 0 auto;margin:0;padding:0;';
  phone.parentNode.insertBefore(wrap, phone);
  wrap.appendChild(phone);

  phone.style.position = 'absolute';
  phone.style.left = '0';
  phone.style.top = '0';
  phone.style.margin = '0';
  phone.style.transformOrigin = 'top left';

  function fit() {
    var vw = document.documentElement.clientWidth || window.innerWidth;

    var vh = Math.min(
      window.innerHeight || 9999,
      document.documentElement.clientHeight || 9999
    );
    if (!vh || vh > 2000) vh = 800;

    /* 保守预留 56px 给浏览器地址栏/工具栏：宁可算小，不算大 */
    var usable = vh - 56;
    if (usable < 480) usable = vh;

    var s = Math.min(vw / BASE_W, usable / BASE_H, 1.15) * 0.97;

    wrap.style.width = (BASE_W * s) + 'px';
    wrap.style.height = (BASE_H * s) + 'px';
    phone.style.transform = 'scale(' + s + ')';
  }

  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fit);
  }
})();