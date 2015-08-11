

function coreAdvantage() {
    $( window ).bind( "scroll", function () {
        var top = document.documentElement.scrollTop || document.body.scrollTop;  
        var viewportHeight = $(window).height();            
        $( ".coreadv-info-title-symbol" ).each( function ( i ) {
            var eltViewportTop = this.getBoundingClientRect().top;
            if ( eltViewportTop > 0 && eltViewportTop < viewportHeight ) {
                $( ".coreadv-info-title-symbol" ).removeClass( "active" );
                $( ".coreadv-info-title-symbol" ).eq( i ).addClass( "active" );
                return false;
            }            
        } );
    } );
}


function outlineScroll () {

    $( window ).bind( "scroll", function scrollHandler () {
        var top = document.documentElement.scrollTop || document.body.scrollTop;  
        var mainOutline = document.getElementById( "mainOutline" ); 
        if( top >= 258 + 40 ) { 
            mainOutline.style.top = ( top - 258 )  + "px"; 
        } else { 
            mainOutline.style.top = 40 + "px";
        } 

        for ( var i = 0; i < $( ".article-mod" ).length; i++ ) {
            var articleMod = $( ".article-mod" )[ i ];
            var viewportTop = articleMod.getBoundingClientRect().top;
            var viewportHeight = $(window).height();
            if ( viewportTop > -100 && viewportTop < viewportHeight - 100 ) {
                $( ".outline-item" ).eq( i ).addClass( "outline-active" ).siblings().removeClass( "outline-active" );
                break;
            }
        }
        
    } );

    
    
    $( ".outline-item" ).click( function () {
        $( this ).addClass( "outline-active" ).siblings().removeClass( "outline-active" );
    });
    
}