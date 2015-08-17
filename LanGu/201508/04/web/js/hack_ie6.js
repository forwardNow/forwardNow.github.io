$( function () {

  // fix <img>
  $( "img" ).attr( "style", function ( index, value ) {
    value = value || "";
    var filter = value + ';filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+this.src+'")';
    this.src = "./images/transparent.gif";
    return filter;
  } );

  $( ".news-date" ).each( function ( index, elt ) {
    $(this).parent().prepend( this );
  } );

} );
