$( function () {
    $( ".js__nav .item" ).bind( "mouseenter", onHander ).bind( "mouseleave", offHandler );

    function onHander () {
        var submenu = $( this ).find(".submenu");
        $( this ).addClass("active");
        if ( submenu.size() > 0 ) {
            $( this ).addClass( "has-submenu" );
            submenu.stop().slideDown();
        }
    }
    function offHandler () {
        var submenu = $( this ).find(".submenu");
        $( this ).removeClass("active");
        if ( submenu.size() > 0 ) {
            $( this ).removeClass( "has-submenu" );
            submenu.hide();
        }
    }
} );