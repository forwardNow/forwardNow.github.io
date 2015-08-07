
$( function () {
    focusScroll();
    hoverPanel();
} );

function focusScroll(){
    var pageIndex = 0; // 焦点图索引
    var pageWidth = 580;
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
        $( ".focus-page-wrapper" ).stop().animate( { "left":  -pageWidth * pageIndex + "px"}, scrollTime );
        $( ".focus .page-title" ).eq( pageIndex ).addClass( "active" )
                                .siblings().removeClass( "active" );

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

};

function hoverPanel() {

    var othersitesListItem = $( ".othersites-list-item" );
    var timerId = null;
    othersitesListItem.hover(
        function () {
            clearTimeout( timerId );
            $( this ).addClass( "hover" ).siblings().removeClass( "hover" );
        },
        function () {
            var self = this;
            timerId = setTimeout(function () { $( self ).removeClass( "hover" ) }, 300);
        }

        );

    var opanelLists = $( ".opanel-list" );
    for ( var i = 0; i < opanelLists.length; i++ ) {
        var opanelList = opanelLists.eq( i );
        var opanelListItem = opanelList.children();
        var opanelWidth = Math.ceil( opanelListItem.length / 8 ) * 200;
        var opanel = opanelList.parent();
        var listItem = opanel.parent();
        var listItemLeft = listItem.position().left;
        var newOpanelList = null;

        opanel.css( "width", opanelWidth + "px" );
        if ( 1000 - listItemLeft > opanelWidth ) {
            opanel.css( "left", "0px" );
        } else {
            opanel.css( "right", "0px" );
            
        }

        
        for ( var x = 0; x < opanelListItem.length; x++ ) {
            if ( newOpanelList == null || newOpanelList.children().length >= 8 ) {
                newOpanelList = $( "<ul class='opanel-list'></ul>" );
                opanel.append( newOpanelList );
            }
            newOpanelList.append( opanelListItem[ x ] );
        }
        opanelList.remove();
    }
}
