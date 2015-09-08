/**
 * 焦点图（轮播）类

 参数说明：
   options = {
      selectors: {
        focus: "#focus",  // 整个焦点图
        pages: "#focus .page-list__item",   // 所有的包含轮播图的<LI>
        indexs: "#focus .focus__index .index__item", // 轮播图的索引
        prevBtn: "#focus .prev", // 前一张
        nextBtn: "#focus .next" // 后一张
      },
      activeIndexClass: "index__item_active",  // 当前轮播图索引的CSS类
      autoPlay: {
        enable: true, // 初始化时开启自动播放
        interval: 4000
      }      
   }

 使用示例：
  <script>
    (function () {

      var options = {
          selectors: {
            focus: "#focus",  // 整个焦点图
            pages: "#focus .page-list__item",   // 所有的包含轮播图的<LI>
            indexs: "#focus .focus__index .index__item", // 轮播图的索引
            prevBtn: "#focus .prev", // 前一张
            nextBtn: "#focus .next" // 后一张
          },
          activeIndexClass: "index__item_active",
          autoPlay: {
            enable: true, // 初始化时开启自动播放
            interval: 4000
          }
      };
      
      var focus = new Focus( options );
      // focus.autoPlay( false ); // 手动关闭自动播放
    }) ();
  </script>

 */ 
function Focus ( options ) {
  this.options = options;
  this.$focus = options.selectors.focus && $( options.selectors.focus );
  this.$pages = options.selectors.pages && $( options.selectors.pages );
  this.$indexs = options.selectors.indexs && $( options.selectors.indexs );
  this.$prevBtn = options.selectors.prevBtn && $( options.selectors.prevBtn );
  this.$nextBtn = options.selectors.nextBtn && $( options.selectors.nextBtn );
  this.currentIndex = 0;
  this.pageSize = this.$pages.size();
  this.init();
}
// 显示指定index的焦点图
Focus.prototype.play = function ( index ) {
  var active = this.options.activeIndexClass;
  this.$indexs && this.$indexs.removeClass( active ).eq( index ).addClass( active );
  this.$pages.hide().eq( index ).stop().fadeIn(); 
}
// 初始化：1.给索引按钮添加点击事件；2.给前后按钮添加点击事件；3.启动自动播放
Focus.prototype.init = function () {
  var focus = this;
  focus.$indexs && focus.$indexs.click( function () {
    focus.currentIndex = $( this ).index();
    focus.play( focus.currentIndex  );
    return false;      
  } );
  this.$prevBtn && this.$prevBtn.click( function () {
    focus.currentIndex = ( --focus.currentIndex + focus.pageSize ) % focus.pageSize;
    focus.play( focus.currentIndex  );
  } );
  this.$nextBtn && this.$nextBtn.click( function () {
    focus.currentIndex = ( ++focus.currentIndex ) % focus.pageSize;
    focus.play( focus.currentIndex  );
  } );
  if ( focus.options.autoPlay && focus.options.autoPlay.enable ) {
    this.autoPlay( true );
  }
}
// 自动播放，参数：true-开启自动播放，false-关闭。
Focus.prototype.autoPlay = function ( isEnable ) {
  var focus = this;
  if ( ! isEnable ) {
    focus.autoPlay.intervalId && clearInterval( focus.autoPlay.intervalId );
    focus.options.autoPlay.enable = false;
    return;
  }

  if ( isEnable ) {
    focus.options.autoPlay.enable = true;
    launch();
  }
  
  // 光标置于索引上时停止自动播放
  this.$indexs && this.$indexs.hover( 
    function () { // 停止
      focus.autoPlay.intervalId && clearInterval( focus.autoPlay.intervalId );
    },
    function () { // 开始
      focus.options.autoPlay.enable && launch();
    }
  );
  // 启动自动播放
  function launch () {
    focus.autoPlay.intervalId = setInterval( 
      function () {
        focus.play( ++focus.currentIndex % focus.pageSize );
      }, 
      focus.options.autoPlay.interval || 3000
    );
}
}
