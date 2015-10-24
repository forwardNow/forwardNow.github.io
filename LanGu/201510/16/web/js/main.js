var ns = {
    Slide: null, // 轮播
    hoverMove: null, // hover跟随鼠标移动
    goToTop: null, // 回到顶部
    handleIE: null, // 当使用IE版本小于9时，弹出提示
    font: null // 预下载服务器端字体
};

$( function () {
    ns.handleIE.init();
    ns.goToTop.init();
    ns.font.init( [ 'AovelSans', 'Pristina', 'RocketScript', 'FZTieJinLiShu-S17S', 'FZZhongQian-M16S', 'FZXiDengXian-Z06S' ] );
} );

(function () {

    /**
     * Slide
     * @param options
     * @constructor
     *
     var options = {
        type: "scroll",
        scroll: {
            distance: "100%",
            amount: 1,
            duration: 300, // 滚动所需时间
            delay: 3000    // 自动播放时的延迟
        },
        slideContainer: $( ".js--slideContainer_banner" ),
        pageList: $( ".js--slideContainer_banner .page-list" ),
        indexs: $( ".js--slideContainer_banner .tab .index" ),
        prevBtn: $( ".js--slideContainer_banner .btn-prev" ),
        nextBtn: $( ".js--slideContainer_banner .btn-next" )
    };
     */
    function Slide( options ) {
        this.options = options;
        this.init();
    }

    Slide.prototype.init = function () {
        this.render();
        this.bind();
    };

    Slide.prototype.render = function () {
        this.type = this.options.type;
        this.slideContainer = this.options.slideContainer;
        this.pageList = this.options.pageList;
        this.indexs = this.options.indexs;
        this.prevBtn = this.options.prevBtn;
        this.nextBtn = this.options.nextBtn;

        this.pageSize = this.indexs.size();

        this.pageIndex = 0; // 索引

    };

    Slide.prototype.bind = function () {
        var self = this;

        // index
        this.indexs.bind( "mouseenter", indexHoverHandler );

        // btn
        this.prevBtn.bind( "click", clickPrevBtnHandler );
        this.nextBtn.bind( "click", clickNextBtnHandler );

        // hover时对自动播放的处理
        this.indexs.add(this.prevBtn ).add(this.nextBtn).hover(stopAutoPlayHandler, startAutoPlayHander);

        function indexHoverHandler() {
            doSlide( $( this ).index() );
            self.autoPlay.stop && self.autoPlay.stop();
        }
        function startAutoPlayHander() {
            self.autoPlay.isOn && self.autoPlay.start && self.autoPlay.start();
        }
        function stopAutoPlayHandler() {
            self.autoPlay.stop && self.autoPlay.stop();
        }

        function clickPrevBtnHandler() {
            doSlide( (self.pageIndex - 1 + self.pageSize) % self.pageSize );
        }

        function clickNextBtnHandler() {
            doSlide( (self.pageIndex + 1) % self.pageSize );
        }

        function doSlide( index ) {
            self.play( self.type, index );
            self.pageIndex = index;
        }
    };

    Slide.prototype.play = function ( type, index ) {
        this.animate[ type ].call( this, index );
        this.indexs.eq( index ).addClass( "active" ).siblings().removeClass( "active" );
    };

    Slide.prototype.autoPlay = function autoPlay( isOn, delay ) {
        var self = this;
        autoPlay.isOn = isOn;
        if ( isOn ) {
            start();
        }
        function handler() {
            self.pageIndex = (self.pageIndex + 1) % self.pageSize;
            self.play( self.options.type, self.pageIndex );
        }

        function start() {
            if ( self.intervalId ) {
                clearInterval( self.intervalId );
                self.intervalId = null;
            }
            self.intervalId = setInterval( handler, self.options.scroll.delay );
        }

        function stop() {
            clearInterval( self.intervalId );
            self.intervalId = null;
        }
        this.autoPlay.start = start;
        this.autoPlay.stop = stop;
        return this;
    };


    Slide.prototype.animate = {
        scroll: function ( index ) {
            var distance = this.options.scroll.distance,
                amount = this.options.scroll.amount || 1,
                totalDistance, unitPos;

            unitPos = distance.search( /[^0-9]/ );
            totalDistance = -parseFloat( distance ) * amount * index + distance.substr( unitPos );
            this.pageList.stop().animate( { left: totalDistance }, this.options.scroll.duration );

        }
    };


    ns.Slide = Slide; // 添加进名称空间

    /**
     * 根据鼠标移动方向，处理 hover
     */
    var hoverMove = {
        options: {
            hover: ".hover",
            duration: 300
        },
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {
            this.target = $( ".js--list-pic .item" );
        },
        bind: function () {
            var self = this;
            this.target.bind( "mouseenter", function ( e ) {
                var hover = $( this ).find( self.options.hover ),
                    duration = self.options.duration;
                switch ( self.getMoveDirection( this, e ) ) {
                    case 0 :
                    { // 进【上】
                        hover.css( {
                            left: 0,
                            top: "-100%",
                            right: "auto",
                            bottom: "auto"
                        } ).stop().animate( { top: 0 }, duration );
                        break;
                    }
                    case 1 :
                    { // 进【右】
                        hover.css( {
                            left: "auto",
                            top: 0,
                            right: "-100%",
                            bottom: "auto"
                        } ).stop().animate( { right: 0 }, duration );
                        break;
                    }
                    case 2 :
                    { // 进【下】
                        hover.css( {
                            left: 0,
                            top: "auto",
                            right: "auto",
                            bottom: "-100%"
                        } ).stop().animate( { bottom: 0 }, duration );
                        break;
                    }
                    case 3 :
                    { // 进【左】
                        hover.css( {
                            left: "-100%",
                            top: 0,
                            right: "auto",
                            bottom: "auto"
                        } ).stop().animate( { left: 0 }, duration );
                        break;
                    }
                }
            } );
            this.target.bind( "mouseleave", function ( e ) {
                var hover = $( this ).find( self.options.hover ),
                    duration = self.options.duration;
                switch ( self.getMoveDirection( this, e ) ) {
                    case 0 :
                    { // 出【上】
                        hover.css( {
                            left: 0,
                            top: 0,
                            right: "auto",
                            bottom: "auto"
                        } ).stop().animate( { top: "-100%" }, duration );
                        break;
                    }
                    case 1 :
                    { // 出【右】
                        hover.css( {
                            left: "auto",
                            top: 0,
                            right: 0,
                            bottom: "auto"
                        } ).stop().animate( { right: "-100%" }, duration );
                        break;
                    }
                    case 2 :
                    { // 出【下】
                        hover.css( {
                            left: 0,
                            top: "auto",
                            right: "auto",
                            bottom: 0
                        } ).stop().animate( { bottom: "-100%" }, duration );
                        break;
                    }
                    case 3 :
                    { // 出【左】
                        hover.css( {
                            left: 0,
                            top: 0,
                            right: "auto",
                            bottom: "auto"
                        } ).stop().animate( { left: "-100%" }, duration );
                        break;
                    }
                }
            } );
        },
        getMoveDirection: function getMoveDirection( target, e ) {
            var w, h, x, y, direction;
            w = $( target ).width();
            h = $( target ).height();
            x = (e.pageX - target.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1);
            y = (e.pageY - target.offsetTop - (h / 2)) * (h > w ? (w / h) : 1);

            //direction的值为“0,1,2,3”分别对应着“上，右，下，左;
            direction = Math.round( (((Math.atan2( y, x ) * (180 / Math.PI)) + 180) / 90) + 3 ) % 4;

            return direction;
        }
    };


    ns.hoverMove = hoverMove; // 添加进名称空间ns

    var goToTop = {
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {
            this.target = $( "<div id='goToTop'></div>" );
            this.target.appendTo( document.body );
        },
        bind: function () {
            var self = this;
            this.target.bind( "click", function () {
                $( "html,body" ).animate( { "scrollTop": 0 } );
            } );
            $( window ).bind( "scroll", function () {
                if ( $( this ).scrollTop() > $( this ).height() ) {
                    self.target.fadeIn();
                } else {
                    self.target.fadeOut();
                }
            } );
        }
    };

    ns.goToTop = goToTop; // 添加进名称空间ns

    /**
     * 如果是IE浏览器，则弹出提示
     */
    var handleIE = {
        init: function () {
            if ( !($.browser.msie && $.browser.version < 9) ) {
                return;
            }
            this.render();
            this.bind();
        },
        render: function () {
            this.mask = $( '<div id="bodyMask"></div>' );
            this.browser = $( '<div id="browser" class="layerDiv loaded">' );

            this.mask.appendTo( document.body );
            this.browser.appendTo( document.body );
            this.browser.append( $( "#iebrowsertemp" ).html() );
        },
        bind: function () {
            var self = this;
            $( "#closeBrowser" ).bind( "click", function () {
                self.mask.hide();
                self.browser.hide();
            } );
        }
    };

    ns.handleIE = handleIE; // 添加进名称空间ns


    /**
     * 字体
     */
    var font = {
        init: function ( fontFamilyArray ) {
            this.fontFamilyArray = fontFamilyArray;
            this.render();
        },
        render: function () {
            /*
             <div style="height:0;overflow: hidden;">
             <span style="font-family: 'fz_dengxian'">fz_dengxian</span>
             <span style="font-family: 'rocket_script'">rocket_script</span>
             </div>
             */
            this.container = $( "<div>" ).css( { height: 0, overflow: "hidden" } ).appendTo( document.body );
            for ( var i = 0; i < this.fontFamilyArray.length; i++ ) {
                var font = this.fontFamilyArray[ i ];
                this.container.append( $( "<span>" ).css( { "font-family": font } ).text( font ) );
            }

        }
    }

    ns.font = font; // 添加进名称空间ns

})();