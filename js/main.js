
function submenu() {

    /* 子菜单显示与隐藏 */ 
    $( ".menumain-item" ).bind({
        mouseover: function () {
            $( ".sub-menu", this ).stop().slideDown(300);
        },
        mouseout: function () {
            $( ".sub-menu", this ).stop().slideUp(300);
        }
    });
    /* 当屏幕小于960时对子菜单的处理 */
    $( ".menu-control" ).click( function () {
        $( this ).toggleClass( "menu-control-h" );
        if ( $( this ).hasClass( "menu-control-h" ) ) {
            $( ".header" ).slideDown(300);
        } else {
            $( ".header" ).slideUp(300);
        }

        $( ".menumain-item" ).unbind( "mouseover" ).unbind( "mouseout" );

    } );

}

/* 回到顶部 */
function scrollToTop () {

    $( window ).bind( "scroll", function () {
        var scrollTop = parseInt( $( this ).scrollTop() );
        var windowHeight = parseInt( $( this ).height() ) / 2;
        if ( scrollTop > windowHeight ) {
            $( "#go-top" ).fadeIn();
        } else {
            $( "#go-top" ).fadeOut();
        }
    } );
    $( "#go-top a" ).bind( "click", function () {
        $('html, body').animate( { scrollTop: 0 }, 300 ); 
    } );

}



/* 滚动加载 */
function pageMore(){
    var page = 1;
    var loadingFlag = false;
    var counter = 4;
    function scrollListen(){
        $(document).scroll(function(){
            var bottomPadding = $(document).height() - $(document).scrollTop() - $(window).height();
            console.info(bottomPadding);
            if( bottomPadding < 50 && !loadingFlag ){
                loadingFlag = true;
                pageShow();
                page++;

            }
        });
    }
    function pageShow() {
        /*
        var _url = "?action=pageMore&page="+page;
        $.ajax({
            url: _url, type: 'GET', dataType: 'text', timeout: 200, 
            error: function(){ 

            },
            success: function( feedback ) {
                loadingFlag = false;
                $('#homecontent').append(feedback);
                $('#infscr-loading').hide();
            }
        });
        */
        if ( counter-- < 0 ) {
            $('#infscr-loading').hide();
            return;
        }
        var clones = $( "div[role='listitem']:lt(4)" ).clone();
        $('#homecontent').append( clones );   
        $('#infscr-loading').hide();   
        loadingFlag = false;  
    }

    scrollListen();
}





