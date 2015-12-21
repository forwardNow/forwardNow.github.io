define( [ "jquery", "doT", "utils" ], function ( jquery, doT,utils ) {
    var $ = jquery;

    var PageSlider = {
        cssUrl: require.toUrl( "./workbench/css/style.css" ).replace("script/", ""),
        current: -1,
        pageList: $( '.page-list' ),
        sliders: $( '.sliders-nav>.sliders' ),
        animating: false,
        configs: {
            ANIMATE_EASING: '',
            ANIMATE_TIMES: 400,
            PAGES_TITLE: {
                customs: '开始办理',
                mosts: '最常使用'
            }
        },
        init: function () {
            //this.loadCss(this.cssUrl);
            this.translateTemplate();
            this.render();
            this.bind();
            PageSlider.slideNext();
        },
        render: function () {

        },
        bind: function () {
            var _this = this;
            $( ".sliders-left" ).bind( "click", function () {
                _this.slidePrev();
            } );
            $( ".sliders-right" ).bind( "click", function () {
                _this.slideNext();
            } );
            $( ".sliders>a" ).bind( "click", function () {
                _this.slideTo( $( this ).index() );
            } );
        },
        slideTo: function ( index, animate ) {
            if ( this.animating ) {
                // 上一个动画未结束，不执行新动画
                return false;
            }
            var self = this;
            var pages = $( '.workbench-container .page' );
            var realSlide = index >= 0 && index < pages.length;
            index = Math.max( index, 0 );
            index = Math.min( index, pages.length - 1 );

            if ( index == 0 || pages.length == 0 ) {
                $( '.sliders-left' ).removeClass( 'active' );
            } else {
                $( '.sliders-left' ).addClass( 'active' );
            }
            if ( index == pages.length - 1 || pages.length == 0 ) {
                $( '.sliders-right' ).removeClass( 'active' );
            } else {
                $( '.sliders-right' ).addClass( 'active' );
            }
            $( '.sliders > a' ).removeClass( 'selected' ).eq( index ).addClass( 'selected' );

            var w = document.body.offsetWidth,
                left = pages.slice( 0, index ),
                current = pages.slice( index, index + 1 ),
                right = pages.slice( index + 1 );
            pages.removeClass( 'current' );
            current.addClass( 'current' );

            // 修复IE7下iframe空白的问题
            if (index !== 0 && current.data("isLoaded") !== true) {
                current.find("iframe")[0].contentWindow.location.reload();
                current.data("isLoaded", true);
            }

            if ( animate === false ) {
                this.current = index;
                left.css( {
                    left: -w
                } );
                current.removeClass( 'hidden' ).css( {
                    left: 0
                } );
                right.css( {
                    left: w
                } );
                left.add( right ).addClass( 'hidden' );
            } else {
                this.animating = true;
                var prev = pages.slice( self.current, self.current + 1 );
                if ( prev[ 0 ] != current[ 0 ] ) {
                    prev.animate( {
                        left: self.current > index ? w : -w
                    }, this.configs.ANIMATE_TIMES, this.configs.ANIMATE_EASING );
                }
                left.not( prev ).css( {
                    left: -w
                } );
                current.removeClass( 'hidden' ).animate( {
                    left: 0
                }, this.configs.ANIMATE_TIMES, this.configs.ANIMATE_EASING, function () {
                    left.add( right ).addClass( 'hidden' );
                    current.removeClass( 'hidden' );
                    self.current = index;
                    self.animating = false;
                    //console.log( '### page slide duration: ' + (Date.now() - slideStart) / 1000 + 's' );
                } );
                right.not( prev ).css( {
                    left: w
                } );
            }
            return realSlide;
        },
        slidePrev: function () {
            return this.slideTo( this.current - 1 );
        },
        slideNext: function () {
            return this.slideTo( this.current + 1 );
        },
        translateTemplate: function () {
            var urls = [],
                titles = [],
                html,
                urlsHtml,
                titlesHtml;
            $.each(this.data, function () {
                urls.push( this.pageUrl );
                titles.push( this.pageTitle );
            });
            html = this.template.simple;
            urlsHtml = doT.template(this.template.page)({"array":urls});
            titlesHtml = doT.template(this.template.pageTitle)({"array":titles});

            html = html.replace("${_pages}", urlsHtml ).replace("${_pageTitles}", titlesHtml);
            $(".workbench-container" ).html(html);
            return this;

        },
        setData: function ( data ) {
            this.data = data;
            return this;
        },
        loadCss: function ( url ) {
            utils.dynamicLoad.css( url || "style.css", this.doc );
            return this;
        }
    };
    PageSlider.template = {};
    PageSlider.template.data = [
        {
            pageUrl: "./iframe/1.html",
            pageTitle: "开始办理1"
        },
        {
            pageUrl: "./iframe/2.html",
            pageTitle: "开始办理2"
        },
        {
            pageUrl: "./iframe/3.html",
            pageTitle: "开始办理3"
        },
        {
            pageUrl: "./iframe/4.html",
            pageTitle: "开始办理4"
        }
    ];

    PageSlider.template.simple ='\
<div class="page-area">\
    <div class="page-list">\
        ${_pages}\
    </div>\
</div>\
<div class="sliders-nav">\
    <div class="sliders">${_pageTitles}</div>\
</div>\
<div class="sliders-left sliders-control"><div class="inner"></div></div>\
<div class="sliders-right sliders-control active"><div class="inner"></div></div>\
';
    PageSlider.template.page =
        '{{~it.array:value:index}}' +
            '<div class="page" id="page-{{= index }}">' +
                '<div class="workbench"><div class="hook"></div><div class="workbench-body" style="width: 90%; height: 90%;">' +
                    '<iframe src="{{= value }}" frameborder="0" width="100%" height="100%"></iframe>' +
                '</div></div>' +
            '</div>' +
        '{{~}}';
    PageSlider.template.emptyPage =
        '{{~it.array:value:index}}' +
        '<div class="page" id="page-{{= index }}">' +
            '<iframe src="{{= value }}" frameborder="0" width="100%" height="100%"></iframe>' +
        '</div>' +
        '{{~}}';
    PageSlider.template.pageTitle =
        '{{~it.array:value:index}}' +
            '<a>{{= value }}<i></i></a>' +
        '{{~}}';

    return PageSlider;
} );