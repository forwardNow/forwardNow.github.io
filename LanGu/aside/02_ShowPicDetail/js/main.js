/**
 * Created by forwardNow on 9/21/15.
 */

var preview = {
    options: {
        self: "#preview",
        zoomMain: ".zoom_main",
        zoomMainImg: ".img",
        zoomMainCursor: ".cursor",
        zoomDetail: ".zoom_detail",
        zoomDetailImg: ".img"
    },
    init: function () {
        this.render();
        this.bind();
        this.thumbnail.init();
    },
    render: function () {
        this.self = $( this.options.self );
        this.zoomMain = $( this.options.zoomMain, this.self );
        this.zoomMainImg = $( this.options.zoomMainImg, this.zoomMain );
        this.zoomMainCursor = $( this.options.zoomMainCursor, this.zoomMain );
        this.zoomDetail = $( this.options.zoomDetail, this.self );
        this.zoomDetailImg = $( this.options.zoomDetailImg, this.zoomDetail );
    },
    bind: function () {
        var self = this;
        var zoomMain = self.zoomMain;
        var zoomMainCursor = self.zoomMainCursor;
        var zoomMainImg = self.zoomMainImg;
        var zoomDetailImg = self.zoomDetailImg;
        var zoomMainDocPos = self.zoomMain.offset();
        zoomMain.mousemove( function ( e ) {
            var cursorWidth = zoomMainCursor.width(),
                cursorHeight = zoomMainCursor.height(),
                mouseOffsetPos = {
                    x: e.pageX - zoomMainDocPos.left,
                    y: e.pageY - zoomMainDocPos.top
                },
                cursorLeft,
                cursorTop;

            moveCursor();

            viewDetail();

            function viewDetail() {
                //console.info( zoomDetail, zoomDetailImg );
                zoomDetailImg.css( {
                    left: -cursorLeft / zoomMainImg.width() * zoomDetailImg.width(),
                    top: -cursorTop / zoomMainImg.height() * zoomDetailImg.height()
                } );
            }

            // 移动光标区域
            function moveCursor() {

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
                //console.info( cursorLeft, cursorTop );
                zoomMainCursor.css( {
                    left: cursorLeft,
                    top: cursorTop
                } );
            }
        } ).mouseover( function () {
            self.zoomDetail.show();

        } ).mouseout( function () {
            self.zoomDetail.hide();
        } );
    }
};


preview.thumbnail = {
    options: {
        self: ".thumbnail",
        list: ".list",
        items: ".item",
        img: ".img",
        selecteditemClass: "item_selected"
    },
    init: function () {
        this.render();
        this.bind();
    },
    render: function () {
        this.self = $( this.options.self );
        this.list = $( this.options.list, this.self );
        this.items = $( this.options.items, this.self );
    },
    bind: function () {
        var self = this;
        // 点击缩略图，更换图片
        this.items.click( function () {

            var img = $( this ).find( self.options.img ),
                midImgSrc = img.attr( "data-mid-img" ),
                bigImgSrc = img.attr( "data-big-img" );
            preview.zoomMainImg.attr( "src", midImgSrc );
            preview.zoomDetailImg.attr( "src", bigImgSrc );
            self.items.removeClass( self.options.selecteditemClass );
            $( this ).addClass( self.options.selecteditemClass );
        } );
    }
};
$( function () {
    preview.init();


} );
