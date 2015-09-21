/**
 * Created by forwardNow on 9/21/15.
 */

$( function () {

    var preview = $( "#preview" ),
        zoomMain = $( ".zoom_main" ),
        zoomMainImg = zoomMain.find( ".img" ),
        zoomMainCursor = zoomMain.find( ".cursor" ),
        zoomMainDocPos = zoomMain.offset();
    ;

    // 选中的区域
    zoomMain.mousemove( function ( e ) {

        var cursorWidth = zoomMainCursor.width(),
            cursorHeight = zoomMainCursor.height(),
            mouseOffsetPos = {
                x: e.pageX - zoomMainDocPos.left,
                y: e.pageY - zoomMainDocPos.top
            },
            cursorLeft,
            cursorTop;

        // 最大值
        if ( mouseOffsetPos.x + cursorWidth / 2 > zoomMain.width() ) {
            cursorLeft = zoomMain.width() - cursorWidth;
        } else {
            cursorLeft = mouseOffsetPos.x - cursorWidth / 2;
        }

        if ( mouseOffsetPos.y + cursorHeight / 2 > zoomMain.height() ) {
            cursorTop = zoomMain.height() - cursorHeight;
        } else {
            cursorTop = mouseOffsetPos.y - cursorHeight / 2;
        }

        // 最小值
        cursorLeft = cursorLeft > 0 ? cursorLeft : 0;
        cursorTop = cursorTop > 0 ? cursorTop : 0;

        zoomMainCursor.css( {
            left: cursorLeft,
            top: cursorTop,
        } );

    } );


} );
