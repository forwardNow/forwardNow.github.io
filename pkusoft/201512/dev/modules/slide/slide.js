define( [ "require", "utils" ], function ( require, utils ) {
    var slide = {
        tempContainer: null,
        cssUrl: require.toUrl( "./slide/style.css" ),
        imgUrls: [],
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
            for ( var prop in options ) {
                this[ prop ] = options[ prop ];
            }
            this.loadCss( this.cssUrl ).generateHtml().render().bind();

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
        },
        loadCss: function ( url ) {
            utils.dynamicLoad.css( url || "style.css" );
            return this;
        },
        generateHtml: function () {
            var pagesHtml = "",
                html,
                self = this
                ;
            utils.each( this.imgUrls, function ( index, e ) {
                var pageHtml = self.template.replace( self.template.page, "imgUrl", e );
                pagesHtml += pageHtml;
            } );
            html = this.template.replace( this.template.simple, "_data", pagesHtml );
            utils.outerHTML( this.tempContainer, html );

            return this;
        },
        addPages: function ( imgUrls ) { // [imgUrl, imgUrl2]
            var pagesHtml = "",
                self = this,
                tempDiv;
            utils.each( imgUrls, function ( index, e ) {
                var pageHtml = self.template.replace( self.template.page, "imgUrl", e );
                pagesHtml += pageHtml;
            } );
            tempDiv = document.createElement("div");
            tempDiv.innerHTML = pagesHtml;
            while ( tempDiv.firstChild ) {
                this.pageContainer.appendChild( tempDiv.firstChild );
            }
            this.render();
            tempDiv = null;
            return this;
        },
        removePages: function () { // 参数：index1,index2,... 或 [index1,index2,...]
            var self = this;
            if ( arguments.length > 1 ) {
                utils.each( arguments, function( index ) {
                    self.pageContainer.removeChild( self.pages[ index ] );
                } );
                return this.render();
            }
            if ( arguments.length === 1 &&  arguments[0] instanceof Array ) {
                utils.each( arguments[0], function( index ) {
                    self.pageContainer.removeChild( self.pages[ index ] );
                } );
                return this.render();
            }

            self.pageContainer.removeChild( self.pages[ arguments[0] ] );
            return this.render();
        }
    };

    slide.template = {};
    slide.template.replace = function( target, placeholder, value ) {
        return target.replace( new RegExp( "\\$\\{\\s*" + placeholder + "\\s*\\}", "g" ), value );
    };
    slide.template.simple = '\
    <div class="slideContainer js--slideContainer">\
        <div class="page-list-wrap">\
            <ul class="page-list">${_data}</ul>\
        </div>\
        <div class="tab">\
            <div class="control">\
                <a class="btn btn-prev" href="javascript:void(0)">&lt;</a>\
                <a class="btn btn-next" href="javascript:void(0)">&gt;</a>\
            </div>\
        </div>\
    </div>\
    ';
    slide.template.page = '<li class="page"><img src="${imgUrl}" alt=""><i class="hook"></i><b class="view"></b></li>';

    return slide;
} );