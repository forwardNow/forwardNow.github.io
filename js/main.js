
$( function () {
    $(".post__front").click( function () {
        $(this).slideUp(300, function () {
            $(this).siblings(".post__back").slideDown();
        });
    } );
} );


/*
<article class="post">
    
    <a class="img-wrap" href="./LanGu/201509/06/web/index.html">
        <img class="post-image attachment-thumbnail" src="./images/item_7.png" alt="">
    </a>
    <div class="post-detail">
        <div class="btitle">
            <span class="author">
                <span class="comment-avatar-wrap"><img src="./images/logo.jpg" alt="" class="avatar"></span>forwardNow
            </span>
            <h2 class="post-title"><a href="./LanGu/201509/06/web/index.html">送物天下</a></h2>
        </div>
        <div class="post-data">
            <a href="#" title="赞"><i class="icon-like"></i><span>3</span></a>
            <a href="#" title="日期"><i class="icon-date"></i><span>2015-09-06</span></a>
        </div>
        <div class="post-category">
            <a href="#"><img src="./images/menu_pw.png" alt=""></a>
        </div>
    </div>

</article>
*/

function Generator( list ) {
    this.list = list || [
        {
            template: "default",
            title: "送物天下",
            url: "./LanGu/201509/06/web/index.html",
            thumbnail: "./images/item_7.png",
            avatar: "./images/logo.jpg",
            num: 3,
            pubdate: "2015-09-06",
            category: "pw"
        }
    ];
    this.init();

}
Generator.prototype.init = function () {
    var $homecontent = $( "#homecontent" );
    for ( var i = 0; i < this.list.length; i++ ) {
        var listitem = $( Generator.template.resolve( this.list[ i ].template, this.list[ i ]) );
        $homecontent.append( listitem );
    }
    
}
Generator.template = {};
Generator.template.resolve = function ( template, options ) {
    var temp = this[ template ];
    for ( var key in options ) {
       temp = temp.replace( new RegExp( "\\$\\{\\s*" + key + "\\s*\\}" ,"g"), options[ key ] );
    }
    return temp;
};
Generator.template["default"] = '\
    <div class="one-third column" role="listitem">\
        <article class="post">\
            <a class="img-wrap" href="${url}">\
                <img class="post-image attachment-thumbnail" src="${thumbnail}" alt="">\
            </a>\
            <div class="post-detail">\
                <div class="btitle">\
                    <span class="author">\
                        <span class="comment-avatar-wrap"><img src="${avatar}" alt="" class="avatar"></span>forwardNow\
                    </span>\
                    <h2 class="post-title"><a href="${url}">${title}</a></h2>\
                </div>\
                <div class="post-data">\
                    <a href="#" title="赞"><i class="icon-like"></i><span>${num}</span></a>\
                    <a href="#" title="日期"><i class="icon-date"></i><span>${pubdate}</span></a>\
                </div>\
                <div class="post-category">\
                    <a href="#"><img src="./images/menu_${category}.png" alt=""></a>\
                </div>\
            </div>\
        </article>\
    </div>\
'; 
var item =
        {
            template: "mobile",
            title: "帝斯力体育健康（微信版）",
            thumbnail: "./images/item_6.png",
            avatar: "./images/logo.jpg",
            num: 3,
            pubdate: "2015-09-06",
            category: "mw",
            back1_url: "./LanGu/201509/02/web/order.html",
            back1_img: "./images/item_6_back_1.jpg",
            back1_title: "免费预约",
            back2_url: "./LanGu/201509/02/web/order.html",
            back2_img: "./images/item_6_back_2.jpg",
            back2_title: "免费预约",
            back3_url: "./LanGu/201509/02/web/order.html",
            back3_img: "./images/item_6_back_3.jpg",
            back3_title: "免费预约",
            back4_url: "./LanGu/201509/02/web/order.html",
            back4_img: "./images/item_6_back_4.jpg",
            back4_title: "免费预约",
            back5_url: "./LanGu/201509/02/web/order.html",
            back5_img: "./images/item_6_back_5.jpg",
            back5_title: "免费预约",
            back6_url: "./LanGu/201509/02/web/order.html",
            back6_img: "./images/item_6_back_6.jpg",
            back6_title: "免费预约",
        }
Generator.template[ "mobile" ] = '\
    <div class="one-third column" role="listitem">\
        <article class="post">\
            <div class="post__front">\
                <a class="img-wrap" href="javascript:void(0)">\
                    <img class="post-image attachment-thumbnail" src="${thumbnail}" alt="">\
                </a>\
                <div class="post-detail">\
                    <div class="btitle">\
                        <span class="author">\
                            <span class="comment-avatar-wrap"><img src="${avatar}" alt="" class="avatar"></span>forwardNow\
                        </span>\
                        <h2 class="post-title"><a href="javascript:void(0)"></a></h2>\
                    </div>\
                    <div class="post-data">\
                        <a href="#" title="赞"><i class="icon-like"></i><span>${num}</span></a>\
                        <a href="#" title="日期"><i class="icon-date"></i><span>${pubdate}</span></a>\
                    </div>\
                    <div class="post-category">\
                        <a href="#"><img src="./images/menu_${category}.png" alt=""></a>\
                    </div>\
                </div>\
            </div>\
            <div class="post__back">\
                <ul class="back__list">\
                    <li class="list__item">\
                        <a href="${back1_url}">\
                            <img class="item__img" src="${back1_img}">\
                            <p class="item__title">${back1_title}</p>\
                        </a>\
                    </li>\
                    <li class="list__item">\
                        <a href="./LanGu/201509/02/web/about_us.html">\
                            <img class="item__img" src="./images/item_6_back_2.jpg">\
                            <p class="item__title">关于我们</p>\
                        </a>\
                    </li>\
                    <li class="list__item">\
                        <a href="./LanGu/201509/02/web/cases.html">\
                            <img class="item__img" src="./images/item_6_back_3.jpg">\
                            <p class="item__title">经典案例</p>\
                        </a>\
                    </li>\
                    <li class="list__item">\
                        <a href="./LanGu/201509/02/web/cases_detail.html">\
                            <img class="item__img" src="./images/item_6_back_4.jpg">\
                            <p class="item__title">经典案例-详情</p>\
                        </a>\
                    </li>\
                    <li class="list__item">\
                        <a href="./LanGu/201509/02/web/team.html">\
                            <img class="item__img" src="./images/item_6_back_5.jpg">\
                            <p class="item__title">团队风采</p>\
                        </a>\
                    </li>\
                    <li class="list__item">\
                        <a href="./LanGu/201509/02/web/news.html">\
                            <img class="item__img" src="./images/item_6_back_6.jpg">\
                            <p class="item__title">文章（图文）</p>\
                        </a>\
                    </li>\
                </ul>\
            </div>\
        </article>\
    </div>\
';



function submenu() {

    /* 子菜单显示与隐藏 */ 
    $( ".menumain-item" ).bind({
        mouseover: function () {
            $( ".sub-menu", this ).stop().slideDown(300);
        },
        mouseout: function () {
            $( ".sub-menu", this ).stop().slideUp(300);
        }
    });
    /* 当屏幕小于960时对子菜单的处理 */
    $( ".menu-control" ).click( function () {
        $( this ).toggleClass( "menu-control-h" );
        if ( $( this ).hasClass( "menu-control-h" ) ) {
            $( ".header" ).slideDown(300);
        } else {
            $( ".header" ).slideUp(300);
        }

        $( ".menumain-item" ).unbind( "mouseover" ).unbind( "mouseout" );

    } );

}

/* 回到顶部 */
function scrollToTop () {

    $( window ).bind( "scroll", function () {
        var scrollTop = parseInt( $( this ).scrollTop() );
        var windowHeight = parseInt( $( this ).height() ) / 2;
        if ( scrollTop > windowHeight ) {
            $( "#go-top" ).fadeIn();
        } else {
            $( "#go-top" ).fadeOut();
        }
    } );
    $( "#go-top a" ).bind( "click", function () {
        $('html, body').animate( { scrollTop: 0 }, 300 ); 
    } );

}



/* 滚动加载 */
function pageMore(){
    var page = 1;
    var loadingFlag = false;
    var counter = 4;
    function scrollListen(){
        $(document).scroll(function(){
            var bottomPadding = $(document).height() - $(document).scrollTop() - $(window).height();
            console.info(bottomPadding);
            if( bottomPadding < 50 && !loadingFlag ){
                loadingFlag = true;
                pageShow();
                page++;

            }
        });
    }
    function pageShow() {
        /*
        var _url = "?action=pageMore&page="+page;
        $.ajax({
            url: _url, type: 'GET', dataType: 'text', timeout: 200, 
            error: function(){ 

            },
            success: function( feedback ) {
                loadingFlag = false;
                $('#homecontent').append(feedback);
                $('#infscr-loading').hide();
            }
        });
        */
        if ( counter-- < 0 ) {
            $('#infscr-loading').hide();
            return;
        }
        var clones = $( "div[role='listitem']:lt(4)" ).clone();
        $('#homecontent').append( clones );   
        $('#infscr-loading').hide();   
        loadingFlag = false;  
    }

    scrollListen();
}





