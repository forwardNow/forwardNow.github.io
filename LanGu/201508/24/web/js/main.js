;
var ns = {}; // namespace

ns.page = {};// 哪个页面
ns.page.isHome = false; // 主页

ns.home = {}; // 主页名称空间


// 官方资讯，选项卡切换
ns.home.switchInfoColumn = function () {
    $( ".colunm-info-information .head-title" ).click( function () {
        $( this ).addClass( "active" ).siblings().removeClass( "active" );
        $( ".colunm-info-information .list" ).eq( $( this ).index() ).show().siblings().hide();
    } );
}

$( function () {
    if ( ns.page.isHome ) {
        ns.home.switchInfoColumn();
    }
} );

