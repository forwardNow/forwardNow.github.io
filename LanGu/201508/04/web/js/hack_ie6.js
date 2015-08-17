$( function () {

  // fix <img>
  window.setTimeout( function() {
    
    $( "img" ).attr( "style", function ( index, value ) {
      value = value || "";
      var filter = value + ';filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+this.src+'")';
      this.src = "./images/transparent.gif";
      return filter;
    } );

  }, 3000 );



  $( ".news-date" ).each( function ( index, elt ) {
    $(this).parent().prepend( this );
  } );

} );
