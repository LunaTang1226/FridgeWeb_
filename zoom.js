/* 页面适配：
   - 手机（窄屏）：宽度铺满，按比例放大，纵向可滚动——不再有两侧灰边
   - 桌面（宽屏）：保持原来的"手机放在灰色背景里看预览"的效果 */
(function () {
  var phone = document.querySelector('.phone');
  if (!phone) return;
  if (phone.parentNode && phone.parentNode.className === '__fitwrap') return; /* 防重复 */

  var body = document.body;

  var BASE_W = phone.offsetWidth || 375;
  var BASE_H = phone.offsetHeight || 826;
  var pageBg = getComputedStyle(phone).backgroundColor || '#F2F4F7';

  /* 去掉桌面预览用的最小尺寸/内边距 */
  body.style.minWidth = '0';
  body.style.minHeight = '0';
  body.style.margin = '0';
  body.style.padding = '0';
  body.style.alignItems = 'flex-start';
  body.style.overflowX = 'hidden';
  body.style.overflowY = 'auto';

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

    var mobile = vw <= 600;
    var s;

    if (mobile) {
      /* 手机：铺满宽度，高度按比例自然增长（超出就上下滑） */
      s = vw / BASE_W;
      body.style.background = pageBg;   /* 滑到底也不露灰边 */
      phone.style.boxShadow = 'none';
      wrap.style.marginTop = '0';
    } else {
      /* 桌面：整幅放进视口，居中，保留灰色背景预览 */
      s = Math.min(vw / BASE_W, (vh - 80) / BASE_H, 1.15);
      body.style.background = '#C9CDD4';
      wrap.style.marginTop = '40px';
    }

    if (!s || !isFinite(s) || s <= 0) s = 1;

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