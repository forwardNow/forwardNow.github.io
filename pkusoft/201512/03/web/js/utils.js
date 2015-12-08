/**
 * utils = {
 *
 *      dynamicLoad
 *          动态载入 css/js 文件
 *
 *      onLoad(f)
 *          文档载入完毕后执行函数f
 *
 *      forEach(nodeList, f)
 *          针对数组和类数组，对每个元素执行函数f(index, elt)
 *
 *      addEvent(arget, type, handler)
 *          注册事件监听，IE中的handler内可以使用this引用target
 *
 *      classList(e)
 *          方便地对元素的类名进行增删改查（针对IE10及以下版本不支持classList属性）
 *
 *      getElementsByClassName(className, parent, tagName)
 *
 * }
 */
;
var utils = {}; // 工具类名称空间

( function () {

    /**
     * 动态载入 css/js 文件
     */
    utils.dynamicLoad = {
        css: function ( path, document ) {
            if ( !path || path.length === 0 ) {
                throw new Error( 'argument "path" is required !' );
            }
            var head = document.getElementsByTagName( 'head' )[ 0 ];
            var link = document.createElement( 'link' );
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild( link );
        },
        js: function ( path, document ) {
            if ( !path || path.length === 0 ) {
                throw new Error( 'argument "path" is required !' );
            }
            var head = document.getElementsByTagName( 'head' )[ 0 ];
            var script = document.createElement( 'script' );
            script.src = path;
            script.type = 'text/javascript';
            head.appendChild( script );
        }
    };


    /**
     * 文档载入完毕后执行函数f
     */
    utils.onLoad = function onLoad( f ) {
        if ( onLoad.loaded )
            window.setTimeout( f, 0 );
        else if ( window.addEventListener )
            window.addEventListener( "load", f, false );
        else if ( window.attachEvent )
            window.attachEvent( "onload", f );
    };
    utils.onLoad.loaded = false;
    utils.onLoad( function () {
        utils.onLoad.loaded = true;
    } );

    /**
     * 针对数组和类数组，对每个元素执行函数f(index, elt)
     * @param nodeList
     * @param f
     */
    utils.forEach = function ( nodeList, f ) {
        for ( var i = 0; i < nodeList.length; i++ ) {
            f.call( nodeList[ i ], i, nodeList[ i ] );
        }
    };

    /**
     * 注册事件监听，IE中的handler内可以使用this引用target
     */
    utils.addEvent = function ( target, type, handler ) {
        if ( target.addEventListener )
            target.addEventListener( type, handler, false );
        else
            target.attachEvent( "on" + type,
                function ( event ) {
                    return handler.call( target, event );
                } );
    };
    utils.bind = function ( el, type, fn ) {
        el.addEventListener ?
            el.addEventListener( type, fn, false )
            :
            el.attachEvent ?
                el.attachEvent( "on" + type, fn )
                :
                el[ 'on' + type ] = fn
        ;
    }

    /**
     * 方便地对元素的类名进行增删改查（针对IE10及以下版本不支持classList属性）
     */
    utils.classList = function ( e ) {
        if ( e.classList ) {
            return e.classList;
        }
        return new CSSClassList( e );
    };

    function CSSClassList( e ) {
        this.e = e;
    }

    CSSClassList.prototype.contains = function ( className ) {
        // 检查 className 的合法性
        if ( className.length === 0 || className.indexOf( " " ) != -1 ) {
            throw new Error( "Invalid class name: '" + className + "'" );
        }

        var classes = this.e.className;

        if ( !classes ) { // 不含类名
            return false;
        }

        if ( classes === className ) { // e仅有一个类，且匹配
            return true;
        }

        // 使用正则搜索 className
        return classes.search( "\\b" + className + "\\b" ) != -1;
    };

    CSSClassList.prototype.add = function ( className ) {
        if ( this.contains( className ) ) return this;
        var classes = this.e.className;
        if ( classes && classes[ classes.length - 1 ] != " " ) {
            className = " " + className;
        }
        this.e.className += className;
        return this;
    };

    CSSClassList.prototype.remove = function ( className ) {

        if ( className.length === 0 || className.indexOf( " " ) != -1 ) {
            throw new Error( "Invalid class name: '" + className + "'" );
        }

        var pattern = new RegExp( "\\b" + className + "\\b\\s*", "g" );
        this.e.className = this.e.className.replace( pattern, "" );

        return this;
    };

    CSSClassList.prototype.toggle = function ( className ) {
        if ( this.contains( className ) ) {
            this.remove( className );
            return this;
        }
        this.add( className );
        return this;
    };

    CSSClassList.prototype.toString = function () {
        return this.e.className;
    };

    CSSClassList.prototype.toArray = function () {
        return this.e.className.match( /\b\w+\b/ ) || [];
    };


    /*
     * 可根据指定parent元素得到指定className的指定tagName的元素集合
     * @param parent 父元素(Element或id字符串)，默认为document
     * @tagName 子元素的标签名
     * @className 用空格分开的className字符串
     */
    utils.getElementsByClassName = function ( className, parent, tagName ) {

        var parent = parent && document.getElementById( parent ) || document;

        if ( !parent ) {
            parent = document;
        } else if ( parent instanceof String ) {
            parent = document.getElementById( parent );
        }

        tagName = tagName || "*";
        className = className.split( " " );
        var classNameLength = className.length;
        for ( var i = 0, j = classNameLength; i < j; i++ ) {
            //创建匹配类名的正则
            className[ i ] = new RegExp( "(^|\\s)" + className[ i ].replace( /\-/g, "\\-" ) + "(\\s|$)" );
        }
        var elements = parent.getElementsByTagName( tagName );
        var result = [];
        for ( var i = 0, j = elements.length, k = 0; i < j; i++ ) {//缓存length属性
            var element = elements[ i ];
            while ( className[ k++ ].test( element.className ) ) {//优化循环
                if ( k === classNameLength ) {
                    result[ result.length ] = element;
                    break;
                }
            }
            k = 0;
        }
        return result;
    }


}() );