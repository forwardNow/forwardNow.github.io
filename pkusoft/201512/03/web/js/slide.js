var slide = {
    timer: {},
    showPageSize: 1,
    container: null,
    pageContainer: null,
    pages: null,
    control: {
        prevBtn: null,
        nextBtn: null
    },
    curIndex: 0,

    init: function ( options ) {
        for ( var prop in options) {
            this[ prop ] = options[ prop ];
        }
        this.render().bind();

    },
    render: function () {
        var get = utils.getElementsByClassName,
            pageWidth,
            pageHeight;

        this.container = get( "js--slideContainer" )[ 0 ];
        this.pageContainer = get( "page-list", this.container )[ 0 ];
        this.pages = get( "page", this.pageContainer );
        this.control.prevBtn = get( "btn-prev", this.container )[ 0 ];
        this.control.nextBtn = get( "btn-next", this.container )[ 0 ];

        pageWidth = parseInt( this.container.clientWidth ) / this.showPageSize + "px";
        pageHeight = parseInt( this.container.clientHeight ) + "px";

        for ( var i = 0; i < this.pages.length; i++ ) {
            this.pages[ i ].style.width = pageWidth;
            this.pages[ i ].style.height = pageHeight;
        }

        return this;
    },
    bind: function () {
        var self = this;
        utils.addEvent( this.control.prevBtn, "click", function () {
            var index = self.curIndex - 1;
            if ( index < 0 ) {
                return;
            }
            self.scroll( index, 300 );
            self.curIndex = index;
        } );
        utils.addEvent( this.control.nextBtn, "click", function () {
            var index = self.curIndex + 1;
            if ( index > self.pages.length - self.showPageSize ) {
                return;
            }
            self.scroll( index, 300 );
            self.curIndex = index;
        } );

        return this;

    },
    scroll: function ( index, duration, callback ) {
        var cssprop = "left",
            target = this.pageContainer,
            timerId = target.id || "pageContainer",
            start = parseInt( target.style[ cssprop ] ) || 0,
            step,
            end = -( 1 / this.showPageSize * index * parseInt( target.parentNode.clientWidth ) ),
            times
            ;

        duration = duration || 300;
        times = Math.ceil( duration / 16 );
        step = Math.ceil( ( end - start ) / times );

        this.animate( timerId, target, start, step, end, cssprop, callback );
        return this;
    },
    animate: function ( timerId, target, start, step, end, cssprop, callback ) {
        if ( this.timer[ timerId ] ) {
            clearInterval( this.timer[ timerId ] );
            this.timer[ timerId ] = null;
        }
        this.timer[ timerId ] = setInterval( this.proxy( this, function () {
            var origin = parseInt( target.style[ cssprop ] ) || start,
                instance = Math.abs( end - origin );
            if ( instance <= Math.abs( step ) ) {
                clearInterval( this.timer[ timerId ] );
                this.timer[ timerId ] = null;
                target.style[ cssprop ] = end + "px";
                callback && callback.apply( this );
                return;
            }
            origin += step;
            target.style[ cssprop ] = origin + "px";
        } ), 15 );
        return this;
    },
    proxy: function ( obj, func ) {
        return function () {
            return func.apply( obj, arguments );
        }
    }
};

slide.template = '\
    <div class="slideContainer js--slideContainer">\
        <div class="page-list-wrap">\
        <ul class="page-list">\
            <li class="page"><img src="${imageURI}" alt=""><i class="hook"></i></li>\
        </ul>\
    </div>\
    <div class="tab">\
        <div class="control">\
            <a class="btn btn-prev" href="javascript:void(0)">&lt;</a>\
            <a class="btn btn-next" href="javascript:void(0)">&gt;</a>\
        </div>\
    </div>\
</div>\
';