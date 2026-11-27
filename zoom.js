/* 页面适配：
   - 手机（窄屏）：宽度铺满；高度按屏幕可用高度压缩，能放下就整屏无滚动，
     放不下（内容会压到 tabbar）就自动退回原设计高度 826，允许上下滑动
   - 桌面（宽屏）：保持原来的"手机放在灰色背景里看预览"的效果 */
(function () {
  var phone = document.querySelector('.phone');
  if (!phone) return;
  if (phone.parentNode && phone.parentNode.className === '__fitwrap') return; /* 防重复 */

  var body = document.body;

  var BASE_W = phone.offsetWidth || 375;
  var BASE_H = phone.offsetHeight || 826;
  var MIN_H = 560;                    /* 压缩下限，再矮就别硬压了，直接让它滚 */
  var pageBg = getComputedStyle(phone).backgroundColor || '#F2F4F7';

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

  function tabbarHeight() {
    var tb = phone.querySelector('.tabbar');
    return tb ? tb.offsetHeight : 0;
  }

  /* 测"内容最底部相对于画布顶部"的位置。
     排除：
       - tabbar 及其内部
       - 弹层/抽屉
       - 被拉伸的容器（position:absolute 且 top、bottom 都有值，例如滚动列表）
         以及它们内部的元素——这些随画布一起伸缩，不会压到 tabbar */
  function contentBottom() {
    var top = phone.getBoundingClientRect().top;
    var tb = phone.querySelector('.tabbar');
    var maxB = 0;

    function isStretched(el) {
      var cs = getComputedStyle(el);
      return cs.position === 'absolute' && cs.top !== 'auto' && cs.bottom !== 'auto';
    }

    function walk(parent, inStretch) {
      for (var i = 0; i < parent.children.length; i++) {
        var c = parent.children[i];
        if (tb && (c === tb || tb.contains(c))) continue;
        if (c.classList.contains('mask') || c.classList.contains('dialog-mask') ||
            c.classList.contains('sheet') || c.classList.contains('toast')) continue;
        if (c.hidden) continue;

        var cs = getComputedStyle(c);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (cs.position === 'fixed') continue;

        var st = isStretched(c);

        if (!inStretch && !st &&
            !(cs.position === 'absolute' && (cs.top === 'auto' || cs.top === ''))) {
          var r = c.getBoundingClientRect();
          if (r.height > 0 && r.width > 0) {
            var b = r.bottom - top;
            if (b > maxB) maxB = b;
          }
        }

        walk(c, inStretch || st);
      }
    }

    walk(phone, false);
    return maxB;
  }

  var lastKey = '';

  function fit() {
    var vw = document.documentElement.clientWidth || window.innerWidth;

    var vh = Math.min(
      window.innerHeight || 9999,
      document.documentElement.clientHeight || 9999
    );
    if (!vh || vh > 2000) vh = 800;

    var mobile = vw <= 600;
    var s = mobile
      ? vw / BASE_W
      : Math.min(vw / BASE_W, (vh - 80) / BASE_H, 1.15);

    if (!s || !isFinite(s) || s <= 0) s = 1;

    body.style.background = mobile ? pageBg : '#C9CDD4';
    phone.style.boxShadow = mobile ? 'none' : '';
    wrap.style.marginTop = mobile ? '0' : '40px';

    wrap.style.width = (BASE_W * s) + 'px';
    phone.style.transform = 'scale(' + s + ')';

    var h = BASE_H;

    if (mobile) {
      var avail = vh / s;               /* 屏幕能分给画布的高度（设计稿坐标） */
      if (avail < BASE_H) {
        var cand = Math.max(avail, MIN_H);
        var key = vw + 'x' + vh + '@' + Math.round(cand);

        if (key !== lastKey) {
          lastKey = key;
          phone.style.height = cand + 'px';
          var need = contentBottom() + tabbarHeight() + 4;
          /* 页面自己带滚动（overflow-y:auto/scroll，如选择格口页）时不用退回，压缩即可 */
          var selfScroll = /auto|scroll/.test(getComputedStyle(phone).overflowY);
          if (need > cand && !selfScroll) cand = BASE_H;
        }
        h = cand;
      }
    }

    if (h !== BASE_H) {
      phone.style.height = h + 'px';
    } else {
      phone.style.height = BASE_H + 'px';
    }
    wrap.style.height = (h * s) + 'px';
  }

  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fit);
  }
})();