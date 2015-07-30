$( document ).ready( function() {
    var pageIndex = 0; // 焦点图索引
    var pageWidth = parseInt( $( "#focus" ).css( "width" ) );
    var autoPlayInterval = 4000;
    var scrollTime = 1000;
    var totalPage = $( ".page-index" ).length; // 焦点图总数
    var timerId = null; // 计时器ID

    $( ".focus .page-index" ).click( function() { // 点击索引按钮时的滚动
        pageIndex = $( this ).index()
        play( pageIndex );
    } ). hover( // 鼠标放在索引按钮上时清除自动部分，移开时启动自动播放
        function() {
            clearInterval( timerId );
        },
        function() {
            autoPlay();
        }
    );



    autoPlay(); // 启动自动播放

    // 播放
    function play( pageIndex ) {
        if ( pageIndex < 0 ) {
            pageIndex = totalPage;
        }            
        if ( pageIndex > totalPage - 1 ) {
            pageIndex %= totalPage;
        }
        $( ".focus .page-index" ).eq( pageIndex ).addClass( "active" ) // 改变点击按钮的样式为active
                                 .siblings().removeClass( "active" );   // 清除所有拥有active样式的兄弟元素
        $( ".focus-page-wrapper" ).stop().animate( { "left":  -pageWidth * pageIndex }, scrollTime );
    }
    function autoPlay() {
        autoPlay.pageIndex = pageIndex;
        timerId = setInterval( function () {
            if ( autoPlay.pageIndex !== pageIndex ) { // 如果已经改变过 page自动不播放
                autoPlay.pageIndex = pageIndex;
                return;
            }
            autoPlay.pageIndex = ++pageIndex;
            play( pageIndex );
        }, autoPlayInterval );
    }    
} );