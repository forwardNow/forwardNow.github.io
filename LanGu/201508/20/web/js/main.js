
;
var ns = {}; // namespace

$( function () {

    
    ns.isHasHomeBanner = $( ".banner-home" ).size() > 0;
    ns.isHasNavList = $( ".header .nav .nav-list" ).size() > 0;
    ns.isHasSearch = $( ".innerpage-banner .search-wrap .search-input" ).size() > 0;
    ns.isHasOutline = $( ".content-outline .outline-list .outline-item" ).size() > 0;
    ns.isHasGoToTop = $( "#go-top" ).size() > 0;
    ns.isHasInnerpageBanner = $( ".innerpage-banner .page-title" ).size() > 0;
    // ns.isHasInnerpageSearch = $( ".innerpage-banner .search-wrap" ).size() > 0;
    // ns.isHasInnerpageHeadTitle = $( ".content-inner .content-head-title" ).size() > 0;

    if ( ns.isHasHomeBanner ) {
        $( ".banner-text-left" ).load( function () {
            $( this ).addClass( " animated  bounceInLeft" );
        } );
        $( ".banner-text-right" ).load( function () {
            $( this ).addClass( " animated  bounceInRight" );
        } );
        $( ".banner-text-bottom" ).load( function () {
            $( this ).addClass( " animated  bounceInUp" );
        } );

        doAnimateColumnPictures();
    }

    if ( ns.isHasNavList ) {
        doNavList();   
    }
    if ( ns.isHasSearch ) {
        doSearch();
    }
    if ( ns.isHasOutline ) {
        doOutline();
    }
    if ( ns.isHasGoToTop ) {
        doGoTop();
    }

    if ( ns.isHasInnerpageBanner ) {
        $( ".innerpage-banner .page-title" ).addClass( "bounceInLeft animated" );
    }

    if ( ns.isHasInnerpageSearch ) {
        $( ".innerpage-banner .search-wrap" ).addClass( "bounceInRight animated" );
    }
    if ( ns.isHasInnerpageHeadTitle ) {
        $( ".content-inner .content-head-title" ).addClass( "bounceInLeft animated" );;
    }
} );
        
function doAnimateColumnPictures() {

    $( ".home-mod .head-more" ).hover(
        function () {
            $( this ).addClass( "jello animated" );
        },
        function () {
            $( this ).removeClass( "jello animated" );
        }
    );
    $( ".home-ourteam .list-item" ).hover(
        function (){
            $( this ).addClass("active").find(".member-pic").addClass("rotateIn animated" )
        },
        function () {
            $( this ).removeClass("active").find(".member-pic").removeClass("rotateIn animated" )
        }
    );    
    $( ".home-shealth .list-item" ).hover(
        function (){
            $( this ).addClass("active").find(".pic-wrap").addClass( "flipInX animated" )
        },
        function () {
            $( this ).removeClass("active").find(".pic-wrap").removeClass( "flipInX animated" )
        }
    );    

    // 栏目标题动画
    $( window ).scroll( function () {
        var scrollTop = $( this ).scrollTop();
        var viewportHeight = $( window ).height();
        $( ".home-mod .head-title" ).each( function ( index, elt ) {
            var viewportTop = $( this ).offset().top - scrollTop;
            if ( viewportTop > 0 && viewportTop < viewportHeight ) {
                $( this ).addClass( "animated bounceInLeft" );
            } else {
                $( this ).removeClass( "animated bounceInLeft" );
            }
        } );
    } );
}

function doGoTop () {

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

function doOutline() {

    // 给栏目大纲设置CSS动画
    $( ".content-outline .outline-item a" ).hover(
        function() {
            var self = this;
            $( this ).addClass( "bounceOutRight animated active" );
            setTimeout( function () {
                $( self ).removeClass( "bounceOutRight animated" );
            }, 600 )
        },  
        function () {
            $( this ).removeClass( "active" );
        }
    );

    // 让栏目大纲随页面滚动
    var originOffsetTop = $( ".content-outline" ).offset().top;
    $( window ).scroll( function () {
        var scrollHeight = $( this ).scrollTop();
        var outlineOffset = $( ".content-outline" ).offset();
        // 重定位大纲
        if ( scrollHeight > originOffsetTop ) {
            $( ".content-outline" ).offset( { 
                top: scrollHeight - 60,
                left: outlineOffset.left
            } );
        } else {
            $( ".content-outline" ).offset( { 
                top: originOffsetTop,
                left: outlineOffset.left
            } );                        
        }
/*        
        // 滚动过程中设置当前栏目为active
        $( ".content-outline .outline-item" ).each( function ( index, elt ) {
            var contentColumn = $( ".content-container .o_anchor" ).eq( index );
            var viewportTop = contentColumn.offset().top - scrollHeight;
            if ( viewportTop > -50 && viewportTop < 50 ) {
                $( this ).addClass( "active" ).siblings().removeClass( "active" );
                return false;   // break
            }
        } );
*/
    } );
/*
    // 点击文档内链接后滚动到相应栏目
    $( ".outline-item .o_anchor" ).click( function () {
        var index = $( ".outline-item .o_anchor" ).index( this );
        var targetContent = $( ".content-container .o_anchor" ).eq( index );
        var item = this.parentNode;
        // 
        $( "body,html" ).stop().animate( 
            { scrollTop: targetContent.offset().top + "px" }, 300,
            function () {
                $( item ).addClass( "active" ).siblings().removeClass( "active" );
            } 
        );
        return false;
    } );    
*/    
}

function doSearch() {
    var placeholder = $( ".search-input" ).val();
    $( ".search-input" )
        .data( "value", placeholder )
        .focus( function () {
            if ( ! $( this ).val() || $( this ).val() == placeholder ) {
                $( this ).val("");
            }
        } )
        .blur( function () {
            if ( $( this ).val() == "" ) {
                $( this ).val( $( this ).data( "value" ) );
            }
        } );    
}

function doNavList() {
    var timerId = null;
    $( ".nav-list .list-item" ).hover( 
        function () {
            var submenu = $( this ).find( ".list-item-link" ).attr("submenu");
            if ( submenu ) {
                clearTimeout( timerId );
                showSubmenu( submenu , this );
            }
            $( this ).addClass( "active" ).siblings().removeClass("active");
            $( this ).find(".list-item-link").addClass( "pulse animated" );
        },
        function () {
            var self = this;
            $( this ).removeClass("active");
            $( this ).find(".list-item-link").removeClass(" pulse animated");
            if ( $( ".submenu-container" ).css( "display" ) != "block" ) {
                return;
            }
            $( this ).addClass("active");
            timerId = setTimeout( hideSubmenu , 10 );
        }
    );
    $( ".submenu-container" ).hover(
        function () {
            clearTimeout( timerId );
        },
        function () {
            hideSubmenu();
        }
    );

    function showSubmenu( submenu , targetElt) {
        if ( ! submenu ) {
            return;
        }
        $( "." + submenu ).show().siblings().hide();
        $( ".nav-list .triangle-down" ).hide();
        $( targetElt ).find( ".triangle-down" ).show().addClass("bounceInDown animated");
        $( ".submenu-container" ).show();
        // $( ".submenu-container" ).addClass("bounceInDown animated");
    }
    function hideSubmenu() {
        $( ".submenu-container" ).hide();
        // $( ".submenu-container" ).removeClass("bounceInDown animated");
        $( ".nav-list .triangle-down" ).hide().removeClass("bounceInDown animated");      
        $( ".nav-list .list-item" ).removeClass( "active" );
    }    
}